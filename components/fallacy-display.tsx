"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, ChevronDown, Link as LinkIcon, ClipboardCopy, Check } from "lucide-react"

interface Fallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
  source: string
  explanation?: string
  quote?: string
}

interface FallacyDisplayProps {
    fallacy: Fallacy,
    originalText?: string
}

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Fallacies of Relevance": "bg-blue-100 text-blue-800 border-blue-300",
      "Fallacies of Presumption": "bg-green-100 text-green-800 border-green-300",
      "Fallacies of Ambiguity": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Formal Fallacies": "bg-purple-100 text-purple-800 border-purple-300",
    }
    return colors[category] || "bg-neutral-100 text-neutral-800 border-neutral-300"
}

// Helper to highlight the quote within the original text
const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight || !text.includes(highlight)) {
      return <>{text}</>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-orange-200/70 px-1 py-0.5 rounded-md">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
};


export default function FallacyDisplay({ fallacy, originalText }: FallacyDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(!!fallacy.explanation); // Auto-expand if it's an analysis result
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = () => {
        if (!fallacy.explanation) return;
        navigator.clipboard.writeText(fallacy.explanation)
            .then(() => {
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            })
            .catch(err => console.error('Failed to copy text: ', err));
    }

    return (
        <div className="border border-neutral-200 rounded-lg p-6 bg-white transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between mb-4 gap-2">
                <h3 className="text-xl font-semibold text-neutral-950">{fallacy.name}</h3>
                <Badge variant="outline" className={getCategoryColor(fallacy.category)}>
                    {fallacy.category}
                </Badge>
            </div>

            <div className="space-y-4">
                {originalText && fallacy.quote && (
                     <div>
                        <h4 className="font-medium text-neutral-800 mb-2">Identified in Your Text:</h4>
                        <blockquote className="text-neutral-700 bg-neutral-50 p-4 rounded-md border-l-4 border-orange-400 italic">
                            <HighlightedText text={originalText} highlight={fallacy.quote} />
                        </blockquote>
                    </div>
                )}
                
                {fallacy.explanation && (
                    <div className="relative">
                        <h4 className="font-medium text-neutral-800 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-orange-500"/>Explanation
                        </h4>
                        <p className="text-neutral-700 bg-yellow-50 p-3 rounded-md border border-yellow-200 pr-12">
                            {fallacy.explanation}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-8 right-1 h-8 w-8 text-neutral-600 hover:text-neutral-900"
                            onClick={handleCopy}
                            aria-label="Copy explanation"
                        >
                            {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <ClipboardCopy className="w-4 h-4" />}
                        </Button>
                    </div>
                )}


                <details open={isExpanded} className="group" onToggle={(e) => setIsExpanded((e.target as HTMLDetailsElement).open)}>
                    <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-neutral-900 list-none flex items-center">
                        <span className="group-open:hidden">Show General Info</span>
                        <span className="hidden group-open:inline">Hide General Info</span>
                        <ChevronDown className="w-4 h-4 ml-1 transition-transform group-open:rotate-180"/>
                    </summary>
                    <div className="mt-4 space-y-5 animate-in fade-in-0 duration-300">
                        <div>
                            <h4 className="font-semibold text-neutral-800 mb-2 text-base">Description:</h4>
                            <p className="text-neutral-700 leading-relaxed">{fallacy.description}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 mb-2 text-base">Logical Form:</h4>
                            <p className="text-neutral-700 font-mono text-sm bg-neutral-100 p-3 rounded-md border border-neutral-200">
                            {fallacy.logicalForm}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 mb-2 text-base">Generic Example:</h4>
                            <p className="text-neutral-700 italic bg-neutral-50 p-3 rounded-md border border-dashed border-neutral-300">"{fallacy.example}"</p>
                        </div>
                        {fallacy.altNames.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-neutral-800 mb-2 text-base">Also known as:</h4>
                                <div className="flex flex-wrap gap-2">
                                {fallacy.altNames.map((altName, altIndex) => (
                                    <Badge
                                    key={altIndex}
                                    variant="secondary"
                                    className="bg-neutral-200 text-neutral-700"
                                    >
                                    {altName}
                                    </Badge>
                                ))}
                                </div>
                            </div>
                        )}
                        {fallacy.source && (
                            <div>
                                <h4 className="font-semibold text-neutral-800 mb-2 text-base">Reference:</h4>
                                <a href={fallacy.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 text-sm break-all">
                                    <LinkIcon className="h-3 w-3 flex-shrink-0"/>
                                    {fallacy.source}
                                </a>
                            </div>
                        )}
                    </div>
                </details>
            </div>
        </div>
    )
}
