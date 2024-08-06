import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors({ origin: '*' })) // กำหนด origin ที่คุณต้องการอนุญาต

app.get('/', (c) => c.text('cors-anywhere!'))

app.post('/send', async (c) => {
  try {
    const requestBody = await c.req.json()

    const apiResponse = await fetch(String(Bun.env.ENDPOINT_EXPO_PUSH), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await apiResponse.json()
    const status = apiResponse.status

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      throw new Error(`API error: ${apiResponse.statusText} - ${errorText}`)
    }

    //@ts-ignore
    return c.json(data, status)
  } catch (error: any) {
    console.error('Error:', error)
    return c.json({ error: error.message }, 500)
  }
})

export default app
