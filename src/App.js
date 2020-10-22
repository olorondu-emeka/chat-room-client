import React, { useEffect } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import Chat from "./pages/Chat/Chat"
import LandingPage from "./pages/general/landingPage/landingPage"
import socketIO from "./socket"

import "./App.css"

const App = () => {
  // const io = socketIO.init(baseURL)
  // useEffect(() => {
  //   // io.on("connection", () => {
  //   //   console.log("e don connect")
  //   // })
  // }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/chat" component={Chat} />
        <Route path="/" component={LandingPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
