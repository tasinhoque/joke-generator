"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { getRandomInt } from "../helpers/randomInt";
import {
  Button,
  LoadingSpinner,
  MessageBox,
  Select,
  TextInput,
} from "./components";

const creativityOptions = ["Low", "Medium", "High"];

export default function Chat() {
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [toneOptions, setToneOptions] = useState<string[]>([]);
  const [topicOptions, setTopicOptions] = useState<string[]>([]);

  const [count, setCount] = useState<number | undefined>();
  const [tone, setTone] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [topic, setTopic] = useState<string | undefined>();
  const [creativity, setCreativity] = useState<string | undefined>();

  const [message, setMessage] = useState<string | undefined>();
  const [evaluation, setEvaluation] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [typeResponse, toneResponse, topicResponse] = await Promise.all([
        fetch("/types.json"),
        fetch("/tones.json"),
        fetch("/topics.json"),
      ]);

      const [types, tones, topics] = await Promise.all([
        typeResponse.json(),
        toneResponse.json(),
        topicResponse.json(),
      ]);

      setTypeOptions(types);
      setToneOptions(tones);
      setTopicOptions(topics);

      setCount(getRandomInt(10) + 1);
      setTone(tones[getRandomInt(tones.length)]);
      setType(types[getRandomInt(types.length)]);
      setTopic(topics[getRandomInt(topics.length)]);
      setCreativity(creativityOptions[getRandomInt(3)]);
    }

    fetchData();
  }, []);

  const randomize = () => {
    setCount(getRandomInt(10) + 1);
    setTone(toneOptions[getRandomInt(toneOptions.length)]);
    setType(typeOptions[getRandomInt(typeOptions.length)]);
    setTopic(topicOptions[getRandomInt(topicOptions.length)]);
    setCreativity(creativityOptions[getRandomInt(3)]);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const payload = { count, tone, type, topic, creativity };

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
    <div className="flex w-full h-full">
      <div className="bg-gray-100 p-4 w-1/8 h-screen">
        <form onSubmit={handleSubmit}>
          <Select
            label="Topic"
            options={topicOptions}
            value={topic}
            onChange={(value: string) => setTopic(value)}
          />
          <TextInput
            label="Count"
            value={count}
            onChange={(value: number) => setCount(value)}
          />
          <Select
            label="Tone"
            options={toneOptions}
            value={tone}
            onChange={(value: string) => setTone(value)}
          />
          <Select
            label="Type"
            options={typeOptions}
            value={type}
            onChange={(value: string) => setType(value)}
          />
          <Select
            label="Creativity Level"
            options={creativityOptions}
            value={creativity}
            onChange={(value: string) => setCreativity(value)}
          />
          <Button
            onClick={randomize}
            colorClass="bg-green-600 hover:bg-green-700"
          >
            Get Random Jokes
          </Button>

          <Button colorClass="bg-blue-600 hover:bg-blue-700">
            Generate Jokes
          </Button>
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <MessageBox
            title="Jokes"
            message={message}
            bgColorClass="bg-green-200"
          />
          <MessageBox
            title="Evaluation"
            message={evaluation}
            bgColorClass="bg-slate-200"
          />
        </>
      )}
    </div>
  );
}
