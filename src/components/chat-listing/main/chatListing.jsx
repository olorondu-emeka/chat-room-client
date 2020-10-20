import React from "react"

import ListingHeader from "../listingHeader/listingHeader.jsx"
import ListingBody from "../listingBody/listingBody"

import "./chatListing.css"

const ChatListing = ({ chatrooms, handleClick, triggerCreateModal, handleLogout }) => {
  return (
    <section className="chat-listing">
      <ListingHeader triggerCreateModal={triggerCreateModal} handleLogout={handleLogout} />
      <ListingBody chatrooms={chatrooms} handleClick={handleClick} />
    </section>
  )
}

export default ChatListing
