"use client";

import { FormEventHandler, useState } from "react";

const toneOptions = ["Friendly", "Sarcastic", "Dry", "Witty"];
const typeOptions = ["Pun", "One-liner", "Story"];
const topicOptions = ["Tech", "Food", "Animals", "Random"];

export default function Chat() {
  const [count, setCount] = useState("3");
  const [tone, setTone] = useState(toneOptions[0]);
  const [type, setType] = useState(typeOptions[0]);
  const [topic, setTopic] = useState(topicOptions[0]);
  const [messages, setMessages] = useState<string[]>(["Hi there!"]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const payload = { count, tone, type, topic };

    try {
      const response = await fetch("/api/joke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { message } = await response.json();
      console.log(message);
      setMessages([message]);
    } catch (error) {
      console.error("Failed to generate the joke:", error);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="flex-initial bg-gray-100 p-4 w-1/4">
        <form onSubmit={handleSubmit}>
          <label>
            Count:
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
          <label>
            Tone:
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded mb-4"
            >
              {toneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded mb-4"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Topic:
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded mb-4"
            >
              {topicOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate Joke
          </button>
        </form>
      </div>
      <div className="flex-auto p-4">
        <div className="flex flex-col h-full">
          <div className="overflow-auto h-full">
            {messages.map((m, index) => (
              <div
                key={index}
                className={
                  "whitespace-pre-wrap bg-slate-200 p-3 m-2 rounded-lg"
                }
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
