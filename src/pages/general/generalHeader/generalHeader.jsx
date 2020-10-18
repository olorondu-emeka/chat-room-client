import React from "react"

import "./generalHeader.css"
import { NavLink, Link } from "react-router-dom"

const General_Header = React.memo((props) => {
  let theClass = `nav ${props.extraClass}`
  console.log(props.extraClass)

  return (
    <header id="general_header" className={theClass}>
      <span className="logo">
        <Link to="/" exact="true">
          <h1>Simple Chat</h1>
        </Link>
      </span>
      <ul>
        <NavLink to="/register" exact={true} activeClassName="active">
          Register
        </NavLink>
        <NavLink to="/login" exact={true} activeClassName="active">
          Login
        </NavLink>
      </ul>
    </header>
  )
})

export default General_Header
