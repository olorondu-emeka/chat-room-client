import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Spinner } from "@chakra-ui/core"
import axios from "../../http"
import Modal from "../../components/UI/modal/modal"
import { Stack, Input, Button } from "@chakra-ui/core"

import ChatListing from "../../components/chat-listing/main/chatListing.jsx"
import ChatBody from "../../components/single-chat/main/chatBody.jsx"

import "./Chat.css"

const resetScroll = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const Chat = (props) => {
  const history = useHistory()

  useEffect(() => {
    resetScroll()
  }, [])

  const initialState = {
    name: "",
    description: "",
  }

  const [loading, setLoading] = useState(false)
  const [chatrooms, setChatrooms] = useState([])
  const [chatroomMessages, setChatroomMessages] = useState({})
  const [current, setCurrent] = useState({}) // current chatroom
  const [chatroomMessagesLoading, setChatroomMessagesLoading] = useState(false)
  const [createGroupModal, setCreateGroupModal] = useState(false)
  const [addMembersModal, setAddMembersModal] = useState(false)
  const [formState, setFormState] = useState(initialState)
  const [allMembers, setAllMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [createGroupLoading, setCreateGroupLoading] = useState(false)
  const [addMembersLoading, setAddMembersLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem("user"))

  const getChatData = async () => {
    setLoading(true)
    try {
      const allChatrooms = await axios.get("/chatroom")
      setChatrooms(allChatrooms.chatrooms)
      console.log("all chatrooms o", allChatrooms)
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

  const triggerAddMembers = () => {
    setAddMembersModal((prevState) => !prevState)
  }

  const triggerCreateGroup = () => {
    setCreateGroupModal((prevState) => !prevState)
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await axios.post("/session/destroy")
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      history.replace("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const textChangeHandler = (event) => {
    const theName = event.target.name
    const theValue = event.target.value

    setFormState((prevState) => {
      return {
        ...prevState,
        [theName]: theValue,
      }
    })
  }

  const handleCreateGroup = async (event) => {
    event.preventDefault()
    setCreateGroupLoading(true)
    try {
    } catch (error) {
      setCreateGroupLoading(false)
      console.log(error)
    }
  }

  const handleAddMembers = async (event) => {
    event.preventDefault()
    setAddMembersLoading(true)
    try {
      const requestBody = {
        chatroomId: current.id,
        membersArray: [...selectedMembers], // an array of all ids of selected members
      }
      const response = await axios.post("/chatroom/add-members", requestBody)
      setAllMembers([])
      setAddMembersModal(false)
    } catch (error) {
      setAddMembersLoading(false)
      console.log(error)
    }
  }

  const getAllMembers = async () => {
    if (addMembersModal) {
      try {
        setAddMembersLoading(true)
        const { users } = await axios.get(`/chatroom/members/${current.id}`)
        const membersArray = users.map((user) => {
          return {
            id: user.id,
            username: user.username,
          }
        })
        setAllMembers((prevState) => {
          return [...prevState, ...membersArray]
        })
      } catch (error) {
        setAddMembersLoading(false)
      }
    }
  }

  const handleMemberSelect = (id) => {
    setSelectedMembers((prevState) => {
      let previousSelectedMembers = [...prevState]
      previousSelectedMembers.push(id)
      return [...previousSelectedMembers]
    })
  }

  const createGroupContent = (
    <form onSubmit={handleCreateGroup}>
      {createGroupLoading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!createGroupLoading && (
        <Stack spacing={3}>
          <Input type="text" placeholder="Name" name="name" onChange={textChangeHandler} />
          <Input
            type="text"
            placeholder="Description"
            name="description"
            onChange={textChangeHandler}
          />
          <Input type="submit" value="Submit" />
        </Stack>
      )}
    </form>
  )

  const addMembersContent = (
    <form onSubmit={handleAddMembers}>
      {addMembersLoading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!addMembersLoading && (
        <Stack spacing={3}>
          {allMembers.map((member) => (
            <Input
              type="checkbox"
              onClick={() => handleMemberSelect(member.id)}
              name={member.username}
            />
          ))}
        </Stack>
      )}
    </form>
  )

  useState(async () => {
    await getAllMembers()
  }, [addMembersModal])

  return (
    <section className="chat">
      {loading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!loading && (
        <ChatListing
          chatrooms={chatrooms}
          handleClick={setCurrentChatroom}
          triggerCreateModal={triggerCreateGroup}
          handleLogout={handleLogout}
        />
      )}
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
      <Modal
        isOpen={createGroupModal}
        onClose={setCreateGroupModal}
        modalTitle="Create Chatroom"
        modalContent={createGroupContent}
      />
      <Modal
        isOpen={addMembersModal}
        onClose={setAddMembersModal}
        modalTitle="Add Members"
        modalContent={addMembersContent}
      />
    </section>
  )
}

export default Chat
