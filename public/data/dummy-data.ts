import { Conversation } from "@/types/conversation";
import { Model, Provider } from "@/types/message";

const dummyProviders: Provider[] = [
  { id: "ollama", name: "Ollama" },
  { id: "nvidia", name: "Nvidia" },
  { id: "openrouter", name: "OpenRouter" },
];

const dummyModels: Model[] = [
  { id: "llama-3-8b", name: "Llama 3 (8B)", providerId: "ollama" },
  { id: "llama-3-70b", name: "Llama 3 (70B)", providerId: "ollama" },
  { id: "mistral-nemo", name: "Mistral Nemo", providerId: "ollama" },
  { id: "nemotron-4-340b", name: "Nemotron-4 340B", providerId: "nvidia" },
  { id: "nemotron-mini", name: "Nemotron Mini", providerId: "nvidia" },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    providerId: "openrouter",
  },
  { id: "openai/gpt-4o", name: "GPT-4o", providerId: "openrouter" },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    providerId: "openrouter",
  },
];

const dummyConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "React Markdown Setup",
    updatedAt: "2026-04-29T10:00:00Z",
    providerId: "openrouter",
    modelId: "anthropic/claude-3-opus",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: `How do I set up react-markdown with syntax highlighting?

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownViewer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};`,
        timestamp: "2026-04-29T09:55:00Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content: `Here is a complete setup for **react-markdown** with **remark-gfm** and **react-syntax-highlighter**:

**Example:**
\`\`\`tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownViewer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
\`\`\`

You can use this component to render any markdown string.`,
        timestamp: "2026-04-29T09:56:00Z",
      },
    ],
  },
  {
    id: "conv-2",
    title: "Explain Quantum Computing",
    updatedAt: "2026-04-28T14:30:00Z",
    providerId: "ollama",
    modelId: "llama-3-70b",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "Can you explain quantum computing to a 5 year old?",
        timestamp: "2026-04-28T14:28:00Z",
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "Imagine you are trying to find the way out of a big maze.\n\nA normal computer is like a person who walks down one path, and if it's a dead end, they walk back and try the next one. They only try one path at a time.\n\nA **quantum computer** is like magic! It can send out a bunch of little magical explorers to walk down *every single path* at the exact same time. It finds the way out way faster because it tries everything all at once!\n\nInstead of normal bits that can be either 0 or 1, quantum computers use **qubits** which can be both 0 and 1 at the same time. This is called **superposition**.",
        timestamp: "2026-04-28T14:30:00Z",
      },
    ],
  },
];

export { dummyProviders, dummyModels, dummyConversations };
