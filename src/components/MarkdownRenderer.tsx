import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Custom styling for lists
          ul: ({ children }) => (
            <ul className="space-y-1 list-disc list-inside ml-0">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed ml-0">{children}</li>
          ),
          // Custom styling for headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-gray-900 mb-3 mt-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-gray-800 mb-2 mt-4 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-medium text-gray-700 mb-2 mt-3 first:mt-0">{children}</h3>
          ),
          // Custom styling for paragraphs
          p: ({ children }) => (
            <p className="text-sm leading-relaxed mb-2 text-gray-900">{children}</p>
          ),
          // Custom styling for strong text
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          // Custom styling for emphasis
          em: ({ children }) => (
            <em className="text-gray-700">{children}</em>
          ),
          // Custom styling for code
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}