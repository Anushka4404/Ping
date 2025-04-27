import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import GroqFeatures from "./GroqFeatures"; // ✨ Import GroqFeatures

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    addMessage, // ✨ Make sure your store has an `addMessage` method to add new messages manually
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [localMessages, setLocalMessages] = useState([]); // ✨ To handle temporary messages like Groq replies

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, localMessages]); // ✨ Also scroll when localMessages update

  const handleGroqResult = (groqText) => {
    const groqMessage = {
      _id: Date.now().toString(), // Temporary ID
      senderId: "groq",
      text: groqText,
      createdAt: new Date().toISOString(),
      image: null,
    };
    setLocalMessages((prev) => [...prev, groqMessage]);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[...messages, ...localMessages].map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id
                ? "chat-end"
                : message.senderId === "groq"
                ? "chat-start"
                : "chat-start"
            }`}
            ref={messageEndRef}
          >
            {message.senderId !== "groq" && (
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
            )}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === "groq" ? "bg-purple-200 text-black" : ""
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* 🛠️ Groq Features Added Here */}
      <div className="p-4 border-t">
        <GroqFeatures chatMessages={[...messages, ...localMessages]} onGroqResult={handleGroqResult} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
