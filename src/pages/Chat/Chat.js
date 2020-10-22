import React, { useState, useEffect } from "react"
import { useHistory, Redirect } from "react-router-dom"
import { Spinner, Stack } from "@chakra-ui/core"
import axios from "../../http"
import Modal from "../../components/UI/modal/modal"
import openSocket from "socket.io-client"

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
  const [selectedMembers, setSelectedMembers] = useState({})
  const [createGroupLoading, setCreateGroupLoading] = useState(false)
  const [addMembersLoading, setAddMembersLoading] = useState(false)
  const [selectedMembersNo, setSelectedMembersNo] = useState(0)
  const [currentChatroomMessage, setCurrentChatroomMessage] = useState("")

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

  useEffect(() => {
    const baseURL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_URL
        : process.env.REACT_APP_PROD_URL
    const socketIO = openSocket(baseURL)

    socketIO.on("join chatroom", ({ memberIdArray, chatroom }) => {
      console.log("join chatroom")
      if (memberIdArray.includes(user.id) && chatroom.adminId !== user.id) {
        console.log("join chatroom triggered")
        updateChatroomBySocket(chatroom)
      }
    })

    socketIO.on("chatroom message", ({ chatroomId, message }) => {
      console.log("message received", chatroomId, message)
      fetchChatMessagesBySocket(chatroomId, message)
    })
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

  const fetchChatMessagesBySocket = (chatroomId, message) => {
    setChatroomMessages((prevState) => {
      let previousMessages = { ...prevState }
      let previousChatroomMessages
      if (!previousMessages[chatroomId]) {
        previousChatroomMessages = []
      } else {
        previousChatroomMessages = [...previousMessages[chatroomId]]
      }

      previousChatroomMessages.push(message)
      previousMessages[chatroomId] = previousChatroomMessages
      return { ...previousMessages }
    })
  }

  const handleMessageTyping = (event) => {
    setCurrentChatroomMessage(event.target.value)
  }

  const sendChatroomMessage = async (event, chatroomId) => {
    event.preventDefault()
    try {
      setCurrentChatroomMessage("")
      await axios.post("/chatroom/message", { chatroomId, message: currentChatroomMessage })
      console.log("message sent")
    } catch (error) {
      console.log(error)
    }
  }

  const setCurrentChatroom = async (chatroom) => {
    setCurrent(chatroom)
    await fetchChatMessages(chatroom.id)
  }

  const triggerAddMembers = () => {
    console.log("add members triggered", addMembersModal)
    setAddMembersModal(true)
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
      const response = await axios.post("/chatroom", formState)
      setChatrooms((prevState) => {
        let chatrooms = [...prevState]
        chatrooms.push(response)
        return [...chatrooms]
      })
      setCreateGroupLoading(false)
      setCreateGroupModal(false)
    } catch (error) {
      setCreateGroupLoading(false)
      console.log(error)
    }
  }

  const handleAddMembers = async (event) => {
    event.preventDefault()
    setAddMembersLoading(true)
    try {
      const membersArray = []
      for (let key in selectedMembers) {
        membersArray.push(parseInt(key))
      }
      const requestBody = {
        chatroomId: current.id,
        memberIdArray: membersArray, // an array of all ids of selected members
      }
      const response = await axios.post("/chatroom/add-members", requestBody)
      console.log("handle add members")
      setAllMembers([])
      setAddMembersModal(false)
    } catch (error) {
      setAddMembersLoading(false)
      console.log(error)
    }
  }

  const getAllMembers = async () => {
    console.log("get all members o")
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
        setAddMembersLoading(false)
      } catch (error) {
        console.log("get all members loading")
        setAddMembersLoading(false)
      }
    }
  }

  const handleMemberSelect = (event) => {
    console.log(event.target.value, event.target.checked)
    const checked = event.target.checked
    const value = event.target.value

    setSelectedMembers((prevState) => {
      let previousSelectedMembers = { ...prevState }
      if (checked && !previousSelectedMembers[value]) {
        previousSelectedMembers[value] = value
      }

      if (!checked && previousSelectedMembers[value]) {
        delete previousSelectedMembers[value]
      }

      return { ...previousSelectedMembers }
    })
  }

  const updateChatroomBySocket = (chatroom) => {
    setChatrooms((prevState) => {
      const previousChatrooms = [...prevState]
      previousChatrooms.push(chatroom)
      return [...previousChatrooms]
    })
  }

  useEffect(() => {
    const selectedMembersCount = Object.keys(selectedMembers)
    setSelectedMembersNo(selectedMembersCount.length)
  }, [selectedMembers])

  const createGroupContent = (
    <form onSubmit={handleCreateGroup} className="general-form">
      {createGroupLoading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!createGroupLoading && (
        <Stack spacing={3}>
          <input type="text" placeholder="Name" name="name" onChange={textChangeHandler} required />
          <input
            type="text"
            placeholder="Description"
            name="description"
            onChange={textChangeHandler}
            size="lg"
            required
          />
          <input type="submit" value="Submit" />
        </Stack>
      )}
    </form>
  )

  const addMembersContent = (
    <form onSubmit={handleAddMembers} className="general-form">
      {addMembersLoading && (
        <div className="spinner">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      {!addMembersLoading && (
        <Stack spacing={3}>
          {allMembers.map((member) => (
            <div className="checkbox-group">
              <input
                type="checkbox"
                onChange={handleMemberSelect}
                name={`box_${member.username}`}
                variantColor="red"
                size="lg"
                value={member.id}
              />
              <label for={`box_${member.username}`}>{member.username}</label>
            </div>
          ))}
        </Stack>
      )}
      {!addMembersLoading && allMembers.length > 0 && (
        <input
          className={selectedMembersNo === 0 ? "disabled" : ""}
          type="submit"
          value="Submit"
          disabled={selectedMembersNo === 0}
        />
      )}
      {!addMembersLoading && allMembers.length === 0 && <p>No new members to add</p>}
    </form>
  )

  useEffect(() => {
    console.log("get all members use effect hook")
    if (addMembersModal) {
      getAllMembers()
    }
  }, [addMembersModal])

  return (
    <section className="chat">
      {!user && <Redirect to="/login" />}
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
          triggerAddMembers={triggerAddMembers}
          sendChatroomMessage={sendChatroomMessage}
          handleMessageTyping={handleMessageTyping}
          chatroomId={current.id}
          chatboxValue={currentChatroomMessage}
        />
      )}
      {!loading && current.id === undefined && (
        <div className="empty-body-main">
          <p>No Chat started</p>
        </div>
      )}
      <Modal
        isOpen={createGroupModal}
        modalTitle="Create Chatroom"
        modalContent={createGroupContent}
      />
      <Modal isOpen={addMembersModal} modalTitle="Add Members" modalContent={addMembersContent} />
    </section>
  )
}

export default Chat
