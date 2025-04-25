import React, { useState, useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/services/geminiService";
import { cn } from "@/lib/utils";
import { User, Bot, CheckCheck, Image, Copy, Check, ThumbsUp, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { BlurContainer } from "@/components/ui/blur-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessageProps {
  message: ChatMessageType;
  isSequential?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isSequential = false
}) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const hasImage = Boolean(message.imageUrl);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const messageRef = useRef<HTMLDivElement>(null);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation when message appears
  useEffect(() => {
    setIsVisible(true);

    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);

  const containsCodeBlock = (content: string) => {
    return content.includes("```");
  };

  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match && match[1] ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    if (inline) {
      return (
        <code className="px-1 py-0.5 mx-0.5 bg-slate-200 dark:bg-slate-800 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    return (
      <div className="relative my-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 dark:bg-slate-900 text-white">
          <span className="text-xs font-medium">{language || 'Code'}</span>
          <button
            onClick={() => copyToClipboard(code)}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Copy code"
          >
            {copiedCode === code ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={isDarkTheme ? vscDarkPlus : vs}
          customStyle={{ margin: 0, borderRadius: '0 0 0.375rem 0.375rem' }}
          wrapLongLines={true}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const Paragraph = (props: any) => {
    return <p className="mb-4 last:mb-0" {...props} />;
  };

  const Heading = ({ level, children, ...props }: any) => {
    const sizes = {
      1: "text-2xl font-bold mt-6 mb-4",
      2: "text-xl font-bold mt-5 mb-3",
      3: "text-lg font-bold mt-4 mb-2",
      4: "text-base font-semibold mt-3 mb-2",
      5: "text-sm font-semibold mt-2 mb-1",
      6: "text-xs font-semibold mt-2 mb-1"
    };

    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag className={sizes[level as keyof typeof sizes]} {...props}>{children}</Tag>;
  };

  const Link = (props: any) => {
    return (
      <a
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  };

  const ListItem = (props: any) => <li className="ml-6 mb-1" {...props} />;
  const OrderedList = (props: any) => <ol className="list-decimal mb-4" {...props} />;
  const UnorderedList = (props: any) => <ul className="list-disc mb-4" {...props} />;

  const Blockquote = (props: any) => (
    <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-1 my-4 text-slate-600 dark:text-slate-300 italic" {...props} />
  );

  const Table = (props: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse" {...props} />
    </div>
  );

  const TableHead = (props: any) => <thead className="bg-slate-100 dark:bg-slate-800" {...props} />;
  const TableBody = (props: any) => <tbody {...props} />;
  const TableRow = (props: any) => <tr className="border-b border-slate-200 dark:border-slate-700" {...props} />;
  const TableCell = ({ isHeader, ...props }: any) => {
    if (isHeader) {
      return <th className="px-4 py-2 text-left font-semibold" {...props} />;
    }
    return <td className="px-4 py-2" {...props} />;
  };

  const markdownComponents = {
    code: CodeBlock,
    p: Paragraph,
    h1: (props: any) => <Heading level={1} {...props} />,
    h2: (props: any) => <Heading level={2} {...props} />,
    h3: (props: any) => <Heading level={3} {...props} />,
    h4: (props: any) => <Heading level={4} {...props} />,
    h5: (props: any) => <Heading level={5} {...props} />,
    h6: (props: any) => <Heading level={6} {...props} />,
    a: Link,
    li: ListItem,
    ol: OrderedList,
    ul: UnorderedList,
    blockquote: Blockquote,
    table: Table,
    thead: TableHead,
    tbody: TableBody,
    tr: TableRow,
    th: (props: any) => <TableCell isHeader={true} {...props} />,
    td: (props: any) => <TableCell isHeader={false} {...props} />
  };

  const renderMessageContent = () => {
    const hasMarkdown = /[*_~`#>\[\]\(\)]/g.test(message.content) || containsCodeBlock(message.content);

    if (hasMarkdown) {
      return (
        <ReactMarkdown components={markdownComponents}>
          {message.content}
        </ReactMarkdown>
      );
    }

    return (
      <div className="whitespace-pre-wrap break-words">
        {message.content}
      </div>
    );
  };

  // Message action buttons component
  const MessageActions = () => {
    if (isUser) return null; // Only show actions for AI messages

    return (
      <div
        className={cn(
          "flex items-center gap-1 mt-1 transition-all duration-300",
          showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleLike}
                className={cn(
                  "p-1.5 rounded-full transition-all",
                  isLiked
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "text-muted-foreground/50 hover:bg-muted/50 hover:text-muted-foreground"
                )}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isLiked ? "Unlike" : "Like"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleBookmark}
                className={cn(
                  "p-1.5 rounded-full transition-all",
                  isBookmarked
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "text-muted-foreground/50 hover:bg-muted/50 hover:text-muted-foreground"
                )}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isBookmarked ? "Remove bookmark" : "Bookmark"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (message.content) {
                    navigator.clipboard.writeText(message.content);
                  }
                }}
                className="p-1.5 rounded-full text-muted-foreground/50 hover:bg-muted/50 hover:text-muted-foreground transition-all"
                aria-label="Copy message"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Copy message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-1.5 rounded-full text-muted-foreground/50 hover:bg-muted/50 hover:text-muted-foreground transition-all"
                aria-label="Share"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <div
      ref={messageRef}
      className={cn(
        "w-full transition-all",
        isUser ? "justify-end" : "justify-start",
        isSequential ? "mt-2" : "mt-6",
        isSystem ? "my-8 flex justify-center" : "flex",
        isVisible ? "opacity-100" : "opacity-0",
        "transform transition-all duration-300",
        isUser ? "animate-slide-in-from-right" : "animate-slide-in-from-left"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isSystem ? (
        <BlurContainer
          intensity="light"
          gradient="subtle"
          hoverEffect
          className="text-center italic text-muted-foreground text-sm py-3 px-6 max-w-md bg-gradient-to-r from-slate-400/10 via-slate-300/10 to-slate-400/5 dark:from-slate-800/20 dark:via-slate-700/15 dark:to-slate-800/10 border-white/10 dark:border-white/5"
        >
          <div className="text-center">{message.content}</div>
        </BlurContainer>
      ) : (
        <div
          className={cn(
            "flex max-w-[85%] group",
            isUser ? "flex-row-reverse ml-auto" : "flex-row",
          )}
        >
          {!isSequential && (
            <div
              className={cn(
                "flex self-end mb-1",
                isUser ? "ml-3" : "mr-3"
              )}
            >
              <Avatar
                className={cn(
                  "h-8 w-8 ring-2 transition-all duration-300 shadow-md",
                  isUser
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 ring-indigo-500/20 hover:ring-indigo-500/40"
                    : "bg-gradient-to-br from-primary to-primary/70 ring-primary/20 hover:ring-primary/40"
                )}
              >
                {!isUser && (
                  <AvatarImage
                    src="/lovable-uploads/d03f6a93-56ad-44c9-9425-21d55cef2fdf.png"
                    alt="AI Avatar"
                    className="h-full w-full object-cover"
                  />
                )}
                <AvatarFallback className="text-white">
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <div
            className={cn(
              "min-w-[40px] max-w-full flex flex-col"
            )}
          >
            <BlurContainer
              intensity={isUser ? "medium" : "light"}
              hoverEffect
              className={cn(
                "py-3 px-4 transition-all duration-300 shadow-md",
                isUser
                  ? "bg-gradient-to-br from-indigo-500/15 to-purple-600/10 border-indigo-200/30 hover:border-indigo-200/50"
                  : "bg-gradient-to-br from-primary/15 to-primary/10 border-primary/30 hover:border-primary/50",
                containsCodeBlock(message.content) ? "px-4 py-3" : "",
                isUser ? "rounded-tr-sm" : "rounded-tl-sm"
              )}
            >
              <div className="prose dark:prose-invert prose-sm max-w-none">
                {renderMessageContent()}
              </div>

              {hasImage && (
                <div className="mt-3 relative group/image">
                  <div className="rounded-md overflow-hidden shadow-md border border-white/10 dark:border-white/5 group-hover/image:border-white/20 dark:group-hover/image:border-white/10 transition-all">
                    <img
                      src={message.imageUrl}
                      alt="Generated content"
                      className="w-full h-auto max-h-96 object-contain bg-black/40"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                        target.className = target.className + " p-8 text-slate-400";
                      }}
                    />
                  </div>
                  <a
                    href={message.imageUrl}
                    download={`gemini-image-${Date.now()}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-all shadow-lg border border-white/10 hover:border-white/20 opacity-0 group-hover/image:opacity-100"
                  >
                    <Image className="h-4 w-4 text-white" />
                    <span className="sr-only">Download image</span>
                  </a>
                </div>
              )}

              <div className="flex items-center justify-end mt-2 space-x-1">
                {message.timestamp && (
                  <div className="text-xs text-muted-foreground/70 text-right flex items-center">
                    <span className="mr-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {isUser && <CheckCheck className="h-3 w-3 text-indigo-500/70" />}
                  </div>
                )}
              </div>
            </BlurContainer>

            {/* Message actions */}
            <MessageActions />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
