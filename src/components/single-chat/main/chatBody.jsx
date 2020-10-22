import React, { useEffect } from "react"
import MessageContainer from "../messageContainer/messageContainer"
import ChatHeader from "../chatHeader/chatHeader"

import "./chatBody.css"
import { Spinner } from "@chakra-ui/core"

const adaptScroll = () => {
  window.scrollTo({ bottom: 0, behavior: "smooth" })
}

const ChatBody = ({
  messages,
  isAdmin,
  loading,
  chatroomTitle,
  triggerAddMembers,
  sendChatroomMessage,
  handleMessageTyping,
  chatroomId,
  chatboxValue,
}) => {
  useEffect(() => {
    adaptScroll()
  }, [messages])

  return (
    <section className="chat-body">
      {loading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!loading && (
        <ChatHeader
          title={chatroomTitle}
          context="chatroom"
          isAdmin={isAdmin}
          buttonClick={triggerAddMembers}
        />
      )}
      {!loading && messages.length === 0 && (
        <div className="empty-body-chat">
          <p>No new Messages</p>
        </div>
      )}
      {!loading && messages.length > 0 && <MessageContainer messages={messages} />}
      {!loading && (
        <form onSubmit={(event) => sendChatroomMessage(event, chatroomId)}>
          <input
            className="chat-body__text"
            type="text"
            name=""
            placeholder="Type a message"
            value={chatboxValue}
            onChange={handleMessageTyping}
            required
          />
        </form>
      )}
    </section>
  )
}

export default ChatBody
