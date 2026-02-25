import {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AppContext} from '../App.jsx'

function formatItem(item) {
  const header = item.title || item.itemName || 'Untitled Item'
  const desc = item.description || ''
  const cat = item.category ? `Category: ${item.category}` : ''
  const where = item.location ? `Location: ${item.location}` : ''
  const when = item.date_found || item.dateFound
    ? `Date found: ${item.date_found || item.dateFound}`
    : ''
  const meta = [cat, where, when].filter(Boolean).join(' · ')

  return (
    <div>
      <div className="list-item__title">{header}</div>
      {desc ? <div className="list-item__desc">{desc}</div> : null}
      {meta ? <div className="list-item__meta">{meta}</div> : null}
    </div>
  )
}

export default function MainPage() {
  const navigate = useNavigate()
  const {currentUser, items, setItems} = useContext(AppContext)

  // Item filtering
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');


  // Fetch real items from Django
  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/items/?status=found");
        const data = await response.json();

        setItems(data);   // already filtered by backend
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    }

    loadItems()
  }, [setItems])

  const sorted = Array.isArray(items)
    ? [...items].sort((a, b) => new Date(b.date_found) - new Date(a.date_found))
    : [];


  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Main Page</div>

        <div className="frame frame--wide">
          <div className="frame__inner">
            <div className="main-header">
              <div className="main-header__left">PantherFind</div>
              <div className="main-header__right">({currentUser})</div>
            </div>

            <div className="main-body">
              <div className="filter-box" style={{marginBottom: '1rem'}}>
                <div className="section-title">Filter Items</div>

                <label className="field">
                  <span className="field__label">Item Name</span>
                  <input
                    className="field__input"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="Search by name"
                  />
                </label>

                <label className="field">
                  <span className="field__label">Category</span>
                  <select
                    className="field__input"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All</option>
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
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    placeholder="Search by location"
                  />
                </label>

                <button
                  className="btn"
                  type="button"
                  onClick={async () => {
                    const params = new URLSearchParams();
                    params.append("status", "found");

                    if (filterName.trim()) params.append("search", filterName.trim());
                    if (filterCategory) params.append("category", filterCategory);
                    if (filterLocation.trim()) params.append("location", filterLocation.trim());

                    try {
                      const response = await fetch(
                        `http://127.0.0.1:8000/api/items/?${params.toString()}`
                      );
                      const data = await response.json();
                      setItems(data);
                    } catch (err) {
                      console.error("Filter fetch failed:", err);
                    }
                  }}
                >
                  Apply Filters
                </button>
              </div>

              <div className="main-list">
                <div className="section-title">Found Items</div>

                <div className="list-box" role="list">
                  {sorted.length === 0 ? (
                    <div className="list-item list-item--empty">
                      No found items yet.
                    </div>
                  ) : (
                    sorted.map((it) => (
                      <div key={it.id} className="list-item" role="listitem">
                        {formatItem(it)}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="main-actions">
                <button className="btn" onClick={() => navigate('/submit')}>
                  Post Item
                </button>

                <button className="btn btn--secondary" onClick={() => navigate('/login')}>
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
