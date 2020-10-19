import React, { useState, useEffect } from "react"
import { Spinner } from "@chakra-ui/core"
import axios from "../../http"

import ChatListing from "../../components/chat-listing/main/chatListing.jsx"
import ChatBody from "../../components/single-chat/main/chatBody.jsx"

import "./Chat.css"

const resetScroll = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const Chat = (props) => {
  useEffect(() => {
    resetScroll()
  }, [])

  const [loading, setLoading] = useState(false)
  const [chatrooms, setChatrooms] = useState([])
  const [chatroomMessages, setChatroomMessages] = useState({})
  const [current, setCurrent] = useState({}) // current chatroom
  const [chatroomMessagesLoading, setChatroomMessagesLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))

  const getChatData = async () => {
    setLoading(true)
    try {
      const allChatrooms = await axios.get("/chatroom")
      setChatrooms(allChatrooms.chatrooms)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getChatData()
  }, [])

  const fetchChatMessages = async (chatroomId) => {
    try {
      setChatroomMessagesLoading(true)
      if (!chatroomMessages[chatroomId]) {
        const response = await axios.get(`/chatroom/message/${chatroomId}`)
        setChatroomMessages((prevState) => {
          return {
            ...prevState,
            [chatroomId]: response.messages,
          }
        })
      }
      setChatroomMessagesLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const setCurrentChatroom = async (chatroom) => {
    setCurrent(chatroom)
    await fetchChatMessages(chatroom.id)
  }

  return (
    <section className="chat">
      {loading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!loading && <ChatListing chatrooms={chatrooms} handleClick={setCurrentChatroom} />}
      {!loading && current.id !== undefined && (
        <ChatBody
          messages={chatroomMessages[current.id]}
          loading={chatroomMessagesLoading}
          isAdmin={current.adminId === user.id}
          chatroomTitle={current.name}
        />
      )}
      {!loading && current.id === undefined && (
        <div className="empty-body-main">
          <p>No Chat started</p>
        </div>
      )}
    </section>
  )
}

export default Chat
