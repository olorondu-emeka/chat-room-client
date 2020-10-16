import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

import { ThemeProvider, CSSReset } from "@chakra-ui/core"

ReactDOM.render(
  <ThemeProvider>
    <React.StrictMode>
      <CSSReset />
      <App />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root")
)
