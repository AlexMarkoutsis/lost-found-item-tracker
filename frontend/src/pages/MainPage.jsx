import {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import default_pfp from "../assets/default_pfp.svg"
import {ACCESS_TOKEN} from "../constants.js";


function formatItem(item) {
  const header = item.title || item.itemName || 'Untitled Item'
  const desc = item.description || ''
  const cat = item.category_name ? `Category: ${item.category_name}` : ''
  const where = item.location ? `Location: ${item.location}` : ''
  const when = item.date_reported
    ? `Date found: ${item.date_reported}`
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
  const {user, logout} = useContext(AuthContext)
  const [items, setItems] = useState([])


  // Item filtering
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  // Categories
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch real items from Django
  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch("/api/items/?status=found");
        const data = await response.json();

        setItems(data);   // already filtered by backend
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    }

    loadItems()

    const access_token = localStorage.getItem(ACCESS_TOKEN);

    fetch("/api/categories/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories:", err));
  }, [setItems])

  const sorted = Array.isArray(items)
    ? [...items].sort(
      (a, b) => new Date(b.date_reported) - new Date(a.date_reported)
    )
    : [];

  const handlePfpClick = () => {
    navigate(`/users/${user.id}`);
  };

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Main Page</div>

        <div className="frame frame--wide">
          <div className="frame__inner">
            <div className="main-header">
              <div className="main-header__left">PantherFind</div>
              <div className="main-header__right">
                <span
                  className="notifications"
                  onClick={() => navigate('/notifications')}
                  style={{
                    cursor: "pointer",
                    marginRight: "1rem",
                    fontSize: "1.4rem",
                    userSelect: "none"
                  }}
                >
                  Notifications
                </span>

                <img className="mp_pfp" src={default_pfp} onClick={handlePfpClick} alt="pfp"/>
                ({user?.username})
              </div>
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
                      const response = await fetch(`/api/items/?${params.toString()}`);
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
                  <div className="list-box__scroll">
                    {sorted.length === 0 ? (
                      <div className="list-item list-item--empty">
                        No found items yet.
                      </div>
                    ) : (
                      sorted.map((it) => (
                        <div key={it.id} className="list-item" role="listitem"
                             onClick={() => navigate('/item-details', {state: {item: it}})}>
                          {formatItem(it)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="main-actions">
                <button className="btn" onClick={() => navigate('/submit')}>
                  Post Item
                </button>

                <button
                  className="btn btn--secondary"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
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