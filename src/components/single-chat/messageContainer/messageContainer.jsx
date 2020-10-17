import React from "react"
import ChatMessage from "../chatMessage/chatMessage"

import "./messageContainer.css"

const MessageContainer = (props) => {
  return (
    <div className="message-container">
      <ChatMessage type="sender" message="Yooo everyone, it's been a while!" timestamp="13:11" />
      <ChatMessage type="sender" message="How're y'all doing?" timestamp="13:13" />
      <ChatMessage
        type="recipient"
        message="I'm doing okay bro"
        username="mekusa"
        timestamp="13:15"
        context="chatroom"
      />
      <ChatMessage type="recipient" message="we're cool" username="don_john" timestamp="13:17" />
    </div>
  )
}

export default MessageContainer
