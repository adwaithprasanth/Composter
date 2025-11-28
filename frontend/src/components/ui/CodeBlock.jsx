import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ code, language = "jsx", className = "" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`relative group rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/10 ${className}`}>
            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-[#060010] hover:bg-[#0a0018] text-white/70 hover:text-white transition-colors flex items-center gap-2"
                    title="Copy code"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied && <span className="text-xs">Copied!</span>}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: '#1e1e1e',
                    fontSize: '0.875rem',
                }}
                showLineNumbers
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
