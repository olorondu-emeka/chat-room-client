import React from "react"

import "./chatHeader.css"

const chatHeader = ({ title }) => {
  return (
    <header className="chat-header">
      <h1 className="chat-header__title">{title}</h1>
    </header>
  )
}

export default chatHeader
