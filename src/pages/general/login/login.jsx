import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import "../register_login.css"

const resetScroll = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const Login = (props) => {
  const initialState = {
    username: "",
    password: "",
  }
  const [formState, setFormState] = useState(initialState)

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

  const handleSubmit = (event) => {
    event.preventDefault()
    resetScroll()
  }

  return (
    <div className="main">
      <main id="login_main">
        {/* {loading ? <Spinner /> : <p>{formState.theMessage}</p>} */}
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
