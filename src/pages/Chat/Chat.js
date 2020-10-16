import React from 'react';

import ChatListing from '../../components/chat-listing/main/chatListing';
import SingleChat from '../../components/single-chat/main/singleChat';

const Chat = (props) => {
    return (
        <section>
            <ChatListing />
            <SingleChat />
        </section>
    );
}

export default Chat;