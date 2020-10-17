import React from "react"
import MessageContainer from "../messageContainer/messageContainer"
import ChatHeader from "../chatHeader/chatHeader"

import "./chatBody.css"

const ChatBody = (props) => {
  return (
    <section className="chat-body">
      <ChatHeader title="Food Lovers" />
      <MessageContainer />
      <form onSubmit={console.log("heyyy")}>
        <input className="chat-body__text" type="text" name="" placeholder="Type a message" />
      </form>
    </section>
  )
}

export default ChatBody
