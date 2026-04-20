import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { BiExpandAlt, BiCollapseAlt } from 'react-icons/bi';

const AgentWidget = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className={`${
          isDarkMode ? 'bg-[#1c1c24] text-white' : 'bg-white text-gray-800'
        } rounded-lg shadow-lg transition-all duration-300 ${
          isMaximized 
            ? 'fixed top-0 left-0 right-0 bottom-0 w-full h-full rounded-none' 
            : 'w-[350px] h-[500px]'
        } overflow-hidden`}>
          <div className="flex items-center justify-end gap-2 p-2 bg-opacity-90">
            <button
              onClick={toggleMaximize}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
            >
              {isMaximized ? <BiCollapseAlt size={24} /> : <BiExpandAlt size={24} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close chat"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          <div className={`h-[calc(100%-40px)]`}>
            <iframe
              src="https://copilotstudio.microsoft.com/environments/Default-063fad6b-e190-4c69-a9ca-1721c758a752/bots/cr503_copyOfYui/webchat?__version__=2"
              frameBorder="0"
              style={{ width: '100%', height: '100%' }}
              title="Support Agent Chat"
            />
          </div>
        </div>
      ) : (        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#673ab7] hover:bg-[#563098] text-white rounded-lg px-6 py-3 shadow-lg transition-all duration-300 animate-bounce flex items-center gap-2 font-semibold"
          aria-label="Open Support Chat"
        >
          <IoChatbubbleEllipsesOutline size={20} />
          <span>AI Chat</span>
        </button>
      )}
    </div>
  );
};

export default AgentWidget;