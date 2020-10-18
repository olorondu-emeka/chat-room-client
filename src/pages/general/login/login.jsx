import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import { Spinner } from "@chakra-ui/core"
import axios from "../../../http"

import "../register_login.css"

const resetScroll = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const Login = (props) => {
  useEffect(() => {
    resetScroll()
  }, [])

  const history = useHistory()

  const initialState = {
    username: "",
    password: "",
  }

  const [formState, setFormState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [statusCode, setStatusCode] = useState(null)

  const textChangeHandler = (event) => {
    const theName = event.target.name
    const theValue = event.target.value

    setFormState((prevState) => {
      return {
        ...prevState,
        [theName]: theValue,
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    resetScroll()
    try {
      const response = await axios.post("/session/create", formState)
      setLoading(false)
      setErrorMessage("")
      localStorage.setItem("user", JSON.stringify(response))
      localStorage.setItem("token", response.token)
      response.id && history.push("/chat")
    } catch (error) {
      const errorMessage = error.response.data.message ? error.response.data.message : "error"
      setErrorMessage(errorMessage)
      setStatusCode(error.response.status)
      setLoading(false)
    }
  }

  return (
    <div className="main">
      <main id="login_main">
        {loading ? <Spinner /> : <p>{errorMessage}</p>}
        <div className="form_container">
          <header>
            <h3>Login</h3>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="input_group">
              <label htmlFor="email">Username</label>
              <input type="text" name="username" onChange={textChangeHandler} required />
            </div>
            <div className="input_group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" onChange={textChangeHandler} required />
            </div>
            <div className="input_group">
              <input type="submit" name="login" value="Login" />
            </div>
            {/* <hr />
                            <p className="password_reset">Forgot Password?</p> */}
          </form>
        </div>
        <p className="alt_text">
          Don't have an account?
          <span>
            <Link to="/register">Register Now</Link>
          </span>
        </p>
      </main>
    </div>
  )
}

export default Login
