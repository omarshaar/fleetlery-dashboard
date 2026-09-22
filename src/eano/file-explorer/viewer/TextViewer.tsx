/**
 * TextViewer
 * -----------------------------
 * Renders plain text files (txt, json, md, log…)
 *
 * - Fetches content from file.url
 * - Shows loading + error states
 * - Monospace formatting for readability
 */

"use client";

import { useEffect, useState } from "react";
import type { FileItem } from "../types/file-item";

interface TextViewerProps {
  file: FileItem;
}

export function TextViewer({ file }: TextViewerProps) {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file.url) {
      setError("No file URL provided.");
      setLoading(false);
      return;
    }

    fetch(file.url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load text file.");
        return res.text();
      })
      .then((content) => {
        console.log(content);
        
        setText(content);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load file content.");
        setLoading(false);
      });
  }, [file.url]);

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Loading text…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-h-[70vh] overflow-auto bg-muted rounded-lg p-4">
      <pre className="whitespace-pre-wrap wrap-break-word font-mono text-sm">
        {text}
      </pre>
    </div>
  );
}
