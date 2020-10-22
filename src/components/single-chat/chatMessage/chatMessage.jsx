import React from "react"

import "./chatMessage.css"

const colorArray = ["blue", "green", "purple", "pink"]

const ChatMessage = ({ type, message, username, timestamp, context }) => {
  const messageClass = type === "sender" ? "chat-message--sender" : "chat-message--recipient"
  const finalClass = `chat-message ${messageClass}`
  const positionClass = type === "sender" ? "flex-right" : "flex-left"
  const finalWrapperClass = `chat-message__wrapper ${positionClass}`
  const randomIndex = Math.floor(Math.random() * colorArray.length)

  return (
    <div className={finalWrapperClass}>
      <div className={finalClass}>
        {type === "recipient" && context === "chatroom" && (
          <h3 className={`chat-message__username ${colorArray[randomIndex]}`}>{username}</h3>
        )}
        <p className="chat-message__content">{message}</p>
        <span className="timestamp">{timestamp}</span>
      </div>
    </div>
  )
}

export default ChatMessage
