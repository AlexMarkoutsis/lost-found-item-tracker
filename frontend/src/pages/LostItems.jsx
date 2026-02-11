import { useEffect, useState } from "react";

function LostItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLostItems() {
      try {
        const response = await fetch("http://localhost:8000/api/items/?status=lost");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLostItems();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading lost items...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Lost Items</h1>

      <table style={{ width: "80%", margin: "20px auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Date Reported</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                No lost items found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.title}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle}>{item.location}</td>
                <td style={tdStyle}>{item.date_reported}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  backgroundColor: "#f2f2f2",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ccc",
};

export default LostItems;
