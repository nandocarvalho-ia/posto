// Proteção de borda (Vercel): basic-auth com falha fechada.
// Sem BASIC_AUTH_USER/PASS configurados, nada é servido.
export const config = { matcher: ['/(.*)'] }

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}

export default function middleware(req: Request) {
  const u = process.env.BASIC_AUTH_USER
  const p = process.env.BASIC_AUTH_PASS
  if (u && p) {
    const expected = 'Basic ' + btoa(`${u}:${p}`)
    const got = req.headers.get('authorization') ?? ''
    if (timingSafeEqual(got, expected)) return
  }
  return new Response('Autenticação necessária.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Painel Posto Carvalho"' },
  })
}
