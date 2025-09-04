import React, { useEffect, useRef, useState } from 'react'
import ChatbotIcon from './components/ChatbotIcon'
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage'
import { MdComment } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import companyDt from "./companyDt.js"

const App = () => {
  const [chatHistory,setChatHistory] = useState([
    {
    hideInChat: true,
    role: "model",
    text: companyDt
  },
]);
  const [showChatbot,setShowChatbot] = useState(false);

  const chatBodyRef = useRef();

    const generateBotResponse =async (history) =>{
      // Helper function to update the chat history
      const updateHistory = (text, isError = false) =>{
          setChatHistory(prev => [...prev.filter(msg => msg.text !=="Thinking..."),{role: "model", text, isError}]);
      }
    
      // format chat history for API request
      history = history.map(({role,text}) => ({role,parts: [{text}]}));

      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({contents: history })
      }

      try{
        // make the api call to get the bots response
        const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message || "Something went wrong!");

        // clean and update chat history with bots response
        
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1"). 
        trim();
        updateHistory(apiResponseText);
        
      } catch(error){
        updateHistory(error.message, true);
      }
    };

    useEffect(() => {
    // Auto-scroll whenever chat history updates
      chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"})
    })

  return (
    <div className={`container ${showChatbot ? 'show-chatbot': ""}`}>
    <button onClick={()=> setShowChatbot(prev =>!prev)} id="chatbot-toggler">
      <span className='material-symbols-rounded'>{<MdComment />}</span>
      <span className='material-symbols-rounded'>{<RxCross1 />}</span>
    </button>
      <div className='chatbot-popup'>
      {/* chatbot header */}
      <div className="chat-header">
        <div className="header-info">
        <ChatbotIcon/>
          <h2 className='logo-text'>Chatbot</h2>
        </div>
        <button onClick={()=> setShowChatbot(prev =>!prev)}>
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </div>

      {/* chatbot body */}
      <div ref={chatBodyRef} className="chat-body">
      <div className="message bot-message">
        <ChatbotIcon/>
        <p className="message-text">Hey there 🤖 <br/>How can I help you today?</p>
      </div>

      {/* Render the chat history dynamically */}
      {chatHistory.map((chat,index) =>(
        <ChatMessage key={index} chat={chat} />
      ))}
      </div>

      {/* Chatbot Footer */}
      <div className="chat-footer">
        <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
      </div>
      </div>
    </div>
  )
}

export default App

