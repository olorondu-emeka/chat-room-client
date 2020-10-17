import React from "react"
import ChatBlock from "../listingBody/chatBlock/chatBlock"

import "./listingBody.css"

const ListingBody = (props) => {
  return (
    <ul className="listing-body">
      <ChatBlock
        handleClick={() => {}}
        username="mekusa"
        chatSummary="This is a very long chat summary"
      />
      <ChatBlock
        handleClick={() => {}}
        username="mekusa"
        chatSummary="This is a very long chat summary"
      />
      <ChatBlock
        handleClick={() => {}}
        username="mekusa"
        chatSummary="This is a very long chat summary"
      />
      <ChatBlock
        handleClick={() => {}}
        username="mekusa"
        chatSummary="This is a very long chat summary"
      />
      <ChatBlock
        handleClick={() => {}}
        username="mekusa"
        chatSummary="This is a very long chat summary"
      />
    </ul>
  )
}

export default ListingBody
