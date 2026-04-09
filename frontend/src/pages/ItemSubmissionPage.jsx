import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN } from "../constants.js";
import { AuthContext } from "../context/AuthContext.jsx";

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function ItemSubmissionPage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);

  const today = useMemo(() => todayISO(), [])

  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [dateFound, setDateFound] = useState(today)
  const [imageName, setImageName] = useState('')

  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

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

  const canSubmit = itemName.trim() && description.trim() && category && location.trim() && dateFound

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Item Submission Page</div>

        <div className="frame">
          <div className="frame__inner">
            <form
              className="form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!canSubmit) return;

                try {
                  const access_token = localStorage.getItem(ACCESS_TOKEN)
                  const response = await fetch("/api/items/create/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${access_token}`
                    },
                    body: JSON.stringify({
                      title: itemName.trim(),
                      description: description.trim(),
                      category,
                      location: location.trim(),
                      date_reported: dateFound,
                      status: "found",
                      reporter: user.id
                    }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    navigate("/main", { state: { refresh: true } });
                  } else {
                    alert("Failed to submit item: " + JSON.stringify(data) + ": " + category);
                  }
                } catch (err) {
                  console.error("Item submission error:", err);
                  alert("Something went wrong submitting the item.");
                }
              }}
            >
              <label className="field">
                <span className="field__label">Item Name</span>
                <input
                  className="field__input"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="(text)"
                />
              </label>

              <label className="field">
                <span className="field__label">Description</span>
                <textarea
                  className="field__input field__textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="(text)"
                  rows={3}
                />
              </label>

              <label className="field">
                <span className="field__label">Category</span>
                <select
                  className="field__input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">(dropdown menu)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field__label">Location</span>
                <input
                  className="field__input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="(text)"
                />
              </label>

              <label className="field">
                <span className="field__label">Date found</span>
                <input
                  className="field__input"
                  type="date"
                  value={dateFound}
                  max={today}
                  onChange={(e) => setDateFound(e.target.value)}
                  aria-label="Date found"
                />
              </label>

              <label className="field">
                <span className="field__label">Image</span>
                <input
                  className="field__input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageName(e.target.files?.[0]?.name ?? '')}
                />
                <div className="field__hint">(optional image upload){imageName ? ` — ${imageName}` : ''}</div>
              </label>

              <div className="button-col">
                <button className="btn" type="submit" disabled={!canSubmit}>
                  Submit
                </button>

                <button className="btn btn--secondary" type="button" onClick={() => navigate('/main')}>
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
