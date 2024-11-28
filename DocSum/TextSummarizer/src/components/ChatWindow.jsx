import React from 'react';

function ChatWindow({ chatData }) {
    return (
        <div className="chat-window mb-[5%]">
            {chatData?.map(({ role, content }, index) => (
                <div key={index} className={`chat-message ${role}`}>
                    <div className="message-content">
                        {content}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatWindow;
