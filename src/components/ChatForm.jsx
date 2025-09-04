import React, {useRef} from 'react'
import { MdArrowUpward } from "react-icons/md";


const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();


    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = "";
        
        // update chat history with the users messafe
        setChatHistory((history) => [...history,{role: "user", text: userMessage}]);

    // Add a thinking.... "placeholder for the bot's response"
        setTimeout(()=> setChatHistory((history) => [...history,{role: 'model', text: "Thinking..."}]),600)

        generateBotResponse([...chatHistory,{role: "user", text: `using the details provided above,please address this query: ${userMessage}`}])
    }
  return (
    <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
        <input type='text' ref={inputRef} placeholder='Message' className='message-input' required/>
        <button>
        <span className="material-symbols-outlined"><MdArrowUpward/></span>
        </button>
        </form>
  )
}

export default ChatForm
