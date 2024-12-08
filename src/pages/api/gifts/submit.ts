import { z } from 'astro:content'
import { giftsTable } from '@models/schema';
import { db } from '@lib/server/db';
import { type APIRoute } from 'astro';
import type { GiftData } from '@types';

// Define a schema for validation (optional but recommended)
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  link: z.string().min(1, "Link to product is required"),
  bought: z.string().min(1, "Must declare whether the item has been purchased or not"),
  assignee: z.string().min(1, "Must assign gift entry"),
  notes: z.string().optional(),
});

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const formData = await request.json();
  const formValues: GiftData = {};
  const fieldMap: Map<string, keyof typeof formValues> = new Map([
    ['name', 'name'],
    ['link', 'link'],
    ['bought', 'bought'],
    ['assignee', 'assignee'],
    ['notes', 'notes']
  ]);

  // Collect form data from the request based on form names
  Object.keys(formData).forEach((key) => {
    if (fieldMap.has(key)) {
      // If the key exists in the map, assign the value to the corresponding property in formValues
      const field = fieldMap.get(key);
      if (field) {
        formValues[field] = formData[key] || ''; // Fallback to empty string if value is falsy
      }
    }
  });

  // Run zod validation
  const parsedData = formSchema.safeParse(formValues);
  if (!parsedData.success) {
    // If validation fails, return an error
    return new Response(`Validation failed: ${parsedData.error.message}`, { status: 400 });
  }

  // Handle the form data (e.g., save to database, send an email, etc.)
  console.log("Form Data Collected:", formValues);

  // Ensure no undefined or null values before inserting into the database
  const finalValues = {
    name: formValues.name ?? '',   // Ensure non-null/undefined values
    link: formValues.link ?? '',   // Ensure non-null/undefined values
    bought: formValues.bought ?? '', // Ensure non-null/undefined values
    assignee: formValues.assignee ?? '', // Ensure non-null/undefined values
    notes: formValues.notes ?? null,  // Optional, can be null if empty
  };

  // Respond to the client
    // Insert data into the database (individual records)
  try {
    await db.insert(giftsTable).values(finalValues);
    console.log('Form data inserted into the database:', formValues);

    // Return success response
    return new Response(
      JSON.stringify({ message: "Data uploaded to database successfully!"}),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error) {
    console.error('Error inserting data into the database:', error);
    return new Response(
      JSON.stringify({ message: "Failed to upload data to database"}),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  };
}