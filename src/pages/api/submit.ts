import { z } from 'astro:content'
import { gifts } from '@models/schema';
import { db } from '@utils/db';
import { type APIRoute } from 'astro';

// Define a schema for validation (optional but recommended)
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  link: z.string().min(1, "Link to product is required"),
  bought: z.string().min(1, "Must declare whether the item has been purchased or not"),
  assignee: z.string().min(1, "Must assign gift entry"),
  notes: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  // Parse the form data
  const formData = new URLSearchParams(await request.text());
  // Todo: for i in formData...

  // Initialize an object to store the form values
  const formValues: { 
    name?: string,
    link?: string, 
    bought?: string,
    assignee?: string,
    notes?: string, 
  } = {};

  // Collect form data from the request based on form names
  if (formData.has('name')) {
    formValues.name = formData.get('name') ?? '';
  }

  if (formData.has('link')) {
    formValues.link = formData.get('link') ?? '';
  }

  if (formData.has('bought')) {
    formValues.bought = formData.get('bought') ?? '';
  }

  if (formData.has('assignee')) {
    formValues.assignee = formData.get('assignee') ?? '';
  }

  if (formData.has('notes')) {
    formValues.notes = formData.get('notes') ?? '';
  }

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
    await db.insert(gifts).values(finalValues);
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