import { useState, useEffect } from "react";
import { Code2, Play, RotateCcw, Copy, Loader2 } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { materialDark } from "@uiw/codemirror-theme-material";
import { javascript } from "@codemirror/lang-javascript";

const programmingLangs = [
  "C++",
  "C#",
  "Python",
  "Java",
  "Go",
  "Rust",
  "JavaScript",
  "TypeScript",
];

const App = () => {
  const [isAiReady, setIsAiReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("Python");
  const [inputCode, setInputCode] = useState(
    `function helloWorld() {\n console.log("Hello World!); \n}`,
  );
  const [outputCode, setOutputCode] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkAi = setInterval(() => {
      if (window.puter?.ai?.chat) {
        setIsAiReady(true);
        console.log("AI is Ready");
        clearInterval(checkAi);
      }
    }, 300);

    return () => clearInterval(checkAi);
  }, []);

  // Convert Function
  const handleConvert = async () => {
    if (!inputCode.trim()) {
      console.log("Please enter a code to convert.");
      return;
    }

    if (!isAiReady) {
      console.log("AI is not ready yet. try again later.");
      return;
    }

    setLoading(true);
    setOutputCode("");

    try {
      const res = await window.puter.ai.chat(`
        Return ONLY raw ${targetLanguage} source code.
        - No backticks
        - No markdown
        - No surrounding commentary
        Code to convert:
        ${inputCode}
      `);

      const result =
        typeof res === "string"
          ? res
          : res?.message?.content ||
            res?.message?.map((message) => message.content).join("\n") ||
            "";

      if (!result.trim()) throw new Error("No response from AI");
      setOutputCode(result.trim());
      setLoading(false);
    } catch (err) {
      console.error("Conversion failed... ", err);
    }
  };

  // Reset Function
  const handleReset = () => {
    setOutputCode("");
    setInputCode(`function helloWorld() {\n console.log("Hello World!); \n}`);
  };

  // Output Copy Function
  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputCode);
    console.log("Output Copied!");

    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 px-4 py-8 lg:justify-center lg:py-0">
      <h1 className="font-pp mb-3 text-5xl font-bold text-white drop-shadow-lg">
        AI Code Converter
      </h1>

      <p className="font-pp my-3 max-w-2xl gap-3 rounded-xl bg-gray-500/20 p-6 text-center text-lg leading-relaxed text-white shadow-lg">
        <span className="border-b-2 border-white/20 pb-1.5">
          Instantly convert code between programming languages using AI.
        </span>
        <br />
        <span className="mt-2 block">
          Paste your code, select the target language, and get accurate,
          readable results in seconds.
        </span>
      </p>

      {/* Buttons */}
      <div className="mt-2 flex items-center gap-5">
        {/* Languages Selector */}
        <select
          className="backdrop-blue-md cursor-pointer rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white shadow-lg"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {programmingLangs.map((language) => (
            <option value={language} key={language}>
              {language}
            </option>
          ))}
        </select>

        {/* Convert button */}
        <button
          className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-400 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:opacity-80 active:scale-95"
          onClick={handleConvert}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Play className="h-5 w-5" />
          )}

          {loading ? "Converting..." : "Convert"}
        </button>

        {/* Reset button */}
        <button
          className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:opacity-80 active:scale-95"
          onClick={handleReset}
        >
          <RotateCcw size="16" />
          Reset
        </button>
      </div>

      {/* Code input / output */}
      <div className="z-10 mt-5 grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input */}
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 shadow-2xl backdrop-blur-md">
          <div className="font-pp flex items-center gap-2 border-b border-slate-700 bg-slate-800/80 px-4 py-3 text-white">
            <Code2 color="lightgreen" className="h-5 w-5" />
            <span className="font-semibold">Input Code</span>
          </div>

          <CodeMirror
            value={inputCode}
            onChange={(value) => setInputCode(value)}
            height="420px"
            theme={materialDark}
            extensions={[javascript({ jsx: true })]}
          />
        </div>

        {/* Output */}
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 shadow-2xl backdrop-blur-md">
          <div className="font-pp flex items-center justify-between border-b border-slate-700 bg-slate-800/80 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Code2 color="lightgreen" className="h-5 w-5" />
              <span className="font-semibold">
                Output Code: {targetLanguage}
              </span>
            </div>
            <button
              className="cursor-pointer transition-all hover:text-white/50 active:scale-95"
              onClick={handleCopy}
            >
              <Copy />
            </button>
          </div>

          <CodeMirror
            value={outputCode}
            editable={false}
            height="420px"
            theme={materialDark}
            extensions={[javascript({ jsx: true })]}
          />
        </div>

        {/* Copy Notification (Pop-up) - REVISED FOR SMOOTH TRANSITION */}
        <div
          className={`fixed top-10 right-10 z-50 transform rounded-full bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-2xl transition-all duration-300 ease-in-out ${showNotification ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-10 opacity-0"} `}
        >
          Output Copied!
        </div>
      </div>
    </div>
  );
};

export default App;
