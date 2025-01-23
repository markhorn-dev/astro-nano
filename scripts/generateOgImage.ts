import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';

const DARK_BACKGROUND = '#020617';
const DARK_TEXT = '#e2e8f0';
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const DECORATIVE = '#a5b4fc';
const FONT_FAMILY = 'Mona Sans';

registerFont(path.join(process.cwd(), 'public', 'fonts', 'Inter.ttf'), {
    family: FONT_FAMILY,
});


export async function generateOGImage(title: string, hashtags: string[] = [], outputPath: string) {
    console.log(`\n🎨 Generating OG image for: "${title}"`);
    console.log(`📍 Output path: ${outputPath}`);
    console.log(`🏷️  Hashtags: ${hashtags.join(', ') || 'none'}`);

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(1, DARK_BACKGROUND);
    gradient.addColorStop(0, '#475569');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    try {
        const photoPath = path.join(process.cwd(), 'public', 'photo.jpeg');
        console.log(`📸 Loading photo from: ${photoPath}`);
        const photo = await loadImage(photoPath);
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
    } catch (error) {
        console.error('❌ Failed to load profile image:', error);
        console.error('📁 Current working directory:', process.cwd());
    }

    const linkSize = 48;
    ctx.font = `bold ${linkSize}px ${FONT_FAMILY}`;
    ctx.fillStyle = DECORATIVE;
    ctx.textAlign = 'right';
    ctx.fillText('szkudelski.dev', CANVAS_WIDTH - 40, 40 + linkSize);

    if (hashtags.length > 0) {
        const tagsSize = 32;
        ctx.font = `bold ${tagsSize}px ${FONT_FAMILY}`;
        ctx.fillStyle = DECORATIVE;
        ctx.textAlign = 'left';
        const hashtagPadding = 40;
        const hashtagY = CANVAS_HEIGHT - hashtagPadding;
        let currentX = hashtagPadding;

        hashtags.slice(0, 4).forEach((tag) => {
            const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
            ctx.fillText(formattedTag, currentX, hashtagY);
            currentX += ctx.measureText(formattedTag).width + 14;
        });
    }

    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        const lineArray: string[] = [];

        for (const word of words) {
            testLine = `${line}${word} `;
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && line !== '') {
                lineArray.push(line.trim());
                line = `${word} `;
            } else {
                line = testLine;
            }
        }
        lineArray.push(line.trim());

        lineArray.forEach((l, i) => {
            ctx.fillText(l, x, y + (i * lineHeight));
        });

        return lineArray.length;
    };

    const maxWidth = CANVAS_WIDTH - 160;
    const lineHeight = 64;
    const x = CANVAS_WIDTH / 2;
    const y = (CANVAS_HEIGHT / 2) - 80;

    ctx.fillStyle = DARK_TEXT;
    ctx.font = `bold ${lineHeight}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';

    const titleLinesAmount = wrapText(title, x, y, maxWidth, lineHeight);

    ctx.strokeStyle = DECORATIVE;
    ctx.lineWidth = 4;
    const accentY = y + (titleLinesAmount * (lineHeight * 0.75));
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2 - 50, accentY);
    ctx.lineTo(CANVAS_WIDTH / 2 + 50, accentY);
    ctx.stroke();

    ctx.font = `bold 48px ${FONT_FAMILY}`;
    ctx.fillText("Marek Szkudelski", CANVAS_WIDTH / 2, accentY + lineHeight);

    return canvas;
}