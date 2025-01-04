import type { APIRoute } from 'astro'
import { createCanvas, loadImage } from 'canvas'

const DARK_BACKGROUND = '#1a1b1e'
const DARK_TEXT = '#ffffff'
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 630

export const get: APIRoute = async ({ request }) => {
    const url = new URL(request.url)
    const title = url.searchParams.get('title') || 'My Blog'
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = DARK_BACKGROUND
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const photo = await loadImage('/my-photo.png')
    const photoSize = 240
    const photoX = 80
    const photoY = (CANVAS_HEIGHT - photoSize) / 2
    ctx.drawImage(photo, photoX, photoY, photoSize, photoSize)

    ctx.fillStyle = DARK_TEXT
    ctx.font = '700 56px Inter'
    ctx.textBaseline = 'middle'

    const maxWidth = CANVAS_WIDTH - photoX - photoSize - 160
    const words = title.split(' ')
    let line = ''
    let y = CANVAS_HEIGHT / 2
    const lineHeight = 70

    words.forEach((word, index) => {
        const testLine = line + word + ' '
        if (ctx.measureText(testLine).width > maxWidth && index > 0) {
            ctx.fillText(line.trim(), photoX + photoSize + 80, y)
            line = word + ' '
            y += lineHeight
        } else {
            line = testLine
        }
    })
    ctx.fillText(line.trim(), photoX + photoSize + 80, y)

    return new Response(canvas.toBuffer('image/png'), {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000',
        },
    })
}
