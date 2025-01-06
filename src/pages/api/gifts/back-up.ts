import type { APIRoute } from "astro";
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  if (request.method === "POST") {
    try {
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      const email = import.meta.env.RESEND_API_KEY;
      const filePath = path.join(process.cwd(), 'db.sqlite3');

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: email,
          subject: 'SQLite Database Backup',
          text: 'Here is your backup of the SQLite database.',
          attachments: [
            {
              filename: 'backup.sqlite3',
              content: fileBuffer.toString('base64'),
            },
          ],
        });
      }

      return new Response(
        JSON.stringify({ message: "Database back-up created and sent to email"}),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ message: `Error backing up database: ${error}`}),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }
  } else {
    return new Response(
      JSON.stringify({ message: "Method not allowed"}),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}