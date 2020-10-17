import React from "react"

import ChatListing from "../../components/chat-listing/main/chatListing.jsx"
import ChatBody from "../../components/single-chat/main/chatBody.jsx"

import "./Chat.css"

const Chat = (props) => {
  return (
    <section className="chat">
      <ChatListing />
      <ChatBody />
    </section>
  )
}

export default Chat
