import React from "react"
import ChatMessage from "../chatMessage/chatMessage"

import "./messageContainer.css"

const user = JSON.parse(localStorage.getItem("user"))

const MessageContainer = ({ messages }) => {
  console.log("messages", messages)
  const messageArray = messages.map((message) => {
    console.log("message", message)
    if (!message.User.id) return null
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
  return (
    <div className="message-container">
      {messages.length > 0 && messageArray}

      {/* <ChatMessage type="sender" message="Yooo everyone, it's been a while!" timestamp="13:11" />
      <ChatMessage type="sender" message="How're y'all doing?" timestamp="13:13" /> */}
      {/* <ChatMessage
        type="recipient"
        message="I'm doing okay bro"
        username="mekusa"
        timestamp="13:15"
        context="chatroom"
      />
      <ChatMessage type="recipient" message="we're cool" username="don_john" timestamp="13:17" /> */}
    </div>
  )
}

export default MessageContainer
