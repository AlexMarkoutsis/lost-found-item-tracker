import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App.jsx'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function ItemSubmissionPage() {
  const navigate = useNavigate()
  const { setItems } = useContext(AppContext)

  const today = useMemo(() => todayISO(), [])

  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [dateFound, setDateFound] = useState(today)
  const [imageName, setImageName] = useState('')

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
                  const response = await fetch("http://127.0.0.1:8000/api/items/create/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                      title: itemName.trim(),
                      description: description.trim(),
                      category,
                      location: location.trim(),
                      date_reported: dateFound,
                      status: "found",
                      reporter: 1   // TODO: replace with real user ID (JWT -or- authentication token needed)
                    }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    setItems((prev) => [data, ...prev]);
                    navigate("/main");
                  } else {
                    alert("Failed to submit item: " + JSON.stringify(data));
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
                  <option value="Accessories">Accessories</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Keys">Keys</option>
                  <option value="Other">Other</option>
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
