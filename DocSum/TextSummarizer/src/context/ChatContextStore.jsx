/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react"
import axios from "axios";
import { chatContext } from "./chatContext";

function ChatContextStore({ children }) {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [allConversations, setAllConversations] = useState([]);
    useEffect(() => {
        axios.post('http://localhost:5298/DocSum/GetAllConversation', {
            headers: {
                'Accept': 'text/plain'
            }
        })
            .then(response => {
                console.log(response);
                setAllConversations(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const changeSelectedConversation = (conversation) => {
        setSelectedConversation(conversation);
    }
    const fetchAllConversations = (conversations) => {
        axios.post('http://localhost:5298/DocSum/GetAllConversation', {
            headers: {
                'Accept': 'text/plain'
            }
        })
            .then(response => {
                console.log(response);
                setAllConversations(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    const getBotReply = async (chatData, message) => {
        
        let summ = selectedConversation.summaries.further_summary;
        console.log(selectedConversation)
        const response = await axios.post('http://localhost:5000/chat', { summ, chatData, message }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let botReply = response.data.response
        return botReply;
    };
    return (
        <chatContext.Provider value={[allConversations, fetchAllConversations, selectedConversation, changeSelectedConversation, getBotReply]}>
            {children}
        </chatContext.Provider>
    )
}
export default ChatContextStore;