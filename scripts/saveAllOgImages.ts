import fs from 'fs/promises';
import path from 'path';
import { generateOGImage } from './generateOgImage';
import { HOME, BLOG, WORK, PROJECTS } from '../src/consts';

const outputDirectory = 'dist';

export async function saveAllOgImages() {
    console.log('\n🚀 Starting OG image generation process...');

    try {
        // Generate static pages OG images first
        const staticPages = [
            { slug: 'index', title: HOME.TITLE },
            { slug: 'blog', title: BLOG.TITLE },
            { slug: 'work', title: WORK.TITLE },
            { slug: 'projects', title: PROJECTS.TITLE },
        ];

        for (const page of staticPages) {
            const outputPath = path.join(process.cwd(), outputDirectory, 'og', `${page.slug}.png`);
            try {
                const canvasToSave = await generateOGImage(page.title, [], outputPath);
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                const buffer = canvasToSave.toBuffer('image/png');
                await fs.writeFile(outputPath, buffer);
                console.log(`✅ Generated static page OG image: ${page.slug}`);
            } catch (error) {
                console.error(`❌ Error generating OG image for ${page.slug}:`, error);
            }
        }

        // Continue with blog posts generation
        const postsDir = path.join(process.cwd(), 'src/content/blog');
        console.log(`📚 Reading blog posts from: ${postsDir}`);

        const files = await fs.readdir(postsDir);
        console.log(`📑 Found ${files.length} files in posts directory`);

        let successCount = 0;
        let errorCount = 0;

        for (const file of files) {
            // make early return
            if (!file.endsWith('.md') && !file.endsWith('.mdx')) {
                continue;
            }

            console.log(`\n📝 Processing file: ${file}`);

            try {
                const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
                const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);

                if (!frontmatterMatch) {
                    console.warn(`⚠️  No frontmatter found in: ${file}`);
                    errorCount++;
                    return;
                }

                const frontmatter = frontmatterMatch[1];
                const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?\n/);
                const tagsMatch = frontmatter.match(/tags:\s*\n?\s*(?:-\s*(.+(?:\n\s*-\s*.+)*)|(?:\[(.+)\]))/);

                if (!titleMatch) {
                    console.warn(`⚠️  No title found in frontmatter for: ${file}`);
                    errorCount++;
                    return;
                }

                const title = titleMatch[1];
                const tags = tagsMatch
                    ? (tagsMatch[1] || tagsMatch[2])
                        .split(/[\n,]/)
                        .map(t => t.trim())
                        .map(t => t.replace(/^-\s*/, ''))
                        .map(t => t.replace(/['"]/g, ''))
                        .filter(Boolean)
                    : [];

                const outputPath = path.join(process.cwd(), outputDirectory, 'og', `${path.parse(file).name}.png`);
                const canvasToSave = await generateOGImage(title, tags, outputPath);

                await fs.mkdir(path.dirname(outputPath), { recursive: true });

                const buffer = canvasToSave.toBuffer('image/png');
                await fs.writeFile(outputPath, buffer);

                const fileExists = await fs.access(outputPath)
                    .then(() => true)
                    .catch(() => false);

                if (fileExists) {
                    console.log(`✅ Successfully generated OG image at: ${outputPath}`);
                    successCount++;
                } else {
                    console.error(`❌ File was not created at: ${outputPath}`);
                    errorCount++;
                }
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error);
                errorCount++;
            }
        }

        console.log('\n📊 Generation Summary:');
        console.log(`✅ Successfully generated: ${successCount} images`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log('🏁 OG image generation complete!\n');

    } catch (error) {
        console.error('❌ Fatal error during OG image generation:', error);
        process.exit(1);
    }
}

saveAllOgImages()