import React from "react"

import ListingHeader from "../listingHeader/listingHeader.jsx"
import ListingBody from "../listingBody/listingBody"

import "./chatListing.css"

const ChatListing = ({ chatrooms, handleClick }) => {
  return (
    <section className="chat-listing">
      <ListingHeader />
      <ListingBody chatrooms={chatrooms} handleClick={handleClick} />
    </section>
  )
}

export default ChatListing
