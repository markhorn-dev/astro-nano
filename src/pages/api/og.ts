import type { APIRoute } from 'astro';
import { createCanvas, loadImage } from 'canvas';

const DARK_BACKGROUND = '#020617';
const DARK_TEXT = '#e2e8f0';
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const DECORATIVE = '#a5b4fc'
const DEFAULT_HASHTAGS = ['#typescript', '#react', '#nodejs', '#frontend', '#webdev'];

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

        // Construct photo URL relative to the current domain
        const baseUrl = `${url.protocol}//${url.host}`;
        const photoUrl = `${baseUrl}/photo.jpeg`; // Changed from .webp to .jpg

        const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const ctx = canvas.getContext('2d');

        // ctx.fillStyle = DARK_BACKGROUND;
        // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gradient.addColorStop(1, DARK_BACKGROUND);
        gradient.addColorStop(0, '#475569');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // ctx.strokeStyle = DECORATIVE;
        // ctx.lineWidth = 8;
        // ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);


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

            const photo = await loadImage(photoBuffer).catch(error => {
                throw new Error(`Failed to load image: ${error.message}, Content-Type: ${contentType}`);
            });            // Draw circular photo in bottom right
            const photoSize = 100;
            const padding = 40;
            const photoX = CANVAS_WIDTH - photoSize - padding;
            const photoY = CANVAS_HEIGHT - photoSize - padding;

            // Create circular clipping path
            ctx.save();
            ctx.beginPath();
            ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            // Draw the image
            ctx.drawImage(photo, photoX, photoY, photoSize, photoSize);
            ctx.restore();

            // Add szkudelski.dev text
            ctx.font = 'bold 28px sans-serif';
            ctx.fillStyle = DECORATIVE;
            ctx.textAlign = 'right';
            ctx.fillText('https://szkudelski.dev', photoX - 20, CANVAS_HEIGHT - padding - photoSize / 2 + 8);
        } catch (imageError) {
            console.error('Failed to load profile image:', imageError);
            console.error('Image URL attempted:', photoUrl);
        }

        // Parse hashtags from URL or use defaults
        const hashtags = rawHashtags
            && decodeURIComponent(rawHashtags).split(',').map(tag =>
                tag.startsWith('#') ? tag : `#${tag}`
            ).slice(0, 5)

        if (hashtags) {
            // Add hashtags in bottom left corner in one line
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = DECORATIVE;
            ctx.textAlign = 'left';
            const hashtagPadding = 40;
            const hashtagY = CANVAS_HEIGHT - hashtagPadding;
            let currentX = hashtagPadding;

            hashtags.forEach((tag) => {
                ctx.fillText(tag, currentX, hashtagY);
                currentX += ctx.measureText(tag).width + 14; // Add 20px spacing between tags
            });
        }
        ctx.textAlign = 'center';

        // Reset text alignment for title

        // Helper function to wrap text
        const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
            const words = text.split(' ');
            let line = '';
            let testLine = '';
            let testWidth = 0;
            let lineArray = [];

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

        // Calculate the maximum width for text
        const maxWidth = CANVAS_WIDTH - 160;
        const lineHeight = 48;
        const x = CANVAS_WIDTH / 2;
        const y = (CANVAS_HEIGHT / 2) - 80;

        // Draw the title
        ctx.fillStyle = DARK_TEXT;
        ctx.font = 'bold 48px sans-serif';
        const titleLinesAmount = wrapText(ctx, title, x, y, maxWidth, lineHeight);


        ctx.strokeStyle = DECORATIVE;
        ctx.lineWidth = 4;
        const accentY = y + (titleLinesAmount * 40);
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2 - 50, accentY);
        ctx.lineTo(CANVAS_WIDTH / 2 + 50, accentY);
        ctx.stroke();

        // Draw the name with smaller font
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText("Marek Szkudelski", CANVAS_WIDTH / 2, y + (titleLinesAmount * 40) + 40);

        return new Response(canvas.toBuffer('image/png'), {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('Error generating OG image:', error);
        return new Response(`Failed to generate image: ${error.message}`, {
            status: 500,
        });
    }
};
