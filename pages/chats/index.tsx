import React, { useState } from 'react';
import styles from "./chats.module.css";

export default function Chats() {
    type Message = {
        speaker: 'user' | 'ai';
        message: string;
    };
    
    type Chat = {
        id: string;
        messages: Message[];
    };
    
    const chats: Chat[] = [
        {
            id: '1',
            messages: [
                { speaker: 'user', message: 'Hello, how are you?' },
                { speaker: 'ai', message: 'I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!' },
                { speaker: 'ai', message: 'What are you up to today?' },
                { speaker: 'user', message: 'Just st chatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you rigchatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you right now.' },
                { speaker: 'user', message: 'Hello, how are you?' },
                { speaker: 'ai', message: 'I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!' },
                { speaker: 'ai', message: 'What are you up to today?' },
                { speaker: 'user', message: 'Just st chatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you rigchatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you right now.' },
                { speaker: 'user', message: 'Hello, how are you?' },
                { speaker: 'ai', message: 'I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!' },
                { speaker: 'ai', message: 'What are you up to today?' },
                { speaker: 'user', message: 'Just st chatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you rigchatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you right now.' },
                { speaker: 'user', message: 'Hello, how are you?' },
                { speaker: 'ai', message: 'I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!I am fine, thank you!' },
                { speaker: 'ai', message: 'What are you up to today?' },
                { speaker: 'user', message: 'Just st chatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you rigchatting with you right now.Just chatting with you right now.Just chatting with you right now.Just chatting with you right now.' },
            ]
        },
        {
            id: '2',
            messages: [
                { speaker: 'user', message: 'I am doing great, thanks!' },
                { speaker: 'ai', message: 'Glad to hear that!' },
                { speaker: 'ai', message: 'dummy to hear that!' },
                { speaker: 'user', message: 'Got any fun projects you’re working on?' },
                { speaker: 'ai', message: 'Yes, working on learning new things!' }
            ]
        },
        {
            id: '3',
            messages: [
                { speaker: 'user', message: 'I am doing great, thanks!' },
                { speaker: 'ai', message: 'Glad to hear that!' },
                { speaker: 'user', message: 'Got any fun projects you’re working on?' },
                { speaker: 'ai', message: 'Yes, working on learning new things!' }
            ]
        },
        {
            id: '4',
            messages: [
                { speaker: 'user', message: 'I am doing great, thanks!' },
                { speaker: 'ai', message: 'Glad to hear that!' },
                { speaker: 'user', message: 'Got any fun projects you’re working on?' },
                { speaker: 'ai', message: 'Yes, working on learning new things!' }
            ]
        },

    ];

    // Initialize activeChat as an object to store both user and ai
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [inputMessage, setInputMessage] = useState<string>('');

    const handleChatClick = (chat: Chat) => {
        setActiveChat(chat);
        setInputMessage(''); // Clear input when changing chats
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };

    const sendMessage = () => {
        if (activeChat && inputMessage) {
            const newMessage: Message = { speaker: 'user', message: inputMessage };
            const updatedChat: Chat = { ...activeChat, messages: [...activeChat.messages, newMessage] };
            setActiveChat(updatedChat); // Update active chat with new message
            setInputMessage(''); // Clear input after sending
        }
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

                        {activeChat ? (
                            <div className={styles.msgAiScroll}>
                                {activeChat.messages.map((message, index) => (
                                    <div key={index} className={styles.msgAiDiv}>
                                        <p className={message.speaker === 'user' ? styles.userMsg : styles.aiMsg}>
                                            {message.speaker === 'user' ? 'USER: ' : 'AI: '}
                                            {message.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.selectChatText}> Select a chat's to view messages</p>
                        )}

                        {activeChat ? (
                            <div className={styles.inputContainer}>
                                <input
                                    className={styles.inputMessage}
                                    type="text"
                                    value={inputMessage}
                                    onChange={handleInputChange}
                                    placeholder="Type your message here..."
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
                        </div>
                        <div className={styles.idNameDiv}>
                            {chats.map(chat => (
                                <div
                                    className={`${styles.idName} ${activeChat && activeChat.id === chat.id ? styles.activeIdName : ''}`}
                                    key={chat.id}
                                    onClick={() => handleChatClick(chat)}
                                >
                                    Chat No {chat.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}