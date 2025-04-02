import React, { useState } from "react";
import Sidebar from "../Components/Sidebar"; 
import user from "../assets/user.png";

const ChatComponent = () => {
    const [messages, setMessages] = useState([
        { id: 1, img: user, text: "Hi, John! Just checking if we're still on for the meeting at 2 PM today?", time: "12:30 PM", sent: false },
        { id: 2, img: user, text: "Yes, absolutely! I've prepared all the documents we need to discuss.", time: "12:32 PM", sent: true },
        { id: 3, img: user, text: "Perfect! I'll see you in the conference room then.", time: "12:33 PM", sent: false },
    ]);
    
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault(); 

        if (newMessage.trim() === "") return; // Don't send empty messages

        const newMsg = {
            id: messages.length + 1,
            img: user,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sent: true, // Assuming the user is sending this
        };

        setMessages([...messages, newMsg]); // Update chat messages
        setNewMessage(""); // Clear input field
    };

    return (
        <div className="flex">
            <Sidebar />
            <section className="h-[100vh] w-full flex flex-col">
                {/* Header with shadow */}
                <div className="upper w-full h-[10vh] flex p-4 gap-5 items-center shadow-md bg-white">
                    <img src={user} alt="User" className="w-12 h-12 rounded-full"/>
                    <h1 className="text-2xl font-bold">Pixie Dust</h1>
                </div>

                {/* Chat messages area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`flex items-start gap-2 mb-4 max-w-[30%] p-3 rounded-lg ${message.sent ? 'bg-[#6F0081] text-white ml-auto flex-row-reverse' : 'bg-gray-200 text-black mr-auto'}`}
                        >
                            <img src={message.img} alt="User" className="w-10 h-8 rounded-full" />
                            <div>
                                <p>{message.text}</p>
                                <p className={`text-xs mt-1 ${message.sent ? 'text-purple-200' : 'text-gray-500'}`}>
                                    {message.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message input field */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F0081]"
                        />
                        <button type="submit" className="p-3 bg-[#6F0081] text-white rounded-lg hover:bg-purple-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </form>
                    
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Canvas</span>
                        <span>Tags</span>
                        <span>Export</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ChatComponent;
