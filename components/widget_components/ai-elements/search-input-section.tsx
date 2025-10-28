"use client";

import { useState, useRef } from "react";
import { Sparkles, Search } from "lucide-react";
import { ProfileBlank } from "@/components/widget_components/icons/profile-blank";
import { SeedQuestionsCarousel } from "@/components/widget_components/ai-elements/seed-questions-carousel";
import type { SearchInputSectionProps } from "@/components/widget_components/types";

/**
 * SearchInputSection Component
 * Glassmorphism input with dual auto-scrolling seed question carousels
 */
export function SearchInputSection({
  placeholder,
  onSubmit,
  seedQuestionsRow1,
  seedQuestionsRow2,
  autoScrollInterval,
}: SearchInputSectionProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestion.trim()) {
      onSubmit(selectedQuestion);
    }
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Glassmorphism Input Container */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-[40px] p-[2px] bg-gradient-to-r from-[#FB9649] to-[#A361E9]">
            <div className="absolute inset-[2px] rounded-[38px] bg-white/80 backdrop-blur-sm" />
          </div>

          {/* Input Content */}
          <div className="relative flex items-center gap-2 px-4 py-3">
            {/* Sparkle Icon */}
            <Sparkles className="w-5 h-5 text-[#FB9649] flex-shrink-0" />

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-400"
            />

            {/* Submit Button (Search Icon) */}
            {selectedQuestion && (
              <button
                type="submit"
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FB9649] to-[#A361E9] flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            )}

            {/* Profile Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <ProfileBlank className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </form>

      {/* Seed Questions Carousels - Dual Rows */}
      {(seedQuestionsRow1.length > 0 || seedQuestionsRow2.length > 0) && (
        <div className="flex flex-col gap-2 w-full">
          {seedQuestionsRow1.length > 0 && (
            <SeedQuestionsCarousel
              questions={seedQuestionsRow1}
              autoScrollInterval={autoScrollInterval}
              onQuestionClick={handleQuestionClick}
              selectedQuestion={selectedQuestion}
            />
          )}
          {seedQuestionsRow2.length > 0 && (
            <SeedQuestionsCarousel
              questions={seedQuestionsRow2}
              autoScrollInterval={autoScrollInterval}
              onQuestionClick={handleQuestionClick}
              selectedQuestion={selectedQuestion}
            />
          )}
        </div>
      )}
    </div>
  );
}
