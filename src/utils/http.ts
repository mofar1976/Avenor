export class RequestError extends Error {
  readonly kind: 'http' | 'invalid-data'
  readonly status?: number

  constructor(kind: 'http' | 'invalid-data', status?: number) {
    super(
      kind === 'http'
        ? `HTTP request failed (${status})`
        : 'Unexpected API response',
    )
    this.name = 'RequestError'
    this.kind = kind
    this.status = status
  }
}

export async function getJson(
  url: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const timeout = AbortSignal.timeout(15_000)
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout
  const response = await fetch(url, {
    signal: requestSignal,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new RequestError('http', response.status)
  try {
    return await response.json()
  } catch (error) {
    if (requestSignal.aborted) throw error
    throw new RequestError('invalid-data')
  }
}
