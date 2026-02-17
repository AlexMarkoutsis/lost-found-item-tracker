import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App.jsx'

function formatItem(item) {
  const header = item.itemName ? item.itemName : 'Untitled Item'
  const desc = item.description ? item.description : ''
  const cat = item.category ? `Category: ${item.category}` : ''
  const where = item.location ? `Location: ${item.location}` : ''
  const when = item.dateFound ? `Date found: ${item.dateFound}` : ''
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
  const { currentUser, items } = useContext(AppContext)

  const sorted = [...items].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Main Page</div>

        <div className="frame frame--wide">
          <div className="frame__inner">
            <div className="main-header">
              <div className="main-header__left">PantherFind</div>
              <div className="main-header__right">({currentUser || 'Username'})</div>
            </div>

            <div className="main-body">
              <div className="main-list">
                <div className="section-title">Lost Items</div>
                <div className="list-box" role="list">
                  {/* List of Posted Items Goes Here [Newest at top]*/}
                  {sorted.length === 0 ? (
                    <div className="list-item list-item--empty">No items posted yet.</div>
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
                {/* Post Item Button -> Item Submission Page*/}
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
