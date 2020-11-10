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

let currentChatroom = {}

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
    if (current.id) {
    }
  }, [current])

  useEffect(() => {
    const baseURL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_URL
        : process.env.REACT_APP_PROD_URL
    const socketIO = openSocket(baseURL)

    socketIO.on("join chatroom", ({ memberIdArray, chatroom }) => {
      if (memberIdArray.includes(user.id) && chatroom.adminId !== user.id) {
        updateChatroomBySocket(chatroom)
      }
    })

    socketIO.on("chatroom message", async ({ chatroomId, message }) => {
      if (currentChatroom.id === chatroomId) {
        fetchChatMessagesBySocket(chatroomId, message)
        const response = await axios.patch(`/chatroom/${chatroomId}/checkpoint`, {
          message,
        })
        console.log("message received")
        // socketIO.emit("message received", { userId: user.id, chatroomId, message })
      }
    })

    socketIO.on("cached messages", ({ userId, chatroomId, messages }) => {
      if (userId === user.id) {
        fetchCachedMessagesBySocket(chatroomId, messages)
        console.log("cached messages", messages)
      }
    })

    return function cleanup() {
      socketIO.off("chatroom message")
      socketIO.off("cached messages")
    }
  }, [])

  const fetchChatMessages = async (chatroomId) => {
    try {
      setChatroomMessagesLoading(true)
      if (!chatroomMessages[chatroomId]) {
        const response = await axios.get(`/chatroom/message/${chatroomId}`)
        console.log("message fetched", response.messages)
        setChatroomMessages((prevState) => {
          let previousState = { ...prevState }
          let newMessages

          if (!previousState[chatroomId]) {
            newMessages = [...response.messages]
          } else {
            newMessages = [...previousState[chatroomId], ...response.messages]
          }

          previousState[chatroomId] = newMessages

          return {
            ...previousState,
          }
        })
      }
      setChatroomMessagesLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchChatMessagesBySocket = (chatroomId, message) => {
    // note: ALWAYS update state immutably
    let currentChatroom = current
    setChatroomMessages((prevState) => {
      // immutable object copy
      console.log("current o", currentChatroom, chatroomId)

      let previousMessages = { ...prevState }

      // immutable array copy
      let previousChatroomMessages
      if (!previousMessages[chatroomId]) {
        previousChatroomMessages = [message]
      } else {
        previousChatroomMessages = [...previousMessages[chatroomId], message]
      }

      previousMessages[chatroomId] = previousChatroomMessages
      return { ...previousMessages }
    })
  }

  const fetchCachedMessagesBySocket = (chatroomId, messageArray) => {
    // note: ALWAYS update state immutably
    setChatroomMessages((prevState) => {
      // immutable object copy
      let previousMessages = { ...prevState }

      // immutable array copy
      let previousChatroomMessages
      if (!previousMessages[chatroomId]) {
        previousChatroomMessages = [...messageArray]
      } else {
        previousChatroomMessages = [...previousMessages[chatroomId], ...messageArray]
      }

      previousMessages[chatroomId] = previousChatroomMessages
      return { ...previousMessages }
    })

    if (chatroomMessagesLoading) setChatroomMessagesLoading(false)
  }

  const handleMessageTyping = (event) => {
    setCurrentChatroomMessage(event.target.value)
  }

  const sendChatroomMessage = async (event, chatroomId) => {
    event.preventDefault()
    try {
      setCurrentChatroomMessage("")
      await axios.post("/chatroom/message", { chatroomId, message: currentChatroomMessage })
    } catch (error) {
      console.log(error)
    }
  }

  const setCurrentChatroom = async (chatroom) => {
    setChatroomMessagesLoading(true)
    setCurrent(chatroom)
    currentChatroom = chatroom
    await fetchChatMessages(chatroom.id)
  }

  const triggerAddMembers = () => {
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
        setAddMembersLoading(false)
      } catch (error) {
        setAddMembersLoading(false)
      }
    }
  }

  const handleMemberSelect = (event) => {
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
            <div className="checkbox-group" key={member.id}>
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
