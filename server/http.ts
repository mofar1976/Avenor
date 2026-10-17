export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code)
  }
}

export function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function readBody(request: Request, limit = 32_768) {
  if (!request.body) throw new ApiError(400, 'invalid-request')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) {
        await reader.cancel()
        throw new ApiError(413, 'invalid-request')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks)
}

export function appOrigin() {
  const raw = process.env.APP_ORIGIN
  if (!raw) throw new ApiError(503, 'not-configured')
  const url = new URL(raw)
  if (
    url.origin !== raw ||
    (url.protocol !== 'https:' &&
      !(
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname)
      ))
  )
    throw new ApiError(503, 'not-configured')
  return raw
}

export function requireOrigin(request: Request) {
  if (request.headers.get('origin') !== appOrigin())
    throw new ApiError(403, 'forbidden')
}

export async function bodyJson(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new ApiError(415, 'invalid-request')
  try {
    return JSON.parse((await readBody(request)).toString('utf8')) as unknown
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(400, 'invalid-request')
  }
}
