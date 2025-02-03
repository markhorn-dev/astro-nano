import type { APIRoute } from "astro";
import { Resend } from "resend";

type IssueBody = {
  issue: string;
};

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  // add jwt auth to this route
  if (request.method === "POST") {
    try {
      const data = (await request.json()) as IssueBody;
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      const email = import.meta.env.EMAIL_ADDRESS;
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Gifts Page Issue",
        text: data.issue,
      });

      return new Response(
        JSON.stringify({
          message: "Issue report forwarded to Rick, thanks for submitting :)",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ message: `Issue submitting error report: ${error}` }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } else {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
