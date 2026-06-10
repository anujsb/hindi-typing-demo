"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getLayout } from "@/layouts";
import { FINGER_COLORS } from "@/layouts/types";
import { saveExerciseProgress } from "@/actions/practice";
import { markVideoCompleted } from "@/actions/learning";

interface KeyDef {
  key: string;
  normal: string;
  shift: string;
}

interface RowDef {
  row: string;
  keys: KeyDef[];
}

const ENGLISH_ROWS = [
  { row: "number", keys: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="] },
  { row: "top", keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"] },
  { row: "home", keys: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"] },
  { row: "bottom", keys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"] }
];

const QUICK_REF = [
  { key: "D", hindi: "अ" }, { key: "F", hindi: "इ" }, { key: "E", hindi: "आ" },
  { key: "R", hindi: "ई" }, { key: "K", hindi: "क" }, { key: "j", hindi: "र" },
  { key: "l", hindi: "त" }, { key: "d", hindi: "् हलन्त" }, { key: "x", hindi: "ं अनु." },
];

export interface TypingEngineProps {
  targetId: string;
  targetContent: string;
  isTrial: boolean;
  layoutName: string;
  language: string;
  mode: "LEARNING" | "PRACTICE";
  onLearningCompletePath?: string;
}

export default function TypingEngine({ targetId, targetContent, isTrial, layoutName, language, mode, onLearningCompletePath }: TypingEngineProps) {
  const router = useRouter();
  
  const [layoutId, setLayoutId] = useState<string>(
    layoutName === "RAMINTON_GAIL" ? "remington" : 
    layoutName === "KURTIDEV_010" ? "krutidev" : 
    layoutName === "ENGLISH" ? "english" : "inscript"
  );
  
  const [text, setText] = useState<string>("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeKeyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const altBuffer = useRef<string>("");

  const [timeLeft, setTimeLeft] = useState<number>(isTrial ? 120 : 0); // 2 mins for trial, 0 means unlimited
  const [isFinished, setIsFinished] = useState(false);
  const [savedStats, setSavedStats] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentLayout = getLayout(layoutId);
  const normalMap = currentLayout.normalMap;
  const shiftMap = currentLayout.shiftMap;
  const processor = currentLayout.processor;
  const altCodeMap = currentLayout.altCodeMap;

  // Derived stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter((w) => w.length > 0).length : 0;

  // Timer
  useEffect(() => {
    if (!isFinished && text.length > 0) {
      const timerId = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        if (isTrial) {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsFinished(true);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [isFinished, isTrial, text.length]);

  // Completion Detection
  useEffect(() => {
    if ((isFinished || text === targetContent) && !savedStats && text.length > 0) {
      setSavedStats(true);
      setIsFinished(true);
      const timeTakenSec = elapsedSeconds || 1; 
      
      const words = text.trim().split(/\s+/).length;
      const wpm = (words / (timeTakenSec / 60));
      
      let correctChars = 0;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === targetContent[i]) correctChars++;
      }
      const accuracy = (correctChars / Math.max(text.length, 1)) * 100;

      if (mode === "PRACTICE") {
        saveExerciseProgress({
          exerciseId: targetId,
          wpm: wpm || 0,
          accuracy: accuracy || 0,
          timeTaken: timeTakenSec
        });
      } else {
        markVideoCompleted(targetId).then(() => {
          if (onLearningCompletePath) {
            router.push(onLearningCompletePath);
          }
        });
      }
    }
  }, [isFinished, text, targetContent, savedStats, elapsedSeconds, isTrial, targetId, mode, router, onLearningCompletePath]);

  const insertTextAtCursor = useCallback((textToInsert: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const newTextUnfixed = text.slice(0, start) + textToInsert + text.slice(end);
    const newTextFixed = processor ? processor(newTextUnfixed) : newTextUnfixed;
    setText(newTextFixed);
    requestAnimationFrame(() => {
      if (ta) {
        const newCursor = start + textToInsert.length + (newTextFixed.length - newTextUnfixed.length);
        ta.selectionStart = newCursor;
        ta.selectionEnd = newCursor;
        ta.focus();
      }
    });
  }, [text, processor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isFinished) return;
      if (e.key === "Shift") return;
      if (e.key === "Backspace" || e.key === "Enter" || e.key === "Tab") return;
      
      if (e.key === "Alt") {
        altBuffer.current = "";
        return;
      }
      
      if (e.altKey) {
        const digitMatch = e.code.match(/Numpad(\d)/) || e.key.match(/^(\d)$/);
        if (digitMatch) {
          altBuffer.current += digitMatch[1];
          e.preventDefault();
        }
        return;
      }
      
      if (e.ctrlKey || e.metaKey) return;

      const key = e.key;
      const lowerKey = key.toLowerCase();
      
      const mapped = e.shiftKey ? shiftMap[e.key] || shiftMap[e.key.toUpperCase()] : normalMap[lowerKey];

      if (mapped !== undefined) {
        e.preventDefault();
        insertTextAtCursor(mapped);
        
        setActiveKey(lowerKey);
        if (activeKeyTimeout.current) clearTimeout(activeKeyTimeout.current);
        activeKeyTimeout.current = setTimeout(() => setActiveKey(null), 150);
      }
    },
    [normalMap, shiftMap, insertTextAtCursor, isFinished]
  );

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    if (e.key === "Alt" && altBuffer.current.length > 0) {
      if (altCodeMap) {
        const mapped = altCodeMap[altBuffer.current];
        if (mapped) {
          insertTextAtCursor(mapped);
        }
      }
      altBuffer.current = "";
    }
  }, [altCodeMap, insertTextAtCursor, isFinished]);

  const handleClear = () => {
    if (isFinished) return;
    setText("");
    textareaRef.current?.focus();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text.replace(/\uE000/g, 'ि'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (activeKeyTimeout.current) clearTimeout(activeKeyTimeout.current);
    };
  }, []);

  const rowPadding: Record<string, string> = {
    number: "0px",
    top: "0px",
    home: "18px",
    bottom: "38px",
  };

  const US_SHIFT_MAP: Record<string, string> = {
    "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+",
    "[": "{", "]": "}", "\\": "|", ";": ":", "'": "\"", ",": "<", ".": ">", "/": "?"
  };

  const KEY_ROWS: RowDef[] = ENGLISH_ROWS.map(r => ({
    row: r.row,
    keys: r.keys.map(k => {
      const shiftKey = US_SHIFT_MAP[k] || k.toUpperCase();
      return {
        key: k,
        normal: normalMap[k] || k,
        shift: shiftMap[shiftKey] || shiftMap[k.toUpperCase()] || shiftMap[k] || shiftKey
      };
    })
  }));

  return (
    <div className="bg-[#faf7f2] px-5 sm:px-8 py-10 min-h-screen font-[Georgia,serif] text-[#1c1810]">
      {/* Header */}
      <header className="mb-6 text-center">
        <p className="mb-2.5 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">
          {mode === "LEARNING" ? "Learning Module Practice Test" : "Practice Session"}
        </p>
        <h1 className="font-serif font-bold text-[#1c1810] md:text-[3.2rem] text-3xl sm:text-4xl leading-tight tracking-tight">हिंदी टाइपिंग</h1>
        <div className="bg-[#c9a96e] mx-auto mt-4 rounded-sm w-12 h-0.5" />
      </header>

      {/* Stats */}
      <div className="flex justify-center gap-3 mb-7">
        <div className="flex items-center gap-2.5 bg-white shadow-sm px-5 py-2 border border-[#e8dcc8] rounded-full">
          <span className="font-mono font-medium text-[#1c1810] text-lg">{charCount}</span>
          <div className="bg-[#e8dcc8] w-[1px] h-[18px]" />
          <span className="font-mono text-[#a0896a] text-[0.65rem] uppercase tracking-[0.14em]">Characters</span>
        </div>
        <div className="flex items-center gap-2.5 bg-white shadow-sm px-5 py-2 border border-[#e8dcc8] rounded-full">
          <span className="font-mono font-medium text-[#1c1810] text-lg">{wordCount}</span>
          <div className="bg-[#e8dcc8] w-[1px] h-[18px]" />
          <span className="font-mono text-[#a0896a] text-[0.65rem] uppercase tracking-[0.14em]">Words</span>
        </div>
        {isTrial && (
          <div className="flex items-center gap-2.5 bg-white shadow-sm px-5 py-2 border border-red-200 rounded-full">
            <span className="font-mono font-medium text-red-600 text-lg">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
            <div className="bg-red-200 w-[1px] h-[18px]" />
            <span className="font-mono text-red-400 text-[0.65rem] uppercase tracking-[0.14em]">Time Left</span>
          </div>
        )}
      </div>

      {/* Target Content */}
      <div className="mx-auto mb-4 max-w-[680px]">
         <div className="p-4 bg-white shadow-sm border border-[#e8dcc8] rounded-xl text-xl leading-relaxed text-[#5a4a35] select-none font-[Georgia,serif]">
           {targetContent}
         </div>
      </div>

      {/* Editor */}
      <div className="mx-auto mb-8 max-w-[680px]">
        {savedStats && (
           <div className="mb-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-center">
              Practice Completed! Your progress has been saved.
           </div>
        )}
        <textarea
          ref={textareaRef}
          disabled={isFinished}
          className="bg-white shadow-sm p-4 sm:p-5 border-[#e0d3bc] border-[1.5px] focus:border-[#c9a96e] rounded-xl outline-none focus:ring-[#c9a96e26] focus:ring-[3px] w-full min-h-[148px] text-[#1c1810] text-2xl sm:text-3xl leading-relaxed transition-all resize-y disabled:opacity-50"
          value={text.replace(/\uE000/g, 'ि')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder={`यहाँ टाइप करें… (${currentLayout.name})`}
          autoFocus
          spellCheck={false}
          style={{ 
            caretColor: '#c9a96e',
            fontFamily: currentLayout.fontType === 'legacy' ? '"Kruti Dev 010", sans-serif' : '"Arial Unicode MS", sans-serif'
          }}
        />
        <div className="flex gap-2.5 mt-3">
          <button 
            className="bg-transparent hover:bg-[#f5ede0] px-5 py-2 border-[#e0d3bc] border-[1.5px] hover:border-[#c9a96e] rounded-lg font-mono font-medium text-[#a0896a] hover:text-[#7a6344] text-xs uppercase tracking-wider transition-all disabled:opacity-50" 
            onClick={handleClear}
            disabled={isFinished}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Keyboard */}
      <div className="mx-auto max-w-[800px]">
        <p className="mb-3.5 font-mono text-[#a0896a] text-[0.65rem] text-center uppercase tracking-[0.16em]">Virtual Keyboard Reference</p>
        <div className="bg-white shadow-md p-4 sm:p-5 pb-4 border border-[#e8dcc8] rounded-2xl opacity-90 hover:opacity-100 transition-opacity">
          {KEY_ROWS.map(({ row, keys }) => (
            <div
              key={row}
              className="flex justify-center gap-1 mb-1"
              style={{ paddingLeft: rowPadding[row] ?? "0px" }}
            >
              {keys.map(({ key, normal, shift }) => {
                const isActive = activeKey === key.toLowerCase();
                const fingerColor = FINGER_COLORS[key.toLowerCase()] ?? "#888";
                return (
                  <div
                    key={key}
                    className={`w-[30px] h-[42px] sm:w-[52px] sm:h-[50px] bg-[#faf7f2] border border-[#e0d3bc] border-b-[3px] border-b-[#d4c4a8] rounded-md flex flex-col items-center justify-center cursor-default transition-all relative shrink-0 select-none ${isActive ? 'translate-y-[2px] !border-b-[1px]' : ''}`}
                    style={{
                      background: isActive ? `${fingerColor}18` : undefined,
                      borderColor: isActive ? fingerColor : undefined,
                      borderBottomColor: isActive ? fingerColor : undefined,
                      boxShadow: isActive ? `0 0 0 2px ${fingerColor}30` : undefined,
                    }}
                  >
                    {shift !== normal && (
                      <span 
                        className="top-[3px] right-[5px] absolute text-[#b0a08a] text-[0.45rem] sm:text-[0.55rem] leading-none"
                        style={{ fontFamily: currentLayout.fontType === 'legacy' ? '"Kruti Dev 010", sans-serif' : '"Arial Unicode MS", sans-serif' }}
                      >
                        {shift}
                      </span>
                    )}
                    <span
                      className="text-[#2d2418] text-[0.8rem] sm:text-base leading-none"
                      style={{ 
                        color: isActive ? fingerColor : undefined,
                        fontFamily: currentLayout.fontType === 'legacy' ? '"Kruti Dev 010", sans-serif' : '"Arial Unicode MS", sans-serif'
                      }}
                    >
                      {normal}
                    </span>
                    <span className="mt-0.5 font-mono text-[#b0a08a] text-[0.42rem] sm:text-[0.5rem] uppercase tracking-wider">{key}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Space row */}
          <div className="flex justify-center gap-1 mt-1">
            <div className="flex justify-center items-center bg-[#f0e9dc] border border-[#e0d3bc] border-b-[#d4c4a8] border-b-[3px] rounded-md w-16 h-[38px] font-mono text-[#a0896a] text-[0.6rem] uppercase tracking-wider select-none shrink-0">Shift</div>
            <div className="flex justify-center items-center bg-[#f5f0e8] border border-[#e0d3bc] border-b-[#d4c4a8] border-b-[3px] rounded-md w-[200px] sm:w-[280px] h-[38px] font-mono text-[#7a6344] text-[0.6rem] uppercase tracking-wider select-none shrink-0">
              Space — स्पेस
            </div>
            <div className="flex justify-center items-center bg-[#f0e9dc] border border-[#e0d3bc] border-b-[#d4c4a8] border-b-[3px] rounded-md w-16 h-[38px] font-mono text-[#a0896a] text-[0.6rem] uppercase tracking-wider select-none shrink-0">Shift</div>
          </div>
        </div>
      </div>
    </div>
  );
}