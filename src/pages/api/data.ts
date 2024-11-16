import { gifts } from '@models/schema';
import { db } from '@utils/db';

// Function to get column names
export const get = async (req: Request) => {
  if (req.method === 'GET') {
    try {
      const allGifts = db.select().from(gifts)
      return { 
        status: 200,
        body: allGifts
      }
    } catch (error) {
      return {
        status: 500,
        error: { error: 'Error fetching data from SQLite database' },
      }
    } 
  } else {
    return {
      status: 405, 
      error: { error: 'Method not allowed' },
    }
  }
}
