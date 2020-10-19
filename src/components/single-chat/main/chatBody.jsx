import React from "react"
import MessageContainer from "../messageContainer/messageContainer"
import ChatHeader from "../chatHeader/chatHeader"

import "./chatBody.css"
import { Spinner } from "@chakra-ui/core"

const ChatBody = ({ messages, isAdmin, loading, chatroomTitle }) => {
  return (
    <section className="chat-body">
      {loading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!loading && <ChatHeader title={chatroomTitle} context="chatroom" isAdmin={isAdmin} />}
      {!loading && messages.length === 0 && (
        <div className="empty-body-chat">
          <p>No new Messages</p>
        </div>
      )}
      {!loading && messages.length > 0 && <MessageContainer messages={messages} />}
      {!loading && (
        <form onSubmit={console.log("heyyy")}>
          <input className="chat-body__text" type="text" name="" placeholder="Type a message" />
        </form>
      )}
    </section>
  )
}

export default ChatBody
