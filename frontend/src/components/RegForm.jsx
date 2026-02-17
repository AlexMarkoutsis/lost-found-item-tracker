import {useState} from "react"
import items from "../items"
import {useNavigate} from "react-router-dom"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants"
import "../styles/Form.css"

function RegForm({route, method}){
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const webpageName = "UWMPantherFind"
    const action = method === "login" ? "Log into an account" : "Create an account"
    const submitText = method === "login" ? "Log in" : "Register"


    const handleSubmit = async (e) => {
        setLoading(true)

        e.preventDefault()

        try{
            const res = await items.post(route, {username, password})
            if(method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            }
            else{
                navigate("/login")
            }
        }
        catch (error){
            alert(error)
        }
        finally
        {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1 className="webpage-name">{webpageName}</h1>
        <h3 className="action">{action}</h3>

        <input className="form-input"
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               placeholder="Username"
        />

        {method === "register" &&<input className="form-input"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Email"
        />}


        <input className="form-input"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Password"
        />

        <button className="form-button" type="submit">{submitText}</button>
    </form>
}

export default Form