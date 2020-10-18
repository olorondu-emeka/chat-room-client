import React from "react"
import GeneralHeader from "../generalHeader/generalHeader"
import Register from "../register/register"
import Login from "../login/login"

import { Route, Switch, Redirect } from "react-router-dom"

import "./landingPage.css"

const LandingPage = (props) => {
  return (
    <section className="landing-page">
      <GeneralHeader extraClass="other" />
      <div className="landing-page__others">
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Redirect to="/register" />
        </Switch>
      </div>
    </section>
  )
}

export default LandingPage
