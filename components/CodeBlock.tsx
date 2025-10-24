"use client";

import * as React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Register languages
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("tsx", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", javascript);

const codeBlockVariants = cva(
  "relative rounded-lg border bg-muted",
  {
    variants: {
      theme: {
        light: "bg-white border-gray-200",
        dark: "bg-gray-900 border-gray-800",
      },
    },
    defaultVariants: {
      theme: "light",
    },
  }
);

export interface CodeBlockProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof codeBlockVariants> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, theme, code, language = "tsx", showLineNumbers = true, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(codeBlockVariants({ theme, className }))}
        {...props}
      >
        {/* Copy Button */}
        <div className="absolute right-2 top-2 z-10">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={copyToClipboard}
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Code Container */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={theme === "dark" ? atomOneDark : atomOneLight}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: "0.875rem",
            }}
            codeTagProps={{
              style: {
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock, codeBlockVariants };
