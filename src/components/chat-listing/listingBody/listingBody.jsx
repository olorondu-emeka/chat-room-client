import React from "react"
import ChatBlock from "../listingBody/chatBlock/chatBlock"

import "./listingBody.css"

const ListingBody = ({ chatrooms, handleClick }) => {
  const allChats = chatrooms.map((chatroom) => {
    return (
      <ChatBlock
        key={chatroom.id}
        handleClick={() => handleClick(chatroom)}
        username={chatroom.name}
        chatSummary={chatroom.description}
      />
    )
  })
  return (
    <ul className="listing-body">
      {chatrooms.length === 0 && (
        <div className="empty-body-listing">
          <p>No Chats</p>
        </div>
      )}
      {chatrooms.length > 0 && allChats}
    </ul>
  )
}

export default ListingBody
