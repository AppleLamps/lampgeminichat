
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import * as MarkdownComponents from "../markdown/MarkdownComponents";

interface MessageContentProps {
  content: string;
  hasCodeBlocks?: boolean;
}

export const containsCodeBlock = (content: string) => {
  return content.includes("```");
};

export const MessageContent: React.FC<MessageContentProps> = ({ content, hasCodeBlocks }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const hasMarkdown = /[*_~`#>\[\]\(\)]/g.test(content) || containsCodeBlock(content);
  
  const markdownComponents = {
    code: (props: any) => (
      <MarkdownComponents.CodeBlock 
        {...props} 
        isDarkTheme={isDarkTheme} 
        codeStyle={{ dark: vscDarkPlus, light: vs }}
        SyntaxHighlighter={SyntaxHighlighter}
      />
    ),
    p: MarkdownComponents.Paragraph,
    h1: (props: any) => <MarkdownComponents.Heading level={1} {...props} />,
    h2: (props: any) => <MarkdownComponents.Heading level={2} {...props} />,
    h3: (props: any) => <MarkdownComponents.Heading level={3} {...props} />,
    h4: (props: any) => <MarkdownComponents.Heading level={4} {...props} />,
    h5: (props: any) => <MarkdownComponents.Heading level={5} {...props} />,
    h6: (props: any) => <MarkdownComponents.Heading level={6} {...props} />,
    a: MarkdownComponents.Link,
    li: MarkdownComponents.ListItem,
    ol: MarkdownComponents.OrderedList,
    ul: MarkdownComponents.UnorderedList,
    blockquote: MarkdownComponents.Blockquote,
    table: MarkdownComponents.Table,
    thead: MarkdownComponents.TableHead,
    tbody: MarkdownComponents.TableBody,
    tr: MarkdownComponents.TableRow,
    th: (props: any) => <MarkdownComponents.TableCell isHeader={true} {...props} />,
    td: (props: any) => <MarkdownComponents.TableCell isHeader={false} {...props} />
  };
  
  if (hasMarkdown) {
    return (
      <div className="prose dark:prose-invert prose-sm max-w-none">
        <ReactMarkdown components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }
  
  return (
    <div className="prose dark:prose-invert prose-sm max-w-none">
      <div className="whitespace-pre-wrap break-words">
        {content}
      </div>
    </div>
  );
};
