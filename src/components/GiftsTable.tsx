import { useEffect, useState } from "react";
import type { Gift } from "@models/type";
import type { GiftProps } from "./Gifts";

interface GiftTableProps extends GiftProps{}

const GiftsTable = ({ admin }: GiftTableProps) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const cols = ['Id', 'Name', 'Bought', 'Assignee', 'URL']
  const assignees = ['Unassigned', 'Justin', 'Kaylin', 'Liz', 'Lorraine', 'Rachel', 'Tyler', 'Other']

  const deleteRowHandler = async(giftId: number) => {
    const parsedGiftId = giftId.toString()
    try {
      await fetch(`/api/gifts/delete-gift/${parsedGiftId}`, {
        method: 'DELETE',
        body: new URLSearchParams(parsedGiftId),
      });
    } catch (error) {
      console.log('Error deleting gift');
    }
  }

  // const saveRowData = () => {
  
  // }


  useEffect(() => {
    fetch('/api/gifts/data')
      .then((response) => response.json())
      .then((data) => {
        setGifts(data.body); // Set the fetched data to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto px-12 -mt-8">
      <table className="table">
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col} className="text-lg text-white">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gifts.map((gift) => (
            <tr key={gift.id}>
              <td>{gift.id}</td>
              <td>{gift.name}</td>
              <td>
                <select className="border border-stone-600 rounded-lg bg-stone-700 py-1 px-2" defaultValue={gift.bought} name="bought">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </td>
              <td>
                <select className="border border-stone-600 rounded-lg bg-stone-700 py-1 px-2" defaultValue={gift.assignee} name="assignee">
                  {assignees.map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                </select>
              </td>
              <td><a href={gift.link} target="_blank" rel="noopener noreferrer">{gift.link}</a></td>
              {
                admin 
                ? <button 
                    className="flex py-4 pr-2" 
                    id={`delete-gift-${gift.id}`}
                    onClick={(e) => deleteRowHandler(gift.id)}
                  >
                    [X]
                  </button>
                : null
              }
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <button id="submit-btn" className="mt-8 relative group flex flex-nowrap py-1 px-3 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out">
        Save Changes
      </button>
      </div>
    </div>
  )
}

export default GiftsTable