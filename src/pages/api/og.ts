import type { APIRoute } from 'astro';
import { createCanvas, loadImage, CanvasRenderingContext2D, Canvas, registerFont } from 'canvas';
import path from 'path';

const DARK_BACKGROUND = '#020617';
const DARK_TEXT = '#e2e8f0';
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const DECORATIVE = '#a5b4fc';

export const prerender = false;

const FONT_FAMILY = 'Mona Sans';

registerFont(path.join(process.cwd(), 'public', 'fonts', 'Inter.ttf'), {
    family: FONT_FAMILY
});

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const rawTitle = url.searchParams.get('title');
        const rawHashtags = url.searchParams.get('hashtags');

        console.log('Received request for title:', rawTitle);

        if (!rawTitle) {
            console.error('Missing title parameter');
            return new Response('Title parameter is required', {
                status: 400,
            });
        }

        let title = decodeURIComponent(rawTitle);
        if (title.includes('%')) {
            title = decodeURIComponent(title);
        }

        const baseUrl = `${url.protocol}//${url.host}`;
        const photoUrl = `${baseUrl}/photo.jpeg`;

        const canvas: Canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gradient.addColorStop(1, DARK_BACKGROUND);
        gradient.addColorStop(0, '#475569');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.textAlign = 'left';

        try {
            const photoResponse = await fetch(photoUrl);
            if (!photoResponse.ok) {
                throw new Error(`Failed to fetch image: ${photoResponse.statusText}`);
            }

            const contentType = photoResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('image/')) {
                throw new Error(`Invalid content type: ${contentType}`);
            }

            const photoArrayBuffer = await photoResponse.arrayBuffer();
            const photoBuffer = Buffer.from(photoArrayBuffer);

            const photo = await loadImage(photoBuffer).catch((error: unknown) => {
                throw new Error(`Failed to load image: ${(error as Error).message}, Content-Type: ${contentType}`);
            });
            const photoSize = 240;
            const padding = 40;
            const photoX = CANVAS_WIDTH - photoSize - padding;
            const photoY = CANVAS_HEIGHT - photoSize - padding;

            ctx.save();
            ctx.beginPath();
            ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(photo, photoX, photoY, photoSize, photoSize);
            ctx.restore();

            const linkSize = 48;
            ctx.font = `bold ${linkSize}px ${FONT_FAMILY}`;
            ctx.fillStyle = DECORATIVE;
            ctx.textAlign = 'right';
            ctx.fillText('szkudelski.dev', CANVAS_WIDTH - padding, padding + linkSize);
        } catch (imageError: unknown) {
            console.error('Failed to load profile image:', imageError);
            console.error('Image URL attempted:', photoUrl);
        }

        const hashtags = rawHashtags
            && decodeURIComponent(rawHashtags).split(',').map(tag =>
                tag.startsWith('#') ? tag : `#${tag}`
            ).slice(0, 5)

        if (hashtags) {
            const tagsSize = 32;
            ctx.font = `bold ${tagsSize}px ${FONT_FAMILY}`;
            ctx.fillStyle = DECORATIVE;
            ctx.textAlign = 'left';
            const hashtagPadding = 40;
            const hashtagY = CANVAS_HEIGHT - hashtagPadding;
            let currentX = hashtagPadding;

            hashtags.forEach((tag) => {
                ctx.fillText(tag, currentX, hashtagY);
                currentX += ctx.measureText(tag).width + 14;
            });
        }
        ctx.textAlign = 'center';

        const wrapText = (
            context: CanvasRenderingContext2D,
            text: string,
            x: number,
            y: number,
            maxWidth: number,
            lineHeight: number
        ): number => {
            const words = text.split(' ');
            let line = '';
            let testLine = '';
            let testWidth = 0;
            const lineArray: string[] = [];

            for (let n = 0; n < words.length; n++) {
                testLine += `${words[n]} `;
                testWidth = context.measureText(testLine).width;
                if (testWidth > maxWidth && n > 0) {
                    lineArray.push(line);
                    line = `${words[n]} `;
                    testLine = `${words[n]} `;
                } else {
                    line += `${words[n]} `;
                }
            }
            lineArray.push(line);
            for (let k = 0; k < lineArray.length; k++) {
                context.fillText(lineArray[k], x, y + (k * lineHeight));
            }

            return lineArray.length
        };

        const maxWidth = CANVAS_WIDTH - 160;
        const lineHeight = 64;
        const x = CANVAS_WIDTH / 2;
        const y = (CANVAS_HEIGHT / 2) - 80;

        ctx.fillStyle = DARK_TEXT;
        ctx.font = `bold ${lineHeight}px ${FONT_FAMILY}`;
        const titleLinesAmount = wrapText(ctx, title, x, y, maxWidth, lineHeight);

        ctx.strokeStyle = DECORATIVE;
        ctx.lineWidth = 4;
        const accentY = y + (titleLinesAmount * (lineHeight * 0.75));
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2 - 50, accentY);
        ctx.lineTo(CANVAS_WIDTH / 2 + 50, accentY);
        ctx.stroke();

        ctx.font = `bold 48px ${FONT_FAMILY}`;
        ctx.fillText("Marek Szkudelski", CANVAS_WIDTH / 2, accentY + lineHeight);

        return new Response(canvas.toBuffer('image/png'), {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error: unknown) {
        console.error('Error generating OG image:', error);
        return new Response(`Failed to generate image: ${(error as Error).message}`, {
            status: 500,
        });
    }
};
