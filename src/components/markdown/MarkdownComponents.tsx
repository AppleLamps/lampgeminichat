
import React from "react";
import { Check, Copy } from "lucide-react";

// Code block component for syntax highlighting
interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  language?: string;
  isDarkTheme: boolean;
  codeStyle: any;
  SyntaxHighlighter: any;
}

export const CodeBlock = ({ 
  inline, 
  className, 
  children, 
  isDarkTheme,
  codeStyle,
  SyntaxHighlighter,
  ...props 
}: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match && match[1] ? match[1] : '';
  const code = String(children).replace(/\n$/, '');
  
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
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
        style={isDarkTheme ? codeStyle.dark : codeStyle.light}
        customStyle={{ margin: 0, borderRadius: '0 0 0.375rem 0.375rem' }}
        wrapLongLines={true}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export const Paragraph = (props: any) => {
  return <p className="mb-4 last:mb-0" {...props} />;
};

export const Heading = ({ level, children, ...props }: any) => {
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

export const Link = (props: any) => {
  return (
    <a 
      className="text-blue-600 dark:text-blue-400 hover:underline" 
      target="_blank" 
      rel="noopener noreferrer" 
      {...props}
    />
  );
};

export const ListItem = (props: any) => <li className="ml-6 mb-1" {...props} />;
export const OrderedList = (props: any) => <ol className="list-decimal mb-4" {...props} />;
export const UnorderedList = (props: any) => <ul className="list-disc mb-4" {...props} />;

export const Blockquote = (props: any) => (
  <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-1 my-4 text-slate-600 dark:text-slate-300 italic" {...props} />
);

export const Table = (props: any) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full border-collapse" {...props} />
  </div>
);

export const TableHead = (props: any) => <thead className="bg-slate-100 dark:bg-slate-800" {...props} />;
export const TableBody = (props: any) => <tbody {...props} />;
export const TableRow = (props: any) => <tr className="border-b border-slate-200 dark:border-slate-700" {...props} />;

export const TableCell = ({ isHeader, ...props }: any) => {
  if (isHeader) {
    return <th className="px-4 py-2 text-left font-semibold" {...props} />;
  }
  return <td className="px-4 py-2" {...props} />;
};
