import React, { useState } from "react";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const AIResponsePreview = ({ content }) => {
  if (!content) return null;

  // Remove commas between code blocks before rendering
  const cleanedContent = removeCommasBetweenCodeBlocks(content);

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              if (!inline) {
                return (
                  <CodeBlock
                    code={String(children).replace(/\n$/, "")}
                    language={language}
                  />
                );
              }
              const text = String(children).trim();
              if (
                text.length <= 12 &&
                !text.includes(" ") &&
                !text.includes("\n")
              ) {
                return (
                  <code
                    className="px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <span
                  className="inline-block align-middle bg-gray-100 rounded px-2 py-1 font-mono text-sm text-gray-800"
                  {...props}
                >
                  {children}
                </span>
              );
            },

            p({ children }) {
              // Only use <p> if ALL children are plain strings (text). Otherwise, use <div>.
              const allStrings = React.Children.toArray(children).every(
                (child) => typeof child === "string"
              );
              const Wrapper = allStrings ? "p" : "div";
              return (
                <Wrapper className="mb-4 text-base leading-relaxed text-gray-800 text-justify">
                  {children}
                </Wrapper>
              );
            },

            strong({ children }) {
              if (typeof children[0] === "string") {
                if (children[0].toLowerCase().includes("question:")) {
                  return (
                    <h3 className="text-xl font-bold mt-6 mb-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg shadow-lg border-2 border-blue-400 transform hover:scale-105 transition-transform duration-200">
                      {children}
                    </h3>
                  );
                }
                if (children[0].toLowerCase().includes("answer:")) {
                  return (
                    <h4 className="text-base font-semibold mb-2 text-green-700">
                      {children}
                    </h4>
                  );
                }
              }
              return <strong className="font-semibold">{children}</strong>;
            },

            em({ children }) {
              return <em className="italic">{children}</em>;
            },

            ul({ children }) {
              return (
                <ul className="list-disc pl-5 space-y-1 my-3">{children}</ul>
              );
            },

            ol({ children }) {
              return (
                <ol className="list-decimal pl-5 space-y-1 my-3">{children}</ol>
              );
            },

            li({ children }) {
              return <li className="mb-1">{children}</li>;
            },

            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                  {children}
                </blockquote>
              );
            },

            h1({ children }) {
              return (
                <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                  {children}
                </h1>
              );
            },

            h2({ children }) {
              return (
                <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900">
                  {children}
                </h2>
              );
            },

            h3({ children }) {
              return (
                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900">
                  {children}
                </h3>
              );
            },

            h4({ children }) {
              return (
                <h4 className="text-base font-semibold mt-3 mb-2 text-gray-900">
                  {children}
                </h4>
              );
            },

            a({ href, children }) {
              return (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            },

            table({ children }) {
              return (
                <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    {children}
                  </table>
                </div>
              );
            },

            thead({ children }) {
              return <thead className="bg-gray-50">{children}</thead>;
            },

            tbody({ children }) {
              return (
                <tbody className="divide-y divide-gray-200 bg-white">
                  {children}
                </tbody>
              );
            },

            tr({ children }) {
              return <tr>{children}</tr>;
            },

            th({ children }) {
              return (
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {children}
                </th>
              );
            },

            td({ children }) {
              return <td className="px-4 py-2 text-sm">{children}</td>;
            },

            hr() {
              return <hr className="my-6 border-gray-200" />;
            },

            img({ src, alt }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="my-4 max-w-full rounded-lg border border-gray-200"
                  loading="lazy"
                />
              );
            },
          }}
        >
          {cleanedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If code is a single line, short (<= 16 chars), render as compact inline code
  const isSingleShortLine = !code.includes("\n") && code.trim().length <= 16;
  if (isSingleShortLine) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono mx-1">
        {code}
      </code>
    );
  }

  return (
    <div className="relative my-4 rounded-lg overflow-hidden bg-gray-50 border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center space-x-2">
          <LuCode size={16} className="text-blue-500" />
          <span className="text-xs font-medium text-blue-700">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors"
          aria-label="Copy Code"
        >
          {copied ? (
            <LuCheck size={16} className="text-green-600" />
          ) : (
            <LuCopy size={16} />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: "0.8125rem",
          margin: 0,
          padding: "1rem",
          background: "transparent",
          lineHeight: "1.5",
        }}
        showLineNumbers={code.split("\n").length > 5}
        lineNumberStyle={{ color: "#9CA3AF", minWidth: "2.25em" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// Remove commas between consecutive code blocks in markdown
function removeCommasBetweenCodeBlocks(content) {
  // Replace ",\n\n```" or ",\n```" with just "\n\n```" or "\n```"
  return content.replace(/,\s*\n(```)/g, "\n$1");
}

export default AIResponsePreview;
