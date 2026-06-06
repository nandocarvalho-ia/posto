# Agente Nanda — Posto Carvalho (N8N)

Documentação de entrega dos workflows N8N do atendimento WhatsApp do **Posto Carvalho** (atendente **Nanda**).
Construído no MCP **N8N-Nando** (instância `https://n8n-n8n.msivuw.easypanel.host`).

> ⚠️ Os 3 workflows estão **criados e INATIVOS**. Só ative depois de configurar as credenciais (abaixo).

---

## 1. Workflows criados

| Workflow | ID | Nós | Função |
|---|---|---|---|
| **Posto Carvalho - Atendimento (Nanda)** | `QK6gdUvl3yfMF07J` | 29 | Inbound principal (webhook → Nanda → envio) |
| **atualizar_preco_posto** | `vP8oDNnAJprJjGnt` | 7 | Sub-workflow tool com trava de autorização + RPC |
| **classificador_posto** | `jToYwoSA5EZZzdeP` | 7 | Pós-turno: UPSERT em `clientes` (Opção A) |

URLs:
- https://n8n-n8n.msivuw.easypanel.host/workflow/QK6gdUvl3yfMF07J
- https://n8n-n8n.msivuw.easypanel.host/workflow/vP8oDNnAJprJjGnt
- https://n8n-n8n.msivuw.easypanel.host/workflow/jToYwoSA5EZZzdeP

**Webhook de produção (configurar na Uazapi):**
`https://n8n-n8n.msivuw.easypanel.host/webhook/posto-inbound`

---

## 2. PENDÊNCIAS DO NANDO (antes de ativar)

### 2.1 Criar credencial Postgres do Posto  ← obrigatório
- Tipo: **Postgres**
- Host: `db.vrnnnuaiosxismyatxgb.supabase.co` · DB: `postgres` · User: `postgres`
- Password: **(senha do banco do Supabase Posto Carvalho)**
- Port: `5432` · SSL: `require`
- Sugestão de nome: **Postgres Posto Carvalho**

Hoje o MCP auto-atribuiu a credencial **"Postgres account" (do Wesley)** a todos os nós Postgres,
porque era a única do tipo. **Re-selecione a credencial do Posto** nestes nós:
- `atualizar_preco_posto`: **Verificar Autorizacao**, **Executar RPC atualizar_preco**
- `classificador_posto`: **Pegar Prompt Classificador**, **Upsert Cliente**
- principal: **Limpar Memoria**, **Buscar Cliente**, **Pegar Prompt**, **Pegar Precos**, **Memoria Nanda**

### 2.2 Criar credencial Uazapi (Header Auth)  ← obrigatório
- Tipo: **Header Auth** (`httpHeaderAuth`)
- Name: `token` · Value: `698fc294-7c4d-4a29-b3ae-48ecdefdfcef`
- Sugestão de nome: **Uazapi Posto Carvalho**
- Selecionar nos 3 nós HTTP do principal: **Avisar Reset**, **Pedir Texto**, **Enviar Texto**
  (ficaram sem credencial — o MCP não atribui Header Auth automaticamente).

### 2.3 Confirmar credenciais reutilizadas
- **OpenAI**: usando **"OpenAi Wesley"** (mesma API key funciona). Se quiser separar billing, crie uma dedicada e troque em **Modelo Nanda** e **Modelo Classificador**.
- **Redis**: usando **"Redis account"** (VPS compartilhada). Confirme que é a mesma instância do Daniel/Wesley. As chaves do Posto são prefixadas (`posto:pausa:`, `posto:last:`), então não há colisão.

### 2.4 Configurar o webhook na Uazapi
Apontar a instância `557381379532` para `https://n8n-n8n.msivuw.easypanel.host/webhook/posto-inbound`.

### 2.5 Popular `numeros_autorizados`
A tabela está **vazia**. Inserir os números que podem alterar preço, ex.:
```sql
insert into numeros_autorizados (numero, nome, ativo) values
  ('55SEUNUMERO', 'Nando', true);
```
(`numero` em dígitos, padrão DDI+DDD+numero, igual ao formato do `telefone` parseado.)

### 2.6 Ativar
Depois do acima: **ativar** o principal e dar **publish** (em draft o webhook de produção não pega o fix).
O sub-workflow e o classificador não precisam estar ativos (são chamados por execução).

---

## 3. Arquitetura do principal (ordem)

