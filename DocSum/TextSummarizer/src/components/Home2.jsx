import React, { useEffect, useState, useContext } from 'react';
import ChatWindow from './ChatWindow';
import './Chat.css';
import { BsFillSendFill } from "react-icons/bs";
import { chatContext } from '../context/chatContext';
import axios from 'axios'

function Home2() {
    let [, fetchAllConversations, selectedConversation,,getBotReply] = useContext(chatContext)
    const [chatData, setChatData] = useState([]);
    console.log(selectedConversation)
    /*const rawChatData = "user_prompt:abcd;bot_reply:efgh;user_prompt:Hello;bot_reply:Hi there!;"; // Example data*/
    const [input, setInput] = useState("");

    useEffect(() => {
        setChatData(selectedConversation?.conv)
    }, [selectedConversation]);

    const handleSendMessage = async () => {
        const userMessage = input;
        console.log(input)
        const botReply = await getBotReply(chatData,input); // Function to get bot reply
        const response = await axios.post(
            'http://localhost:5298/DocSum/UpdateConversation',
            null,
            {
                params: {
                    id: selectedConversation.id,
                    userPrompt: userMessage,
                    botReply: botReply
                }
            }
        );
        setChatData(response.data.conv)
        //let newChatData=[]
        //// Format data for display
        //if (response != undefined && selectedConversation != undefined) {
        //    newChatData = [
        //        ...chatData,
        //        { id: chatData.length + 1, role: 'user', content: input },
        //        { id: chatData.length + 2, role: 'bot', content: botReply }
        //    ];
        //} else {
        //    newChatData = [
        //        { id: 0, role: 'user', content: input },
        //        { id: 1, role: 'bot', content: botReply }
        //    ]
        //}

        //setChatData(newChatData);
        fetchAllConversations();
        setInput("");
    };

    

    return (
        <div className="Home2">
            <ChatWindow chatData={chatData} />
            <div className="bg-white">
                <div className="chat-input input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <div className="input-group-append">
                        <button className="btn h-full" onClick={handleSendMessage}><BsFillSendFill /></button>
                    </div>
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