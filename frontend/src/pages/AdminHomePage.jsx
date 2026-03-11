import { useNavigate } from "react-router-dom";

export default function AdminHomePage() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Admin Home</div>

        <div className="frame frame--wide">
          <div className="frame__inner">
            <h2>You are an admin.</h2>
            <p>This is where the admin home page will be routed for future development.</p>

            <div className="button-col" style={{ marginTop: "2rem" }}>
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => navigate("/main")}
              >
                Go to Main Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
