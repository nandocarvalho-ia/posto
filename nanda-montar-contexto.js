const NL = String.fromCharCode(10);
const p = $('Pegar Prompt').first().json;
const precos = $('Pegar Precos').first().json.precos || [];
const cli = $('Buscar Cliente').first().json || {};
const pw = $('Parse Webhook').first().json;

// Mensagem final: usa a tratada (áudio transcrito / imagem descrita / texto) com fallback
let mensagemFinal = pw.mensagem;
try { const mt = $('Mensagem Tratada').first().json; if (mt && mt.mensagem) mensagemFinal = mt.mensagem; } catch (e) {}

let system = [p.identidade, p.conhecimento, p.regras_preco, p.regras_finais, p.regra_fundamental].filter(Boolean).join(NL + NL);

// ---- Preços atuais ----
const arr = Array.isArray(precos) ? precos : [];
const linhas = arr.map(function (x) {
  const v = Number(x.valor);
  const disp = (v > 0 && x.ativo) ? ('R$ ' + v.toFixed(2).replace('.', ',')) : 'a confirmar no posto';
  return '- ' + x.nome + ' (' + x.sigla + '): ' + disp;
}).join(NL);

// ---- Data/hora local (Bahia) + período comercial ----
let agora;
try { agora = $now.setZone('America/Bahia'); } catch (e) { agora = $now; }
let dataHora, hora;
try { dataHora = agora.toFormat('dd/LL/yyyy HH:mm'); hora = agora.hour; }
catch (e) { const d = new Date(); hora = (d.getUTCHours() + 21) % 24; dataHora = d.toISOString(); }
const comercial = (hora >= 6 && hora < 18) ? 'sim' : 'nao';

// ---- Identificação da pessoa pelo telefone (com e sem 9o digito) ----
const tel = String(pw.telefone || '');
const autorizados = {
  '5575992312986': 'Nando', '557592312986': 'Nando',
  '5573988236527': 'Dalva', '557388236527': 'Dalva',
  '5573981809680': 'Bruno', '557381809680': 'Bruno'
};
const donos = { '5573991378301': 'Seu Fernando', '557391378301': 'Seu Fernando' };
let quemE = 'Cliente comum (lead) - siga o script normal de atendimento';
let autorizadoAlterar = 'nao';
if (donos[tel]) {
  quemE = 'Seu Fernando (dono do posto)';
} else if (autorizados[tel]) {
  quemE = autorizados[tel] + ' (equipe - numero autorizado a alterar precos)';
  autorizadoAlterar = 'sim';
}

const ctxLoja = NL + NL + '=== PRECOS ATUAIS (fonte oficial, use exatamente estes; nunca invente) ===' + NL + linhas;

const ctxAmbiente = NL + NL + '=== CONTEXTO ATUAL ===' + NL +
  'Data/hora (Bahia): ' + dataHora + NL +
  'Horario comercial (06h-18h): ' + comercial + NL +
  'Telefone do cliente: ' + tel + NL +
  'Quem e: ' + quemE + NL +
  'Autorizado a alterar precos: ' + autorizadoAlterar;

const conhecido = [];
if (cli && cli.nome) conhecido.push('nome: ' + cli.nome);
if (cli && cli.cidade) conhecido.push('cidade: ' + cli.cidade);
if (cli && cli.interesse) conhecido.push('interesse: ' + cli.interesse);
if (cli && cli.observacoes) conhecido.push('observacoes: ' + cli.observacoes);
const ctxCli = conhecido.length ? (NL + NL + '=== O QUE JA SABEMOS DESTE CLIENTE ===' + NL + conhecido.join(NL)) : '';

system = system + ctxLoja + ctxAmbiente + ctxCli;

return [{ json: { system_prompt: system, mensagem: mensagemFinal, telefone: pw.telefone, last8: pw.last8 } }];
