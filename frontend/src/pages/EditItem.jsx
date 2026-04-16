import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ACCESS_TOKEN} from "../constants";
import {API_URL} from "../constants";

export default function EditItem() {
  const navigate = useNavigate();
  const {state} = useLocation();
  const {item, from} = state;

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category);
  const [location, setLocation] = useState(item.location);
  const [dateFound, setDateFound] = useState(item.date_reported);

  const [categories, setCategories] = useState([]);

  //  Load categories
  useEffect(() => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);

    fetch("/api/categories/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  const handleSave = async () => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);

    const response = await fetch(`${API_URL}/api/items/${item.id}/edit/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify({
        title,
        description,
        category,
        location,
        date_reported: dateFound
      })
    });

    if (response.ok) {
      navigate("/item-details", {
        state: {
          item: {
            ...item,
            title,
            description,
            category,
            location,
            date_reported: dateFound
          }, from
        }
      });
    } else {
      alert("Failed to save changes.");
    }
  };

  const handleBack = () => {
    navigate("/item-details", {state: {item, from}});
  };

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Edit Item</div>

        <div className="frame frame--wide">
          <div className="frame__inner">

            <div className="main-body">
              <label>Item Name:</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}/>

              <label>Description:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>

              <label>Category:</label>
              <select
                className="field__input"
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <label>Location Found:</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)}/>

              <label>Date Found:</label>
              <input type="date" value={dateFound} onChange={(e) => setDateFound(e.target.value)}/>
            </div>

            <div className="button-col">
              <button className="btn btn--secondary" onClick={handleBack}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
