import React, { useState, useContext, useEffect, useRef } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const scrollEndRef = useRef();

  // ✅ Send text message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      await sendMessage({ text: input.trim() });
      setInput('');
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Send Message Error:', error);
    }
  };

  // ✅ Handle image sending
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await sendMessage({ image: reader.result });
        toast.success('Image sent successfully');
      } catch (error) {
        toast.error('Failed to send image');
        console.error('Image Send Error:', error);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // ✅ Fetch messages for selected user
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id).catch(() =>
        toast.error('Failed to fetch messages')
      );
    }
  }, [selectedUser]);

  // ✅ Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollEndRef.current && messages) {
      scrollEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ✅ When no user is selected
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-gray-400 bg-white/10 w-full h-full rounded-lg max-md:hidden">
        <img src={assets.logo} className="max-w-20 opacity-80" alt="Logo" />
        <p className="text-lg font-semibold text-white">
          Chat anytime, anywhere 💬
        </p>
        <p className="text-sm text-gray-400">
          Select a user to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-[#1c1c2b] to-[#12121b] rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 px-5 border-b border-gray-700 bg-[#1f1f2e]/70 backdrop-blur-md sticky top-0 z-10">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="User"
          className="w-9 h-9 rounded-full border border-gray-500"
        />
        <div className="flex-1">
          <p className="text-lg text-white font-medium flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            )}
          </p>
          <p className="text-xs text-gray-400">
            {onlineUsers.includes(selectedUser._id)
              ? 'Online'
              : 'Last seen recently'}
          </p>
        </div>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-6 cursor-pointer invert hover:opacity-80 transition"
        />
        <img
          src={assets.help_icon}
          alt="Help"
          className="hidden md:block w-5 cursor-pointer opacity-80 hover:opacity-100"
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No messages yet. Say hi 👋
          </p>
        )}

        {messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;
          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 ${
                isSender ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Avatar */}
              {!isSender && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt="Receiver"
                  className="w-7 h-7 rounded-full"
                />
              )}

              {/* Message Bubble */}
              <div
                className={`flex flex-col max-w-[70%] ${
                  isSender ? 'items-end' : 'items-start'
                }`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="Sent"
                    className="max-w-[240px] rounded-2xl border border-gray-600 shadow-md mb-1"
                  />
                ) : (
                  <p
                    className={`p-3 rounded-2xl text-sm md:text-base break-words ${
                      isSender
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-gray-700/60 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <span className="text-xs text-gray-400 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </span>
              </div>

              {/* Sender Avatar */}
              {isSender && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt="Sender"
                  className="w-7 h-7 rounded-full"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEndRef}></div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 p-3 border-t border-gray-700 bg-[#1f1f2e]/90 backdrop-blur-md"
      >
        <div className="flex-1 flex items-center bg-gray-800/60 px-3 py-2 rounded-full">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Image Upload */}
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Gallery"
              className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 transition mr-2"
            />
          </label>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 p-2 rounded-full transition"
        >
          <img
            src={assets.send_button}
            alt="Send"
            className="w-5 h-5 invert"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;
