import React from "react"

import ListingHeader from "../listingHeader/listingHeader"
import ListingBody from "../listingBody/listingBody"

import "./chatListing.css"

const ChatListing = (props) => {
  return (
    <section className="chat-listing">
      <ListingHeader />
      <ListingBody />
    </section>
  )
}

export default ChatListing
