import Head from "next/head";
import React, { useState, FormEvent } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Space_Grotesk } from "@next/font/google";
import { AnimatePresence, motion } from "framer-motion";

import ResizablePanel from "../components/ResizablePanel";
import Header from "../components/Header";

const spaceGrotesk = Space_Grotesk({
  weight: "700",
  display: "swap",
  subsets: ["latin"],
});

const fetchOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};

export default function Home(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [englishText, setEnglishText] = useState<string>("");
  const [momInput, setMomInput] = useState<string>("");
  const [mandarinTranslation, setMandarinTranslation] = useState<string>("");
  const [generatedReply, setGeneratedReply] = useState<string>("");
  const [suggestedReply, setSuggestedReply] = useState<string>("");
  const [replyExplanation, setReplyExplanation] = useState<string>("");
  const [mandarinReply, setMandarinReply] = useState<string>("");
  const [englishInterpretation, setEnglishInterpretation] = useState<string>("");
  const [mandarinInterpretation, setMandarinInterpretation] = useState<string>("");

  const processText = async (): Promise<void> => {
    if (englishText.trim() === "") {
      toast.error("Please enter the English text!");
      return;
    }
    setMandarinTranslation("");
    setGeneratedReply("");
    setSuggestedReply("");
    setReplyExplanation("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        ...fetchOptions,
        body: JSON.stringify({ englishText, momInput }),
      });
      const data = await response.json();
      setMandarinTranslation(data.mandarinTranslation);
      if (data.reply) {
        const [englishInterp, mandarinInterp, englishReply, mandarinReply, mandarinExplanation] = data.reply.split('\n\n');
        setEnglishInterpretation(englishInterp);
        setMandarinInterpretation(mandarinInterp);
        setGeneratedReply(englishReply);
        setSuggestedReply(englishReply);
        setMandarinReply(mandarinReply);
        setReplyExplanation(mandarinExplanation);
      } else {
        setEnglishInterpretation("");
        setMandarinInterpretation("");
        setGeneratedReply("");
        setSuggestedReply("");
        setMandarinReply("");
        setReplyExplanation("");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center m-0 bg-blue-100 min-h-screen">
      <Head>
        <title>Mom&apos;s English Assistant</title>
        <meta
          name="description"
          content="An AI-powered assistant to help with English communication"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex flex-col items-center pt-14 w-full px-4 md:px-0 max-w-screen-md">
        <h1
          className={`${spaceGrotesk.className} text-3xl font-bold text-blue-800 sm:leading-9 sm:truncate mb-2 text-center sm:text-4xl lg:text-6xl xl:text-6xl`}
        >
          Mom&apos;s English Assistant
        </h1>
        <h2 className="text-xl text-center text-blue-600 mb-10">
          Translate and Reply with Ease
        </h2>
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            processText();
          }}
          className="w-full mt-5"
        >
          <textarea
            value={englishText}
            onChange={(e) => setEnglishText(e.target.value)}
            placeholder="Paste the English text here"
            className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
          <textarea
            value={momInput}
            onChange={(e) => setMomInput(e.target.value)}
            placeholder="Mom's input or concerns in Mandarin (optional)"
            className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Translate and Generate Reply
          </button>
        </form>

        {loading && (
          <div className="mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 animate-spin text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        )}

        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{ duration: 3000 }}
        />
        <div className="h-px max-w-screen-md w-full border-b border-blue-300 mt-4"></div>

        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-4 my-5">
              {mandarinTranslation && (
                <div className="bg-white rounded-md p-4 border-blue-200 border">
                  <h3 className="text-lg font-semibold mb-2">Mandarin Translation:</h3>
                  <pre className="whitespace-pre-wrap text-blue-800">{mandarinTranslation}</pre>
                </div>
              )}
              {englishInterpretation && (
                <div className="bg-white rounded-md p-4 border-blue-200 border">
                  <h3 className="text-lg font-semibold mb-2">Interpretation of Mom&apos;s Input (English):</h3>
                  <pre className="whitespace-pre-wrap text-blue-800">{englishInterpretation}</pre>
                </div>
              )}
              {mandarinInterpretation && (
                <div className="bg-white rounded-md p-4 border-blue-200 border">
                  <h3 className="text-lg font-semibold mb-2">Interpretation of Mom&apos;s Input (Mandarin):</h3>
                  <pre className="whitespace-pre-wrap text-blue-800">{mandarinInterpretation}</pre>
                </div>
              )}
              {suggestedReply && (
                <div className="bg-white rounded-md p-4 border-blue-200 border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Suggested Reply (English):</h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onClick={() => {
                        navigator.clipboard.writeText(suggestedReply);
                        toast.success("English reply copied to clipboard");
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <pre className="whitespace-pre-wrap text-blue-800">{suggestedReply}</pre>
                </div>
              )}
              {mandarinReply && (
                <div className="bg-white rounded-md p-4 border-blue-200 border">
                  <h3 className="text-lg font-semibold mb-2">Suggested Reply (Mandarin):</h3>
                  <pre className="whitespace-pre-wrap text-blue-800">{mandarinReply}</pre>
                </div>
              )}
              {replyExplanation && (
                <div className="bg-white rounded-md p-4 border-blue-200 border">
                  <h3 className="text-lg font-semibold mb-2">Reply Explanation (in Mandarin):</h3>
                  <pre className="whitespace-pre-wrap text-blue-800">{replyExplanation}</pre>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </div>
    </div>
  );
}
