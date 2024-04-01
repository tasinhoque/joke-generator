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
  const [message, setMessage] = useState<string>();
  const [evaluation, setEvaluation] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);
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

      const { message, evaluation } = await response.json();
      setMessage(message);
      setEvaluation(evaluation);
    } catch (error) {
      console.error("Failed to generate the joke:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="bg-gray-100 p-4 w-1/8">
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

      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full absolute">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <>
          {!message ? (
            <></>
          ) : (
            <div className="w-1/4 p-4">
              <h2 className="text-xl font-bold mb-4">Jokes</h2>
              <div className="overflow-auto h-full">
                <div className="whitespace-pre-wrap bg-green-200 p-3 m-2 rounded-lg">
                  {message}
                </div>
              </div>
            </div>
          )}
          {!evaluation ? (
            <></>
          ) : (
            <div className="w-1/2 p-4">
              <h2 className="text-xl font-bold mb-4">Evaluation</h2>
              <div className="overflow-auto h-full">
                <div className="whitespace-pre-wrap bg-slate-200 p-3 m-2 rounded-lg">
                  {evaluation}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
