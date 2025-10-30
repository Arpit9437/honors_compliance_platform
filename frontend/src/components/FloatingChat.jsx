import { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import Chatbot from './Chatbot';

const FloatingChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center hover:bg-indigo-700"
        >
          <FaComments />
        </button>
      </div>

      {/* Modal / slide-up panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          <div className="relative m-4 w-full max-w-sm md:max-w-md lg:max-w-lg">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-[80vh]">
              <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-700">
                <h3 className="font-semibold">Chatbot</h3>
                <button
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <Chatbot />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
