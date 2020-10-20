import { Button } from "@chakra-ui/core"
import React from "react"

import "./chatHeader.css"

const chatHeader = ({ title, context, buttonClick, isAdmin }) => {
  return (
    <header className="chat-header">
      <h1 className="chat-header__title">{title}</h1>
      {context === "chatroom" && isAdmin && (
        <button className="chat-header__button" onClick={buttonClick}>
          Add members
        </button>
      )}
    </header>
  )
}

export default chatHeader
