import { db } from "@lib/server/db";
import { rateLimit } from "@lib/server/ratelimit";
import { giftsTable } from "@models/schema";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

interface GiftUpdate {
  id: number;
  updates: {
    bought?: string;
    assignee?: string;
  };
}

export const PUT: APIRoute = async ({ request }): Promise<Response> => {
  // add jwt auth
  const isNotRateLimited = rateLimit(request);
  if (request.method === "PUT" && isNotRateLimited)
    try {
      // Parse the incoming JSON body
      const updates: GiftUpdate[] = await request.json();

      // Validate input
      if (!Array.isArray(updates) || updates.length === 0) {
        return new Response(
          JSON.stringify({
            error: "Invalid or empty update request",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Perform batch update in a transaction
      await db.transaction(async (tx) => {
        // Process each update
        const updatePromises = updates.map(async (update) => {
          // Validate each update has an id and some updates
          if (!update.id || Object.keys(update.updates).length === 0) {
            throw new Error(`Invalid update for id: ${update.id}`);
          }

          // Perform individual update
          return tx
            .update(giftsTable)
            .set(update.updates)
            .where(eq(giftsTable.id, update.id));
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
      });

      // Return successful response
      return new Response(
        JSON.stringify({
          message: "Updates successful",
          updatedCount: updates.length,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Batch update error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return new Response(
        JSON.stringify({
          error: errorMessage,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  else {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
