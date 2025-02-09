import type { APIRoute } from "astro";
import { giftsTable } from "@models/schema";
import { eq } from "drizzle-orm";
import { db } from "@lib/server/db";
import { rateLimit } from "@lib/server/ratelimit";

export const DELETE: APIRoute = async ({
  request,
  params,
}): Promise<Response> => {
  const isNotRateLimited = rateLimit(request);
  if (request.method === "DELETE" && isNotRateLimited) {
    const { giftId } = params;
    const giftIdParsed = parseInt(giftId || "");
    if (isNaN(giftIdParsed)) {
      return new Response(
        JSON.stringify({ message: "Could not cast gift ID to a number" }),
        {
          status: 500,
          headers: {
            "Content-type": "application/json",
          },
        },
      );
    }

    try {
      await db
        .delete(giftsTable)
        .where(eq(giftsTable.id, giftIdParsed))
        .limit(1)
        .execute();

      return new Response(
        JSON.stringify({
          success: true,
          message: `Gift ID: ${giftIdParsed} successfully deleted`,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Error deleting gift data from the database:", error);
      return new Response(
        JSON.stringify({ message: "Failed to delete data from database" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } else {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
