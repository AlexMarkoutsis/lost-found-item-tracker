import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App.jsx'

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
