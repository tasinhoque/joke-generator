"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-screen  max-w-prose pb-16 pt-4 mx-auto stretch">
      <div className="overflow-auto h-[95%]  w-full" ref={messagesContainerRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-green-200 p-3 m-2 rounded-lg"
                : "bg-slate-200 p-3 m-2 rounded-lg"
            }`}
          >
            {m.content}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-bounce">...</span>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 w-full max-w-prose mb-8">
        <form onSubmit={handleSubmit} className="flex justify-center">
          <textarea
            rows={1}
            className="w-[94%] p-2 border border-gray-300 rounded shadow-xl  text-black"
            disabled={isLoading}
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <button
            className="p-2 ml-2 bg-black rounded focus:outline-none focus:ring focus:border-blue-300"
            disabled={isLoading}
            type="submit"
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
