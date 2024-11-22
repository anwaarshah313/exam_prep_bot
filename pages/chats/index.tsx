import React, { useEffect, useState , useRef} from 'react';
import styles from "./chats.module.css";
import axios from 'axios';
import { VscGitPullRequestNewChanges, VscTrash } from "react-icons/vsc";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import config from "@/pages/api/config"

export default function Chats() {
    type Message = {
        user: 'user' | 'ai';
        message: string;
    };

    type Chat = {
        id: string;
        messages: Message[];
    };


    // Initialize activeChat as an object to store both user and ai
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [threadIdGen, setThreadIdGen] = useState<any>(null);
    const [threads, setThreads] = useState<any>([]);
    const [userId, setUserId] = useState<string | null>(null);  // State to hold the user ID
    
    const auth = getAuth();



        

    const fetchMessages = async (thread_id: string) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/get_messages/${thread_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Msg',data)
            // Assuming data.messages is an array of objects {ai: "string", user: "string"}
            const formattedMessages = data.messages;
    
            return formattedMessages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];  // Return empty array on error
        }
    };
    
    

    useEffect(() => {
        if (threadIdGen && threads.some(t => t === threadIdGen)) {
            handleChatClick(threadIdGen);
        }
    }, [threads, threadIdGen]);  // Re-run when threads or threadIdGen changes

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                localStorage.setItem('userId', user.uid); // Store the user ID in local storage
                setUserId(user.uid); // Also set it in state if not yet set
            } else {
                localStorage.removeItem('userId'); // Clean up on log out
                setUserId(null);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
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
            console.error('Error fetching threads:', error);
        }
    };
    
    useEffect(() => {
        fetchThreads();
    }, [userId]);
    console.log("hhhhhhh", threads)

    
    const handleChatClick = async (thread_id: string) => {
        const messages = await fetchMessages(thread_id);
        const updatedChat: Chat = {
            id: thread_id,
            messages: messages
        };
        setActiveChat(updatedChat);
        setInputMessage(''); // Clear input when changing chats
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
    }, [activeChat?.messages]); // Scroll to bottom every time messages update


    const sendMessage = async () => {
    if (!activeChat || !inputMessage || !userId) {
        console.error("No active chat or message input or user ID.");
        return;
    }

    const messageData = {
        user: "user", // As specified, always send "human" as the user
        message: inputMessage,
        thread_id: activeChat.id
    };

    try {
        const response = await axios.post(`${config.apiBaseUrl}/send_message`, messageData);
        if (response.status === 200 && response.data) {
            const newMessages = response.data.messages;
            
            console.log('new Messages',newMessages);
           
            const updatedChat = {
                ...activeChat,
                messages: [...newMessages]
            };

            setActiveChat(updatedChat); // Update active chat with new messages
            setInputMessage(''); // Clear input after sending
        } else {
            throw new Error('Failed to send message.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};



const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
        // Prevent default to avoid adding a new line when sending the message
        e.preventDefault();
        sendMessage();
    }
    // If only Enter is pressed, allow it to add a new line by not doing anything
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
                console.log("New thread created with ID:", newThreadId);
                setThreadIdGen(newThreadId);  // Assuming the response includes a thread_id
    
                // Fetch updated threads list after adding a new thread and select the new chat
                await fetchThreads();
                handleChatClick(newThreadId);  // Select the new chat automatically
            } else {
                throw new Error('Failed to start a new thread.');
            }
        } catch (error) {
            console.error('Error starting new chat:', error);
        }
    };
    
    console.log("thread id", threadIdGen)



    const deleteChat = (chatId: string) => {
        // if (window.confirm("Are you sure you want to delete this chat?")) {
        //     setChats(chats.filter(chat => chat.id !== chatId));
        //     if (activeChat && activeChat.id === chatId) {
        //         setActiveChat(null); // Clear active chat if it's the one being deleted
        //     }
        // }
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
                                Chat ID: {activeChat.id}
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
                onClick={() => handleChatClick(thread.thread_id)}
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

