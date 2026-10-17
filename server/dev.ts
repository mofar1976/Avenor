import { createServer } from 'node:http'
import { handlePayment } from './payments.ts'

// Local adapter for the same Web Request handler used by the serverless entry.
createServer(async (incoming, outgoing) => {
  try {
    const chunks: Buffer[] = []
    let size = 0
    for await (const chunk of incoming) {
      size += chunk.length
      if (size > 262_144) {
        outgoing.writeHead(413).end()
        return
      }
      chunks.push(chunk)
    }
    const headers = new Headers()
    for (const [name, value] of Object.entries(incoming.headers)) {
      if (typeof value === 'string') headers.set(name, value)
    }
    const request = new Request(`http://127.0.0.1:4242${incoming.url}`, {
      method: incoming.method,
      headers,
      ...(incoming.method !== 'GET' && incoming.method !== 'HEAD'
        ? { body: Buffer.concat(chunks) }
        : {}),
    })
    const response = await handlePayment(request)
    outgoing.writeHead(response.status, Object.fromEntries(response.headers))
    outgoing.end(Buffer.from(await response.arrayBuffer()))
  } catch {
    outgoing.writeHead(500).end()
  }
}).listen(4242, '127.0.0.1', () =>
  console.log('AVENOR payment API: http://127.0.0.1:4242'),
)
