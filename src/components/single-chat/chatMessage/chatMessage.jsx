import React from "react"
import ChatBody from "../main/chatBody"

const ChatMessage = ({ type, message, username }) => {
  const messageClass =
    type === "sender" ? "chat-message__content--blue" : "chat-message__content--white"
  const finalClass = `chat-message__content ${messageClass}`
  return (
    <div className="chat-message">
      {type === "recipient" && <h3>{username}</h3>}
      <p className={finalClass}>{message}</p>
    </div>
  )
}

export default ChatMessage
