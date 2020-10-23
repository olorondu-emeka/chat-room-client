import React from "react"
import ChatMessage from "../chatMessage/chatMessage"

import "./messageContainer.css"

const MessageContainer = ({ messages }) => {
  const user = JSON.parse(localStorage.getItem("user"))
  console.log("user", user)
  console.log("messages", messages)
  let messageArray = []

  if (messages.length > 0) {
    messageArray = messages.map((message) => {
      console.log("message", message)
      if (message.User === null) return null
      const type = message.User.id === user.id ? "sender" : "recipient"
      return (
        <ChatMessage
          key={message.id}
          type={type}
          message={message.content}
          username={type === "recipient" && message.User.username}
          timestamp={message.timestamp}
          context="chatroom"
        />
      )
    })
  }

  return (
    <div className="message-container">
      {messages.length > 0 && messageArray}
      {messages.length === 0 && (
        <div className="empty-body-chat">
          <p>No new Messages</p>
        </div>
      )}
    </div>
  )
}

export default MessageContainer
