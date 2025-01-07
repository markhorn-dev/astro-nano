import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testOgImage = async () => {
    try {
        const title = encodeURIComponent('Alternatywne metody dzielenia się wiedzą w pracy programisty');
        const hashtags = encodeURIComponent('rozwój,dzielenie się wiedzą,praca zespołowa,self-develop');
        const url = new URL('/api/og', 'http://localhost:4321');
        url.searchParams.set('title', title);
        url.searchParams.set('hashtags', hashtags);

        console.log('Fetching URL:', url.toString());

        const response = await fetch(url);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('image/png')) {
            throw new Error(`Invalid content type: ${contentType}. Expected image/png`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const outputPath = path.join(__dirname, 'og-image.png');
        await fs.writeFile(outputPath, buffer);
        console.log(`OG image saved to ${outputPath}`);
    } catch (error) {
        console.error('Error fetching OG image:', error.message);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
        process.exit(1);
    }
};

testOgImage();