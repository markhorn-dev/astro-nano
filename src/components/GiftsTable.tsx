import { useEffect, useState, useCallback } from "react";
import type { Gift } from "@models/type";
import type { GiftProps } from "./Gifts";
import InfoAccordion from "./InfoAccordion";

interface GiftTableProps extends GiftProps{}

interface GiftUpdate<T> {
  id: number;
  updates: Partial<T>;
}

const GiftsTable = ({ admin }: GiftTableProps) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedGifts, setUpdatedGifts] = useState<GiftUpdate<Gift>[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>('')
  const cols = ['Id', 'Name', 'Bought', 'Assignee', 'URL', 'Notes']
  const assignees = ['Unassigned', 'Justin', 'Kaylin', 'Liz', 'Lorraine', 'Rachel', 'Tyler', 'Other']
  
  const deleteGiftHandler = async(giftId: number) => {
    const parsedGiftId = giftId.toString()
    try {
      await fetch(`/api/gifts/delete-gift/${parsedGiftId}`, {
        method: 'DELETE',
        body: new URLSearchParams(parsedGiftId),
      });
      alert(`Gift Id: ${giftId} successfully deleted`)
    } catch (error) {
      console.log('Error deleting gift');
    }
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterQuery(event.target.value);
  };

  // Filtered users based on search query
  const filteredGifts = gifts.filter(
    (gift) =>
      filterQuery === "" ||
      gift.assignee.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const updateGift = (
    id: number, 
    field: keyof Gift, 
    value: string
  ) => {

    // Find the original user
    const originalUser = gifts.find(gift => gift.id === id);
    if (!originalUser) return;

    // Check if the new value is the same as the original
    const isOriginalValue = originalUser[field] === value;

    setUpdatedGifts(prev => {
      const existingChangeIndex = prev.findIndex(change => change.id === id);
      
      if (existingChangeIndex > -1) {
        // If the new value is the original value, remove this specific field from changes
        const currentChange = prev[existingChangeIndex];
        const updatedFieldChanges = { ...currentChange.updates };
        delete updatedFieldChanges[field];

        // If no more changes for this user, remove the entire change entry
        if (Object.keys(updatedFieldChanges).length === 0) {
          return prev.filter((_, index) => index !== existingChangeIndex);
        }

        // Update the changes, removing the reverted field
        const updatedChanges = [...prev];
        updatedChanges[existingChangeIndex] = {
          ...currentChange,
          updates: updatedFieldChanges
        };
        return updatedChanges;
      }
      
      // If not the original value, add new change
      if (!isOriginalValue) {
        return [
          ...prev, 
          { 
            id, 
            updates: { [field]: value } 
          }
        ];
      }

      // If it's the original value and no change exists, do nothing
      return prev;
    });

    // Optimistically update local state
    setGifts(prev => prev.map(gift => 
      gift.id === id 
        ? { ...gift, [field]: value } 
        : gift
    ));
  };


  // Submit changes to API
  const handleSubmit = async () => {
    if (updatedGifts.length === 0) return;

    try {
      const response = await fetch('/api/gifts/batch-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGifts)
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      // Clear pending changes after successful update
      setUpdatedGifts([]);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

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
      <div className="flex justify-end gap-4 mb-2">
        <p className="flex py-1">Filter By Assignee</p>
        <select 
          className="flex border border-stone-600 rounded-lg bg-stone-700 py-1 px-2"
          name="assignee-filter" 
          id="filter" 
          onChange={(e) => handleFilterChange(e)}
        >
          <option key="filter-none" value=""></option>
          {assignees.map((val) => (
            <option key={`filter-${val}`} value={val}>{val}</option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col} className="text-lg text-white">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterQuery.length > 0 ? (
            filteredGifts.map((gift) => (
              <tr key={gift.id}>
                <td>{gift.id}</td>
                <td>{gift.name}</td>
                <td>
                  <select
                    id={gift.id.toString()}
                    className="border border-stone-600 rounded-lg bg-stone-700 py-1 px-2" 
                    defaultValue={gift.bought} 
                    name="bought"
                    onChange={(e) => updateGift(gift.id, 'bought', e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </td>
                <td>
                  <select 
                    className="border border-stone-600 rounded-lg bg-stone-700 py-1 px-2" 
                    defaultValue={gift.assignee} 
                    name="assignee"
                    onChange={(e) => updateGift(gift.id, 'assignee', e.target.value)}
                  >
                    {assignees.map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                  </select>
                </td>
                <td className="max-w-sm overflow-hidden truncate"><a href={gift.link} target="_blank" rel="noopener noreferrer">{gift.link}</a></td>
                <td>{gift.notes}</td>
                {
                  admin 
                  ? <button 
                      className="flex py-4 pr-2" 
                      id={`delete-gift-${gift.id}`}
                      onClick={(e) => deleteGiftHandler(gift.id)}
                    >
                      [X]
                    </button>
                  : null
                }
            </tr>
            ))
          ) : (
          gifts.map((gift) => (
            <tr key={gift.id}>
              <td>{gift.id}</td>
              <td>{gift.name}</td>
              <td>
                <select
                  id={gift.id.toString()}
                  className="border border-stone-600 rounded-lg bg-stone-700 py-1 px-2" 
                  defaultValue={gift.bought} 
                  name="bought"
                  onChange={(e) => updateGift(gift.id, 'bought', e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </td>
              <td>
                <select 
                  className="border border-stone-600 rounded-lg bg-stone-700 py-1 px-2" 
                  defaultValue={gift.assignee} 
                  name="assignee"
                  onChange={(e) => updateGift(gift.id, 'assignee', e.target.value)}
                >
                  {assignees.map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                </select>
              </td>
              <td className="max-w-sm overflow-hidden truncate"><a href={gift.link} className="" target="_blank" rel="noopener noreferrer">{gift.link}</a></td>
              <td>{gift.notes}</td>
              {
                admin 
                ? <button 
                    className="flex py-4 pr-2" 
                    id={`delete-gift-${gift.id}`}
                    onClick={(e) => deleteGiftHandler(gift.id)}
                  >
                    [X]
                  </button>
                : null
              }
            </tr>
          )))}
        </tbody>
      </table>
      {updatedGifts.length > 0 && (
        <div className="flex justify-end">
          <button 
            id="submit-btn" 
            className="mt-8 relative group flex flex-nowrap py-1 px-3 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out"
            onClick={handleSubmit}
          >
            Save {updatedGifts.length} Changes
          </button>
        </div>
      )}
      <InfoAccordion />
    </div>
  )
}

export default GiftsTable