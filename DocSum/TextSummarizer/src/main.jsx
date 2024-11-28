import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ChatContextStore from './context/ChatContextStore.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChatContextStore>
    <App />
    </ChatContextStore>,
)
