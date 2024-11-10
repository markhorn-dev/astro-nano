import { useEffect, useState } from "react";

const GiftsTable = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cols = ['Name', 'Bought', 'Assignee', 'URL']

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => {
        setGifts(data); // Set the fetched data to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col} className="text-white">{col}</th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  )
}

export default GiftsTable