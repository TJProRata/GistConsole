"use client";

import { EaterQuestionPill } from "./eater-question-pill";
import type { EaterSeedQuestionPillsProps } from "../types";

/**
 * Seed Question Pills Container
 * Displays array of question pills with squiggle underlines
 */
export function EaterSeedQuestionPills({
  questions,
  onQuestionClick,
  selectedQuestion,
}: EaterSeedQuestionPillsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
      {questions.map((question, index) => (
        <EaterQuestionPill
          key={`${question}-${index}`}
          question={question}
          onClick={() => onQuestionClick(question)}
          isSelected={selectedQuestion === question}
        />
      ))}
    </div>
  );
}
