import React from "react"

import "./chatBlock.css"

const ChatBlock = ({ username, chatSummary, handleClick }) => {
  return (
    <li className="chat-block" onClick={handleClick}>
      <h3 className="chat-block__header">{username}</h3>
      <p className="chat-block__content">{chatSummary.substr(0, 40)}</p>
    </li>
  )
}

export default ChatBlock
