import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev_secret_change_me'

export function signToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn })
}

export function verifyToken(token: string) {
  try {
    const data = jwt.verify(token, SECRET) as any
    return { ok: true, data }
  } catch (err) {
    return { ok: false }
  }
}

export function getTokenFromReq(req: NextRequest | Request) {
  // support NextRequest (server) and standard Request
  try {
    // Authorization header
    const headers = (req as any).headers
    if (headers) {
      const auth = headers.get ? headers.get('authorization') : headers['authorization']
      if (auth && auth.startsWith && auth.startsWith('Bearer ')) return auth.split(' ')[1]
    }

    // NextRequest cookies API
    try {
      // @ts-ignore
      if (typeof (req as any).cookies?.get === 'function') {
        // NextRequest.cookies.get returns a Cookie object
        const c = (req as any).cookies.get('token')
        if (c && c.value) return c.value
      }
    } catch (e) {
      // ignore
    }

    // Fallback to raw cookie header parsing
    const cookieHeader = headers && headers.get ? headers.get('cookie') : (headers && headers.cookie) || ''
    const match = (cookieHeader || '').match(/(?:^|; )token=([^;]+)/)
    if (match) return decodeURIComponent(match[1])
  } catch (err) {
    // ignore
  }
  return null
}
