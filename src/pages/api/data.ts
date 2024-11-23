import { gifts } from '@models/schema';
import { db } from '@utils/db';
import type { APIRoute } from 'astro';
import { error } from 'console';

// Function to get db data
export const GET: APIRoute = async ({ request }) => {
  if (request.method === 'GET') {
    try {
      const allGifts = await db.select().from(gifts)
      return new Response(
        JSON.stringify({ body: allGifts }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Error fetching row data from database"}),
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
      JSON.stringify({ message: `Method not allowed, ${error}`}),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}