```
Webhook (posto-inbound)
  → Parse Webhook (telefone, mensagem, from_me, tipo, message_id, last8)
  → IF from_me?  ── sim → Pausar Contato (redis set posto:pausa:<last8>)
  → IF /delete?  ── sim → Limpar Pausa + Limpar Memoria + Avisar Reset
  → IF é texto?  ── não → Pedir Texto ("só por texto")
  → Checar Pausa → IF pausado? ── sim → Fim
  → [DEBOUNCE] Marcar Ultima → Aguardar 10s → Ler Ultima → IF sou a última? ── não → Fim
  → Buscar Cliente (left join, sempre 1 linha)
  → Pegar Prompt (prompt_posto tipo=padrao)
  → Pegar Precos (json_agg)
  → Montar Contexto (system = colunas do prompt + PREÇOS ATUAIS injetados + dados do cliente)
  → Nanda (agent gpt-4.1-mini, web search, memória Postgres, tool atualizar_preco)
  → Preparar Resposta (limpa marcadores)
  → Enviar Texto (Uazapi /send/text)
  → Classificador (Pós-Turno) (executeWorkflow, não bloqueia)
```

---

## 4. Decisões de engenharia (diferenças vs. especificação)

1. **`consultar_precos` por injeção de contexto** (não como tool separada). O nó **Pegar Precos** lê a tabela a cada turno e o **Montar Contexto** injeta os preços reais no system prompt. Garante "nunca inventar preço" e `valor=0 → a confirmar`, com menos custo/latência e sem credencial extra. Se preferir como tool chamável, dá pra adicionar.
2. **`enviar_localizacao` ainda não é tool Uazapi** (sem coordenadas). O endereço vai por texto (conhecimento do prompt), conforme item 3.2. Quando tiver LAT/LNG, viro tool de location.
3. **Debounce "última mensagem vence"** (Redis set/get) em vez de buffer-concatenação (evita ops de lista frágeis). Cumpre o objetivo principal (não responder 2-3x). Mensagens fragmentadas: vale a última. Dá pra evoluir.
4. **Pausa `from_me` sem TTL** (o nó Redis v1 não tem TTL no `set`). Persiste até o contato mandar `/delete` (que limpa) ou remoção manual da chave `posto:pausa:<last8>`.
5. **Áudio/imagem**: respondidos pedindo texto (sem transcrição), conforme spec.
6. **Classificador em sub-workflow paralelo** disparado pós-envio (`waitForSubWorkflow:false`) — evita race condition (aprendizado de produção da skill).
7. **Postgres para todo acesso a banco** (cliente, prompt, preços, RPC, upsert, memória). O usuário `postgres` ignora RLS, mesmo efeito do service role. Uma credencial só.
8. **`atualizar_preco` — `numero` é injetado do remetente real** (`$('Parse Webhook').telefone`), nunca vem da IA. `produto`/`valor` vêm do `$fromAI`. Trava de segurança: a IA não escolhe de quem é o número.
9. **Modelo `gpt-4.1-mini`** conforme pedido (o builder do n8n sugere GPT-5, mas mantive sua escolha). Web search via Responses API (built-in tool, searchContextSize=medium, country=BR).

---

## 5. Testes executados (nível banco, via MCP Supabase)

✅ `precos` retorna os 4 produtos (equivale ao consultar_precos)
✅ Autorização: número **não** autorizado → `false` (workflow bloqueia); autorizado → `true` (segue)
✅ RPC `atualizar_preco('gasolina_comum', 5.89, <num>)` → `{sucesso:true, valor_anterior:0, valor_novo:5.89}`
✅ `precos` atualizado para 5.890 e `precos_historico` registrou (com nome do autorizado + timestamp)
✅ Revertido para 0 e dados de teste removidos — **banco no estado inicial**

⏳ **Falta (só o Nando faz):** teste real ponta a ponta pelo WhatsApp + execução dos nós n8n (depende das credenciais Postgres/Uazapi do Posto). Roteiro abaixo.

---

## 6. Roteiro de teste do Nando (após credenciais + ativar)

1. "qual o preço da gasolina?" → deve perguntar **Comum ou Aditivada?**
2. "qual o preço do S10?" → responde o valor da tabela + puxa papo perguntando a cidade
3. "sou de Vitória da Conquista" → comenta algo real da cidade **em forma de pergunta** (valida web search; se inventar/errar feio, a busca não está ativa)
4. "sou de Jequié" → trata como local (São João/Natal/tempo conforme a época), não como forasteiro
5. "como chego aí?" → manda o endereço (texto)
6. (de número **autorizado**) "GC 5,89" → confirma e grava; conferir no painel
7. (de número **não autorizado**) "GC 5,89" → resposta de não autorizado

> Os valores de preço estão todos em **0** (a confirmar). Para o teste ficar realista, defina preços reais por um número autorizado (mensagem "GC 5,89" etc.) ou via painel.
