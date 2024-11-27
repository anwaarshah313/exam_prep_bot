import React, { useEffect, useState, useRef } from 'react';
import styles from '../pages/chats/chats.module.css';
import axios from 'axios';
import { VscGitPullRequestNewChanges, VscTrash } from "react-icons/vsc";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import config from "@/pages/api/config";

interface Message {
    user: 'user' | 'ai';
    message: string;
}

interface Chat {
    id: string;
    messages: Message[];
}

interface Thread {
    thread_id: string;
    thread_title: string;
}

export default function Home() {
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [threadIdGen, setThreadIdGen] = useState<string | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [userId, setUserId] = useState<string | null>(null);  
    const [selectedChatName, setSelectedChatName] = useState<string>('');

    const auth = getAuth();

    const fetchMessages = async (thread_id: string) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/get_messages/${thread_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const formattedMessages: Message[] = data.messages;
            return formattedMessages;
        } catch (error) {
           
            return [];  // Return empty array on error
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                localStorage.setItem('userId', user.uid); // Store the user ID in local storage
                setUserId(user.uid); // Also set it in state if not yet set
            } else {
                localStorage.removeItem('userId'); // Clean up on log out
                setUserId(null);
            }
        });
    }, []);

    const fetchThreads = async () => {
        if (!userId) return;
    
        try {
            const response = await fetch(`${config.apiBaseUrl}/get_user_threads/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setThreads(data.threads);
        } catch (error) {
           
        }
    };

    useEffect(() => {
        fetchThreads();
    }, [userId]);

    const handleChatClick = async (thread_id: string, thread_title: string) => {
        const messages = await fetchMessages(thread_id);
        const updatedChat: Chat = {
            id: thread_id,
            messages: messages
        };
        setActiveChat(updatedChat);
        setInputMessage('');
        setSelectedChatName(thread_title);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(e.target.value);
    };

    const messageEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    const sendMessage = async () => {
        if (!activeChat || !inputMessage || !userId) {
           
            return;
        }

        const messageData = {
            user: "user", 
            message: inputMessage,
            thread_id: activeChat.id
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}/send_message`, messageData);
            if (response.status === 200 && response.data) {
                const newMessages = response.data.messages as Message[];
                const updatedChat = {
                    ...activeChat,
                    messages: newMessages
                };

                setActiveChat(updatedChat);
                setInputMessage('');
            } else {
                throw new Error('Failed to send message.');
            }
        } catch (error) {
           
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const addNewChat = async () => {
        if (!userId) {
            alert("No user logged in!");
            return;
        }
    
        try {
            const response = await axios.get(`${config.apiBaseUrl}/start_thread?user_id=${userId}`);
            if (response.status === 200 && response.data && response.data.thread_id) {
                const newThreadId = response.data.thread_id;
                setThreadIdGen(newThreadId);
                await fetchThreads();
                handleChatClick(newThreadId, "");  // Assume empty title or handle accordingly
            } else {
                throw new Error('Failed to start a new thread.');
            }
        } catch (error) {
         
        }
    };

    const deleteChat = async (chatId: string) => {
        if (window.confirm("Are you sure you want to delete this chat?")) {
            try {
                await axios.delete(`${config.apiBaseUrl}/delete_chat/${chatId}`);
                if (activeChat && activeChat.id === chatId) {
                    setActiveChat(null);
                }
                fetchThreads();
            } catch (error) {
                
            }
        }
    };

    const showProfileImage = (messages: Message[], index: number) => {
        if (index === 0) return true; // Show for the first message
        return messages[index].user !== messages[index - 1].user;
    };

    return (

        <div className={styles.chatMain}>
            <div className={styles.chatIn}>
                <div className={styles.chatOut}>
                    <div className={styles.msgOut}>
                        
                        {activeChat ? (
                            <div className={styles.chatNav}>
                         Chat: {selectedChatName}
                            </div>
                        ) : (
                            <></>
                        )}
          
         


                        {activeChat?.messages.length === 0 ? (<p className={styles.selectChatText}>Please click new chat and start conversation!</p>) : (
                            <>
                                {activeChat ? (
                                    <div className={styles.msgAiScroll}>
                                        {activeChat.messages.length > 0 ? (
                                            activeChat.messages.map((message, index) => (
                                                <div key={index} className={styles.msgAiDiv}>
                                                    {message.user === 'ai' ? (
                                                        <>
                                                            {showProfileImage(activeChat.messages, index) ? (
                                                                <img
                                                                    src="https://th.bing.com/th/id/OIP.eDmVlM1M4HwCRrBBPJX3vwHaHa?rs=1&pid=ImgDetMain"
                                                                    alt="AI"
                                                                    className={styles.profileImage}
                                                                />
                                                            ) : (
                                                                <div className={styles.profileImagePlaceholder}></div>
                                                            )}
                                                            <p className={styles.aiMsg}>
                                                                {message.message}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className={styles.userMsg}>
                                                                {message.message}
                                                            </p>
                                                            {showProfileImage(activeChat.messages, index) ? (
                                                                <img
                                                                    src="https://th.bing.com/th/id/OIP.j-JTkZ2VRxE0QvycQpQJbgAAAA?rs=1&pid=ImgDetMain"
                                                                    alt="User"
                                                                    className={styles.profileImage}
                                                                />
                                                            ) : (
                                                                <div className={styles.profileImagePlaceholder}></div>
                                                            )}
                                                        </>
                                                    )}
                                                  <div ref={messageEndRef} />  {/* Empty div for scrolling reference */}
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles.noMessagesText}>Enter your message and begin the conversation!</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className={styles.selectChatText}> Select a chat to view messages</p>
                                )}
                            </>)}
                        {activeChat ? (
                            <div className={styles.inputContainer}>
                                <textarea
                                    className={styles.inputMessage}
                                    value={inputMessage}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message here..."
                                    rows={1}
                                />
                                <button className={styles.sendMessageButton} onClick={sendMessage}>
                                    Send
                                </button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className={styles.idOut}>
                        <div className={styles.idNav}>
                            Chat's
                            <button onClick={addNewChat}>
                                <VscGitPullRequestNewChanges className={styles.addBtnIcon} />
                            </button>
                        </div>
                

                        <div className={styles.idNameDiv}>
                        {threads.map((thread) => (
    <div
        className={`${styles.idName} ${activeChat && activeChat.id === thread.thread_id ? styles.activeIdName : ''}`}
        key={thread.thread_id}
        onClick={() => handleChatClick(thread.thread_id, thread.thread_title)}  // Adjusted to pass thread title
    >
        <span className={styles.idSpan}>
            {thread.thread_title}  {/* Display the thread title */}
        </span>
        <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); deleteChat(thread.thread_id); }}>
            <VscTrash className={styles.deleteBtnIcon} />
        </button>
    </div>
))}

                        </div>
                

                    </div>
                </div>
            </div>
        </div>
    );
}

