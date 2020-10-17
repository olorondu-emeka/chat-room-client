import React from "react"

import "./listingHeader.css"

const ListingHeader = (props) => {
  return (
    <header className="listing-header">
      <h1 className="listing-header__title">Chats</h1>
      <div className="listing-header__button-group">
        <button className="listing-header__button">Create Group</button>
        <button className="listing-header__button">Logout</button>
      </div>
    </header>
  )
}

export default ListingHeader
