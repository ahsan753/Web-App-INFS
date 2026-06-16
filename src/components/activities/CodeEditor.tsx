"use client";

import { AlignLeft } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";

export type LineFocusRequest = {
  line: number;
  token: number;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  lineFocus?: LineFocusRequest | null;
};

export function CodeEditor({ value, onChange, ariaLabel, lineFocus }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const textareaId = useId();
  const [currentLine, setCurrentLine] = useState(1);
  const [flashedLine, setFlashedLine] = useState<number | null>(null);
  const lineCount = Math.max(1, value.split("\n").length);
  const highlightedLine = flashedLine ?? currentLine;

  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount]
  );

  useEffect(() => {
    if (!lineFocus) return;
    const line = clampLine(lineFocus.line, lineCount);
    const textarea = getTextarea(shellRef.current);
    const scrollBox = shellRef.current?.querySelector<HTMLDivElement>(".code-editor-body");
    if (!textarea || !scrollBox) return;

    const start = getLineStart(value, line);
    const end = getLineEnd(value, start);
    const computed = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(computed.lineHeight) || 22;
    const paddingTop = Number.parseFloat(computed.paddingTop) || 16;
    const targetTop = paddingTop + (line - 1) * lineHeight;

    scrollBox.scrollTop = Math.max(0, targetTop - lineHeight * 2);
    textarea.focus();
    textarea.setSelectionRange(start, end);
    setCurrentLine(line);
    setFlashedLine(line);

    const timer = window.setTimeout(() => {
      setFlashedLine((activeLine) => (activeLine === line ? null : activeLine));
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [lineFocus, lineCount, value]);

  function queueSelection(start: number, end = start) {
    window.requestAnimationFrame(() => {
      const textarea = getTextarea(shellRef.current);
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
      updateCurrentLine(textarea);
    });
  }

  function updateCurrentLine(textarea: HTMLTextAreaElement) {
    setCurrentLine(getLineAtPosition(textarea.value, textarea.selectionStart));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>) {
    const textarea = event.target as HTMLTextAreaElement;
    updateCurrentLine(textarea);

    if (event.key === "Enter" && textarea.selectionStart === textarea.selectionEnd) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const lineBeforeCaret = value.slice(0, selectionStart).split("\n").pop() ?? "";
      const leadingSpaces = (lineBeforeCaret.match(/^[ \t]*/) ?? [""])[0].replace(/\t/g, "    ");
      const extraIndent = lineBeforeCaret.trimEnd().endsWith(":") ? "    " : "";
      const insertion = `\n${leadingSpaces}${extraIndent}`;

      event.preventDefault();
      onChange(value.slice(0, selectionStart) + insertion + value.slice(selectionEnd));
      queueSelection(selectionStart + insertion.length);
      return;
    }

    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      const next = dedentSelection(value, textarea.selectionStart, textarea.selectionEnd);
      if (next.value !== value) {
        onChange(next.value);
        queueSelection(next.selectionStart, next.selectionEnd);
      }
    }
  }

  function tidyIndentation() {
    const nextValue = value
      .split("\n")
      .map((line) => {
        const withoutTrailing = line.replace(/[ \t]+$/g, "");
        const leading = withoutTrailing.match(/^[ \t]+/)?.[0] ?? "";
        if (!leading) return withoutTrailing;
        const expandedWidth = leading.replace(/\t/g, "    ").length;
        const normalisedWidth = Math.ceil(expandedWidth / 4) * 4;
        return `${" ".repeat(normalisedWidth)}${withoutTrailing.slice(leading.length)}`;
      })
      .join("\n");

    onChange(nextValue);
    queueSelection(Math.min(getTextarea(shellRef.current)?.selectionStart ?? 0, nextValue.length));
  }

  return (
    <div className="code-editor-shell" ref={shellRef}>
      <label className="sr-only" htmlFor={textareaId}>
        {ariaLabel}
      </label>
      <div className="mb-2 flex items-center justify-end">
        <button className="button compact" type="button" onClick={tidyIndentation}>
          <AlignLeft size={16} aria-hidden="true" /> Tidy indentation
        </button>
      </div>
      <div className="code-editor-body">
        <div className="code-editor-gutter" aria-hidden="true">
          {lineNumbers.map((lineNumber) => (
            <span
              className={lineNumber === highlightedLine ? "active" : ""}
              key={lineNumber}
            >
              {lineNumber}
            </span>
          ))}
        </div>
        <div className="code-editor-pane" style={{ minWidth: 0 }}>
          <span
            className="code-editor-line-highlight"
            style={{ top: `calc(1rem + ${(highlightedLine - 1).toString()} * 1.6em)` }}
            aria-hidden="true"
          />
          <Editor
            className="code-editor code-editor-instance"
            value={value}
            onValueChange={onChange}
            highlight={highlightPython}
            tabSize={4}
            insertSpaces
            padding={16}
            textareaId={textareaId}
            textareaClassName="python-editor-textarea"
            preClassName="python-editor-pre"
            onClick={(event) => updateCurrentLine(event.target as HTMLTextAreaElement)}
            onFocus={(event) => updateCurrentLine(event.target as HTMLTextAreaElement)}
            onKeyUp={(event) => updateCurrentLine(event.target as HTMLTextAreaElement)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

function highlightPython(code: string) {
  return Prism.highlight(code, Prism.languages.python, "python");
}

function getTextarea(root: HTMLDivElement | null) {
  return root?.querySelector<HTMLTextAreaElement>("textarea") ?? null;
}

function clampLine(line: number, lineCount: number) {
  return Math.min(Math.max(1, line), lineCount);
}

function getLineAtPosition(value: string, position: number) {
  return value.slice(0, position).split("\n").length;
}

function getLineStart(value: string, line: number) {
  if (line <= 1) return 0;
  let currentLine = 1;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "\n") {
      currentLine += 1;
      if (currentLine === line) return index + 1;
    }
  }
  return value.length;
}

function getLineEnd(value: string, start: number) {
  const nextBreak = value.indexOf("\n", start);
  return nextBreak === -1 ? value.length : nextBreak;
}

function dedentSelection(value: string, selectionStart: number, selectionEnd: number) {
  const lines = value.split("\n");
  const lineOffsets: number[] = [];
  let offset = 0;
  for (const line of lines) {
    lineOffsets.push(offset);
    offset += line.length + 1;
  }

  const startLine = getLineAtPosition(value, selectionStart) - 1;
  const rawEndLine = getLineAtPosition(value, selectionEnd) - 1;
  const endLine =
    selectionEnd > selectionStart && value[selectionEnd - 1] === "\n"
      ? Math.max(startLine, rawEndLine - 1)
      : rawEndLine;
  const removals: { offset: number; count: number }[] = [];

  const nextLines = lines.map((line, index) => {
    if (index < startLine || index > endLine) return line;
    const spaceMatch = line.match(/^ {1,4}/);
    const count = spaceMatch?.[0].length ?? (line.startsWith("\t") ? 1 : 0);
    if (!count) return line;
    removals.push({ offset: lineOffsets[index], count });
    return line.slice(count);
  });

  return {
    value: nextLines.join("\n"),
    selectionStart: adjustPosition(selectionStart, removals),
    selectionEnd: adjustPosition(selectionEnd, removals)
  };
}

function adjustPosition(position: number, removals: { offset: number; count: number }[]) {
  return removals.reduce((nextPosition, removal) => {
    if (position <= removal.offset) return nextPosition;
    const removedBeforePosition = Math.min(removal.count, position - removal.offset);
    return nextPosition - removedBeforePosition;
  }, position);
}
