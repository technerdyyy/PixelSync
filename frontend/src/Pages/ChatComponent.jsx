import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar"; 
import user from "../assets/user.png";
import socket from "../socket";  

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        socket.on("connect", () => {
            setClientId(socket.id);
            console.log("Connected! Client ID:", socket.id); // 🔴 DEBUG
        });

        socket.on("message", (message) => {
            console.log("Received message:", message); // 🔴 DEBUG
            console.log("Client ID:", clientId, "Message Sender ID:", message.senderId); // 🔴 DEBUG
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault(); 

        if (newMessage.trim() === "") return;

        const newMsg = {
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            img: user
        };

        socket.emit("chatMessage", newMsg);
        setNewMessage("");
    };

    return (
        <div className="flex">
            <Sidebar />
            <section className="h-[100vh] w-full flex flex-col">
                {/* Header */}
                <div className="upper w-full h-[10vh] flex p-4 gap-5 items-center shadow-md bg-white">
                    <img src={user} alt="User" className="w-12 h-12 rounded-full"/>
                    <h1 className="text-2xl font-bold">Pixie Dust</h1>
                </div>

                {/* Chat messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                    {messages.map((message, index) => {
                        const isSent = message.senderId === clientId; // Compare sender ID with client ID
                        console.log("Rendering Message:", message.text, "Sent:", isSent); // 🔴 DEBUG

                        return (
                            <div 
                                key={index} 
                                className={`flex items-start gap-2 mb-4 max-w-[30%] p-3 rounded-lg 
                                    ${isSent ? 'bg-gray-200 text-black mr-auto' : 'bg-[#6F0081] text-white ml-auto flex-row-reverse'}`}
                            >
                                <img src={message.img} alt="User" className="w-10 h-8 rounded-full" />
                                <div>
                                    <p>{message.text}</p>
                                    <p className={`text-xs mt-1 ${isSent ? 'text-gray-500' : 'text-purple-200'}`}>
                                        {message.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Message input */}
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
                </div>
            </section>
        </div>
    );
};

export default ChatComponent;
