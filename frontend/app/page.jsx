"use client";

import React, { useState, useRef } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const suggestions = [
  { word: "erroor", suggestion: "error" },
  { word: "progrmación", suggestion: "programación" },
  { word: "funcón", suggestion: "función" },
];

// Decorador para resaltar palabras mal escritas
const findWrongWords = (contentBlock, callback) => {
  const text = contentBlock.getText();
  suggestions.forEach(({ word }) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    let match;
    while ((match = regex.exec(text)) !== null) {
      callback(match.index, match.index + word.length);
    }
  });
};

// Componente para mostrar palabras resaltadas
const WrongWord = ({ children }) => (
  <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>
    {children}
  </span>
);

const decorator = new CompositeDecorator([
  {
    strategy: findWrongWords,
    component: WrongWord,
  },
]);

export default function Page() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromText(""), decorator)
  );
  const [suggestionBox, setSuggestionBox] = useState(null);
  const editorRef = useRef(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleWordClick = (e) => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const start = selection.getStartOffset();
      const end = selection.getEndOffset();
      const selectedText = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getText()
        .slice(start, end);

      const match = suggestions.find((s) => s.word === selectedText);
      if (match) {
        const rect = e.target.getBoundingClientRect();
        setSuggestionBox({
          x: rect.left,
          y: rect.bottom + window.scrollY,
          word: selectedText,
          suggestion: match.suggestion,
        });
      } else {
        setSuggestionBox(null);
      }
    }
  };

  const applyCorrection = (suggestion) => {
    if (suggestionBox) {
      const { word } = suggestionBox;
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const block = contentState.getBlockForKey(selectionState.getStartKey());
      const start = block.getText().indexOf(word);
      const end = start + word.length;

      const correctedContent = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: start,
          focusOffset: end,
        }),
        suggestion
      );

      setEditorState(
        EditorState.push(editorState, correctedContent, "insert-characters")
      );
      setSuggestionBox(null);
    }
  };

  return (
    <div style={{ position: "relative", textAlign: "center"  }}>
      <h1>Editor de texto deportivo</h1>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          minHeight: "200px",
          backgroundColor: "#fff",
          maxWidth: "600px",
          margin: "20px auto",
        }}
        onClick={handleWordClick}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          ref={editorRef}
        />
      </div>
      {suggestionBox && (
        <div
          style={{
            position: "absolute",
            top: suggestionBox.y,
            left: suggestionBox.x,
            background: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            borderRadius: "5px",
            zIndex: 1000,
            padding: "5px",
            display: "flex",
            gap: "10px",
          }}
        >
          <span>Sugerencias:</span>
          <button
            onClick={() => applyCorrection(suggestionBox.suggestion)}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {suggestionBox.suggestion}
          </button>
        </div>
      )}
    </div>
  );
}
