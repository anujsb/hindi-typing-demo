"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getLayout } from "../../layouts";
import { FINGER_COLORS } from "../../layouts/types";

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

export default function MangalTypingApp() {
  const [layoutId, setLayoutId] = useState<string>("inscript");
  const [text, setText] = useState<string>("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeKeyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const altBuffer = useRef<string>("");

  const currentLayout = getLayout(layoutId);
  const normalMap = currentLayout.normalMap;
  const shiftMap = currentLayout.shiftMap;
  const processor = currentLayout.processor;
  const altCodeMap = currentLayout.altCodeMap;

  // Derived stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter((w) => w.length > 0).length : 0;

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
    [normalMap, shiftMap, insertTextAtCursor]
  );

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Alt" && altBuffer.current.length > 0) {
      if (altCodeMap) {
        const mapped = altCodeMap[altBuffer.current];
        if (mapped) {
          insertTextAtCursor(mapped);
        }
      }
      altBuffer.current = "";
    }
  }, [altCodeMap, insertTextAtCursor]);

  const handleClear = () => {
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

  // Generate dynamic key rows based on layout
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
        <p className="mb-2.5 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">Unicode · Keyboard Settings</p>
        <h1 className="font-serif font-bold text-[#1c1810] md:text-[3.2rem] text-3xl sm:text-4xl leading-tight tracking-tight">मंगल हिंदी टाइपिंग</h1>
        <p className="mt-2 font-mono text-[#a0896a] text-[0.75rem] tracking-wider">Select Layout & Start Typing</p>
        <div className="bg-[#c9a96e] mx-auto mt-4 rounded-sm w-12 h-0.5" />
      </header>

      {/* Layout Selector */}
      <div className="flex justify-center mb-8">
        <select 
          className="bg-[position:right_12px_top_50%] bg-[size:10px_auto] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a0896a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-white bg-no-repeat shadow-sm py-2 pr-8 pl-4 border border-[#e8dcc8] hover:border-[#c9a96e] focus:border-[#c9a96e] rounded-lg outline-none font-mono text-[#1c1810] text-sm transition-colors appearance-none cursor-pointer"
          value={layoutId} 
          onChange={(e) => {
            setLayoutId(e.target.value);
            textareaRef.current?.focus();
          }}
        >
          <option value="inscript">Inscript Layout (Standard)</option>
          <option value="remington">Remington Gail Layout</option>
          <option value="krutidev">Kruti Dev 010 Layout</option>
          <option value="english">English (Standard)</option>
        </select>
      </div>

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
      </div>

      {/* Editor */}
      <div className="mx-auto mb-8 max-w-[680px]">
        <p className="mb-2 font-mono text-[#a0896a] text-[0.65rem] uppercase tracking-[0.16em]">Type below · यहाँ टाइप करें</p>
        <textarea
          ref={textareaRef}
          className="bg-white shadow-sm p-4 sm:p-5 border-[#e0d3bc] border-[1.5px] focus:border-[#c9a96e] rounded-xl outline-none focus:ring-[#c9a96e26] focus:ring-[3px] w-full min-h-[148px] text-[#1c1810] text-2xl sm:text-3xl leading-relaxed transition-all resize-y"
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
            className={`font-mono text-xs tracking-wider uppercase py-2 px-5 rounded-lg border-[1.5px] font-medium transition-all ${
              copied 
                ? "bg-[#d4edda] text-[#1a5c2d] border-[#a8d5b5]" 
                : "bg-[#1c1810] text-[#faf7f2] border-[#1c1810] hover:bg-[#332b1e]"
            }`}
            onClick={handleCopy}
          >
            {copied ? "✓ Copied!" : "Copy Text"}
          </button>
          <button 
            className="bg-transparent hover:bg-[#f5ede0] px-5 py-2 border-[#e0d3bc] border-[1.5px] hover:border-[#c9a96e] rounded-lg font-mono font-medium text-[#a0896a] hover:text-[#7a6344] text-xs uppercase tracking-wider transition-all" 
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Keyboard */}
      <div className="mx-auto max-w-[800px]">
        <p className="mb-3.5 font-mono text-[#a0896a] text-[0.65rem] text-center uppercase tracking-[0.16em]">Virtual Keyboard Reference</p>
        <div className="bg-white shadow-md p-4 sm:p-5 pb-4 border border-[#e8dcc8] rounded-2xl">
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

      {/* Quick Ref */}
      {layoutId === "inscript" && (
        <div className="bg-white shadow-sm mx-auto mt-6 p-4 sm:px-5 border border-[#e8dcc8] rounded-xl max-w-[680px]">
          <p className="mb-3 font-mono text-[#a0896a] text-[0.65rem] uppercase tracking-[0.16em]">Quick Reference (Inscript)</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_REF.map(({ key, hindi }) => (
              <div key={key} className="flex items-center gap-1.5 bg-[#faf7f2] px-3 py-1 border border-[#e8dcc8] rounded-md text-sm">
                <span className="bg-[#f0e9dc] px-1.5 py-[1px] border border-[#e0d3bc] rounded-[3px] font-mono text-[#7a6344] text-xs">{key}</span>
                <span className="text-[#c9b99a] text-[0.7rem]">→</span>
                <span className="font-sans text-[#1c1810]">{hindi}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alt Codes Ref */}
      {altCodeMap && Object.keys(altCodeMap).length > 0 && (
        <div className="bg-white shadow-sm mx-auto mt-6 p-4 sm:px-5 border border-[#e8dcc8] rounded-xl max-w-[800px]">
          <p className="mb-3 font-mono text-[#a0896a] text-[0.65rem] uppercase tracking-[0.16em]">Special Characters (Alt Codes)</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(altCodeMap).map(([code, char]) => (
              <button 
                key={code} 
                className="flex flex-col justify-center items-center gap-1.5 bg-[#faf7f2] hover:bg-[#f0e9dc] px-3 py-2 border border-[#e8dcc8] hover:border-[#c9a96e] focus:border-[#c9a96e] rounded-md outline-none focus:ring-[#c9a96e26] focus:ring-[2px] transition-all"
                onClick={() => insertTextAtCursor(char)}
                title={`Hold Alt and type ${code} on Numpad`}
              >
                <span 
                  className="text-[#1c1810] text-2xl leading-none" 
                  style={{ fontFamily: currentLayout.fontType === 'legacy' ? '"Kruti Dev 010", sans-serif' : '"Arial Unicode MS", sans-serif' }}
                >
                  {char}
                </span>
                <span className="font-mono text-[#a0896a] text-[0.55rem]">Alt+{code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-7 font-mono text-[#c9b99a] text-[0.65rem] text-center tracking-[0.1em]">
        Click the text area · Start typing · Mangal Unicode
      </p>
    </div>
  );
}