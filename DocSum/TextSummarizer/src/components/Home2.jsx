import React, { useEffect, useState } from 'react';
import ChatWindow from './ChatWindow';
import './Chat.css';
import { BsFillSendFill } from "react-icons/bs";


function Home2({ selectedConversation, changeSelectedConversation }) {
    const [chatData, setChatData] = useState([
        {
            "role": "user",
            "content": "hi"
        },
        {
            "role": "assistant",
            "content": "hello"
        },
        {
            "role": "user",
            "content": "hi1"
        },
        {
            "role": "assistant",
            "content": "hello1"
        }
    ]);
    /*const rawChatData = "user_prompt:abcd;bot_reply:efgh;user_prompt:Hello;bot_reply:Hi there!;"; // Example data*/
    const [input, setInput] = useState("");

    /* useEffect(() => {
    }, []);*/

    const handleSendMessage = async () => {
        const userMessage = input;
        const botReply = "hi"//await getBotReply(userMessage); // Function to get bot reply

        // Format data for display
        const newChatData = [
            ...chatData,
            { id: chatData.length + 1, sender: 'user', message: userMessage },
            { id: chatData.length + 2, sender: 'assistant', message: botReply }
        ];

        setChatData(newChatData);
        setInput("");
    };

    const getBotReply = async (message) => {
        // Function to get bot reply (for demo, returning a static reply)
        // Replace this with actual bot integration logic
        return "This is a bot reply to: " + message;
    };

    return (
        <div className="App">
            <ChatWindow chatData={chatData} />
            <div className="chat-input input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <div className="input-group-append">
                    <button className="btn " onClick={handleSendMessage}><BsFillSendFill /></button>
                </div>
            </div>

        </div>
    );
}

export default Home2;







/*import React, { useEffect, useState } from 'react';
import ChatWindow from './ChatWindow'; 
import './Chat.css'; 

function Home2() {
    const [chatData, setChatData] = useState([]);
    const rawChatData = "user_prompt:abcd;bot_reply:efgh;user_prompt:Hello;bot_reply:Hi there!;"; // Example data
    const [input, setInput] = useState("");
    useEffect(() => {
        const parsedData = parseChatData(rawChatData);
        setChatData(parsedData);
    }, []);

    const parseChatData = (data) => {
        const pairs = data.split(';').filter(pair => pair);
        const parsedChatData = [];
        let id = 1;

        for (let i = 0; i < pairs.length; i += 2) {
            if (pairs[i] && pairs[i + 1]) {
                const userMessage = pairs[i].split(':')[1];
                const botReply = pairs[i + 1].split(':')[1];
                parsedChatData.push({ id: id++, sender: 'user', message: userMessage });
                parsedChatData.push({ id: id++, sender: 'bot', message: botReply });
            }
        }
        return parsedChatData;
    };  

    return (
        <div className="App">
            <ChatWindow chatData={chatData} />
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Home2;
*/