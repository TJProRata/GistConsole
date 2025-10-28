"use client";

import { useRef, useEffect } from "react";
import { animate } from "framer-motion";
import { QuestionPill } from "@/components/widget_components/ai-elements/question-pill";
import type { SeedQuestionsCarouselProps } from "@/components/widget_components/types";

/**
 * SeedQuestionsCarousel Component
 * Auto-scrolling carousel for seed question suggestions with pause-on-hover
 */
export function SeedQuestionsCarousel({
  questions,
  autoScrollInterval,
  onQuestionClick,
  selectedQuestion,
}: SeedQuestionsCarouselProps) {
  // Refs for animation control
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  // Calculate duration based on autoScrollInterval prop (convert ms to seconds)
  const scrollDuration = autoScrollInterval / 1000;

  // Duplicate questions array for seamless infinite loop
  const duplicatedQuestions = [...questions, ...questions];

  // Initialize animation on mount and restart when autoScrollInterval changes
  useEffect(() => {
    if (carouselRef.current) {
      animationRef.current = animate(
        carouselRef.current,
        { x: ["0%", "-50%"] },
        {
          duration: scrollDuration,
          repeat: Infinity,
          ease: "linear",
        }
      );
    }

    // Cleanup animation on unmount or when autoScrollInterval changes
    return () => {
      animationRef.current?.stop();
    };
  }, [autoScrollInterval, scrollDuration]);

  // Pause animation on hover
  const handleMouseEnter = () => {
    animationRef.current?.pause();
  };

  // Resume animation on mouse leave
  const handleMouseLeave = () => {
    animationRef.current?.play();
  };

  return (
    <div
      className="w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={carouselRef}
        className="flex gap-2"
        style={{ width: "fit-content" }}
      >
        {duplicatedQuestions.map((question, index) => (
          <QuestionPill
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
            isSelected={selectedQuestion === question}
          />
        ))}
      </div>
    </div>
  );
}
