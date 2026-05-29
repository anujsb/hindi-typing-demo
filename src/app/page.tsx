"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { INSCRIPT_NORMAL, INSCRIPT_SHIFT, REMINGTON_NORMAL, REMINGTON_SHIFT, FINGER_COLORS } from "../utils/keyboardMaps";

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
  const [layout, setLayout] = useState<"inscript" | "remington">("inscript");
  const [text, setText] = useState<string>("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeKeyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter((w) => w.length > 0).length : 0;

  // Derive active mapping
  const normalMap = layout === "inscript" ? INSCRIPT_NORMAL : REMINGTON_NORMAL;
  const shiftMap = layout === "inscript" ? INSCRIPT_SHIFT : REMINGTON_SHIFT;

  const fixRemingtonCombinations = (str: string) => {
    let prevText = "";
    while (prevText !== str) {
      prevText = str;
      // 1. Fix 'ि' typed before consonant
      str = str.replace(/ि([क-ह](?:्[क-ह])*)/g, '$1ि');
    }

    // 2. Vowel formations
    str = str.replace(/अा/g, 'आ');
    str = str.replace(/ाे/g, 'ो');
    str = str.replace(/ाै/g, 'ौ');
    str = str.replace(/अो/g, 'ओ');
    str = str.replace(/अौ/g, 'औ');
    str = str.replace(/आे/g, 'ओ');
    str = str.replace(/आै/g, 'औ');

    // 3. Candra + Anusvara -> Chandrabindu
    str = str.replace(/ॅं/g, 'ँ');
    // If candra combined with base letter first, fix it when anusvara is added
    str = str.replace(/ऑं/g, 'आँ');
    str = str.replace(/ॉं/g, 'ाँ');
    str = str.replace(/ॲं/g, 'अँ');
    str = str.replace(/ऍं/g, 'एँ');

    // 4. Base letter + candra -> unified character
    str = str.replace(/आॅ/g, 'ऑ');
    str = str.replace(/अॅ/g, 'ॲ');
    str = str.replace(/एॅ/g, 'ऍ');
    str = str.replace(/ाॅ/g, 'ॉ');

    // 5. Fix Reph (र्) - typed AFTER the consonant in Remington
    str = str.replace(/([क-ह](?:्[क-ह])*)([ा-ौंःँ]*)(र्)/g, '$3$1$2');
    
    return str;
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Shift") return;
      if (e.key === "Backspace" || e.key === "Enter" || e.key === "Tab") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;
      const lowerKey = key.toLowerCase();
      
      const mapped = e.shiftKey ? shiftMap[e.key] || shiftMap[e.key.toUpperCase()] : normalMap[lowerKey];

      if (mapped !== undefined) {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;

        const start = ta.selectionStart ?? 0;
        const end = ta.selectionEnd ?? 0;
        const newTextUnfixed = text.slice(0, start) + mapped + text.slice(end);
        
        // Apply combination fixes only for Remington layout
        const newTextFixed = layout === "remington" ? fixRemingtonCombinations(newTextUnfixed) : newTextUnfixed;
        
        setText(newTextFixed);

        const lengthDiff = newTextFixed.length - newTextUnfixed.length;

        requestAnimationFrame(() => {
          if (ta) {
            const newCursor = start + mapped.length + lengthDiff;
            ta.selectionStart = newCursor;
            ta.selectionEnd = newCursor;
          }
        });

        setActiveKey(lowerKey);
        if (activeKeyTimeout.current) clearTimeout(activeKeyTimeout.current);
        activeKeyTimeout.current = setTimeout(() => setActiveKey(null), 150);
      }
    },
    [text, normalMap, shiftMap]
  );

  const handleClear = () => {
    setText("");
    textareaRef.current?.focus();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
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

  // Generate dynamic key rows based on layout
  const KEY_ROWS: RowDef[] = ENGLISH_ROWS.map(r => ({
    row: r.row,
    keys: r.keys.map(k => ({
      key: k,
      normal: normalMap[k] || k,
      // Shift keys are generally uppercase variants of letters, but symbols stay the same key representation
      shift: shiftMap[k.toUpperCase()] || shiftMap[k] || k
    }))
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #faf7f2;
          min-height: 100vh;
        }

        .root {
          min-height: 100vh;
          background: #faf7f2;
          font-family: 'Libre Baskerville', Georgia, serif;
          color: #1c1810;
          padding: 40px 20px 60px;
        }

        /* — Header — */
        .header { text-align: center; margin-bottom: 24px; }
        .header-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #a0896a;
          margin-bottom: 10px;
        }
        .header-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #1c1810;
          line-height: 1.1;
          font-family: 'Libre Baskerville', serif;
        }
        .header-subtitle {
          margin-top: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #a0896a;
          letter-spacing: 0.08em;
        }
        .header-rule {
          width: 48px;
          height: 2px;
          background: #c9a96e;
          margin: 16px auto 0;
          border-radius: 2px;
        }

        /* — Layout Selector — */
        .layout-selector {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }
        .layout-select {
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          color: #1c1810;
          background: #fff;
          border: 1px solid #e8dcc8;
          padding: 8px 32px 8px 16px;
          border-radius: 8px;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a0896a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 12px top 50%;
          background-size: 10px auto;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: border-color 0.2s;
        }
        .layout-select:focus, .layout-select:hover {
          border-color: #c9a96e;
        }

        /* — Stats — */
        .stats {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 28px;
        }
        .stat-pill {
          background: #fff;
          border: 1px solid #e8dcc8;
          border-radius: 40px;
          padding: 8px 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .stat-value {
          font-family: 'DM Mono', monospace;
          font-size: 1.2rem;
          font-weight: 500;
          color: #1c1810;
        }
        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #a0896a;
        }
        .stat-sep { width: 1px; height: 18px; background: #e8dcc8; }

        /* — Editor — */
        .editor-wrap {
          max-width: 680px;
          margin: 0 auto 32px;
        }
        .editor-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #a0896a;
          margin-bottom: 8px;
        }
        .textarea {
          width: 100%;
          min-height: 148px;
          background: #fff;
          border: 1.5px solid #e0d3bc;
          border-radius: 12px;
          color: #1c1810;
          font-size: 1.5rem;
          font-family: 'Mangal', 'Noto Sans Devanagari', 'Arial Unicode MS', serif;
          line-height: 1.75;
          padding: 18px 20px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          caret-color: #c9a96e;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .textarea::placeholder { color: #cbbfa8; }
        .textarea:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.15), 0 2px 8px rgba(0,0,0,0.04);
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
        .btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 9px 20px;
          border-radius: 8px;
          border: 1.5px solid transparent;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.18s;
        }
        .btn-primary {
          background: #1c1810;
          color: #faf7f2;
          border-color: #1c1810;
        }
        .btn-primary:hover { background: #332b1e; }
        .btn-ghost {
          background: transparent;
          color: #a0896a;
          border-color: #e0d3bc;
        }
        .btn-ghost:hover { background: #f5ede0; border-color: #c9a96e; color: #7a6344; }
        .btn-success {
          background: #d4edda;
          color: #1a5c2d;
          border-color: #a8d5b5;
        }

        /* — Keyboard — */
        .keyboard-wrap {
          max-width: 800px;
          margin: 0 auto;
        }
        .keyboard-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #a0896a;
          text-align: center;
          margin-bottom: 14px;
        }
        .keyboard-surface {
          background: #fff;
          border: 1px solid #e8dcc8;
          border-radius: 16px;
          padding: 18px 16px 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
        }
        .key-row {
          display: flex;
          gap: 4px;
          justify-content: center;
          margin-bottom: 4px;
        }
        .key {
          width: 52px;
          height: 50px;
          background: #faf7f2;
          border: 1px solid #e0d3bc;
          border-bottom: 3px solid #d4c4a8;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: default;
          transition: all 0.1s;
          position: relative;
          flex-shrink: 0;
          user-select: none;
        }
        .key.active {
          transform: translateY(2px);
          border-bottom-width: 1px;
        }
        .key-shift-char {
          position: absolute;
          top: 3px;
          right: 5px;
          font-size: 0.55rem;
          color: #b0a08a;
          font-family: 'Noto Sans Devanagari', serif;
          line-height: 1;
        }
        .key-main-char {
          font-size: 1rem;
          font-family: 'Mangal', 'Noto Sans Devanagari', serif;
          line-height: 1;
          color: #2d2418;
        }
        .key-eng {
          font-family: 'DM Mono', monospace;
          font-size: 0.5rem;
          color: #b0a08a;
          text-transform: uppercase;
          margin-top: 2px;
          letter-spacing: 0.04em;
        }

        /* Space row */
        .space-row {
          display: flex;
          gap: 4px;
          justify-content: center;
          margin-top: 4px;
        }
        .key-special {
          height: 38px;
          background: #f0e9dc;
          border: 1px solid #e0d3bc;
          border-bottom: 3px solid #d4c4a8;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: #a0896a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          flex-shrink: 0;
          user-select: none;
        }

        /* — Quick Ref — */
        .quickref-wrap {
          max-width: 680px;
          margin: 24px auto 0;
          background: #fff;
          border: 1px solid #e8dcc8;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .quickref-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #a0896a;
          margin-bottom: 12px;
        }
        .quickref-items {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .quickref-item {
          background: #faf7f2;
          border: 1px solid #e8dcc8;
          border-radius: 6px;
          padding: 5px 12px;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.8rem;
        }
        .quickref-key {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #7a6344;
          background: #f0e9dc;
          padding: 1px 6px;
          border-radius: 3px;
          border: 1px solid #e0d3bc;
        }
        .quickref-arrow { color: #c9b99a; font-size: 0.7rem; }
        .quickref-hindi {
          font-family: 'Noto Sans Devanagari', serif;
          color: #1c1810;
        }

        .footer-note {
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: #c9b99a;
          margin-top: 28px;
          letter-spacing: 0.1em;
        }

        @media (max-width: 600px) {
          .key { width: 30px; height: 42px; }
          .key-main-char { font-size: 0.8rem; }
          .key-shift-char { font-size: 0.45rem; }
          .key-eng { font-size: 0.42rem; }
        }
      `}</style>

      <div className="root">
        {/* Header */}
        <header className="header">
          <p className="header-eyebrow">Unicode · Keyboard Settings</p>
          <h1 className="header-title">मंगल हिंदी टाइपिंग</h1>
          <p className="header-subtitle">Select Layout & Start Typing</p>
          <div className="header-rule" />
        </header>

        {/* Layout Selector */}
        <div className="layout-selector">
          <select 
            className="layout-select" 
            value={layout} 
            onChange={(e) => {
              setLayout(e.target.value as "inscript" | "remington");
              textareaRef.current?.focus();
            }}
          >
            <option value="inscript">Inscript Layout (Standard)</option>
            <option value="remington">Remington Gail Layout</option>
          </select>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-pill">
            <span className="stat-value">{charCount}</span>
            <div className="stat-sep" />
            <span className="stat-label">Characters</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{wordCount}</span>
            <div className="stat-sep" />
            <span className="stat-label">Words</span>
          </div>
        </div>

        {/* Editor */}
        <div className="editor-wrap">
          <p className="editor-label">Type below · यहाँ टाइप करें</p>
          <textarea
            ref={textareaRef}
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`यहाँ टाइप करें… (${layout === "inscript" ? "Inscript" : "Remington Gail"} layout)`}
            autoFocus
            spellCheck={false}
          />
          <div className="actions">
            <button
              className={`btn ${copied ? "btn-success" : "btn-primary"}`}
              onClick={handleCopy}
            >
              {copied ? "✓ Copied!" : "Copy Text"}
            </button>
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Keyboard */}
        <div className="keyboard-wrap">
          <p className="keyboard-section-label">Virtual Keyboard Reference</p>
          <div className="keyboard-surface">
            {KEY_ROWS.map(({ row, keys }) => (
              <div
                key={row}
                className="key-row"
                style={{ paddingLeft: rowPadding[row] ?? "0px" }}
              >
                {keys.map(({ key, normal, shift }) => {
                  const isActive = activeKey === key.toLowerCase();
                  const fingerColor = FINGER_COLORS[key.toLowerCase()] ?? "#888";
                  return (
                    <div
                      key={key}
                      className={`key${isActive ? " active" : ""}`}
                      style={{
                        background: isActive ? `${fingerColor}18` : undefined,
                        borderColor: isActive ? fingerColor : undefined,
                        borderBottomColor: isActive ? fingerColor : undefined,
                        boxShadow: isActive ? `0 0 0 2px ${fingerColor}30` : undefined,
                      }}
                    >
                      {shift !== normal && (
                        <span className="key-shift-char">{shift}</span>
                      )}
                      <span
                        className="key-main-char"
                        style={{ color: isActive ? fingerColor : undefined }}
                      >
                        {normal}
                      </span>
                      <span className="key-eng">{key}</span>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Space row */}
            <div className="space-row">
              <div className="key-special" style={{ width: 64 }}>Shift</div>
              <div className="key-special" style={{ width: 280, background: "#f5f0e8", color: "#7a6344" }}>
                Space — स्पेस
              </div>
              <div className="key-special" style={{ width: 64 }}>Shift</div>
            </div>
          </div>
        </div>

        {/* Quick Ref */}
        <div className="quickref-wrap">
          <p className="quickref-label">Quick Reference (Inscript)</p>
          <div className="quickref-items">
            {QUICK_REF.map(({ key, hindi }) => (
              <div key={key} className="quickref-item">
                <span className="quickref-key">{key}</span>
                <span className="quickref-arrow">→</span>
                <span className="quickref-hindi">{hindi}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="footer-note">
          Click the text area · Start typing · Mangal Unicode
        </p>
      </div>
    </>
  );
}