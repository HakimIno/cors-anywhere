import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors({ origin: '*' })) // กำหนด origin ที่คุณต้องการอนุญาต

app.post('/send', async (c) => {
  try {
    const requestBody = await c.req.json() // อ่านข้อมูลจาก body ของคำขอ

    const apiResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // ใช้ requestBody แทน req.body
    })

    const data = await apiResponse.json()
    const status = apiResponse.status

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      throw new Error(`API error: ${apiResponse.statusText} - ${errorText}`)
    }

    //@ts-ignore
    return c.json(data, status) // ส่งข้อมูลและสถานะออกไป
  } catch (error: any) {
    console.error('Error:', error)
    return c.json({ error: error.message }, 500)
  }
})

export default app
