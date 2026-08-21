const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function request(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain' },
    body: JSON.stringify(body),
  })

  const contentType = response.headers.get('content-type') || ''
  const rawText = await response.text()

  let data = rawText
  if (rawText) {
    const trimmed = rawText.trim()
    if (trimmed && contentType.includes('application/json')) {
      try {
        data = JSON.parse(trimmed)
      } catch {
        data = trimmed
      }
    } else {
      data = trimmed || ''
    }
  }

  if (!response.ok) {
    throw new Error(typeof data === 'string' ? data : 'The request could not be completed.')
  }

  return data
}
