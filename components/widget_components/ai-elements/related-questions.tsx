import { cn } from "@/lib/utils";
import type { RelatedQuestionsProps } from "@/components/widget_components/types";

export function RelatedQuestions({
  questions,
  onQuestionClick,
  className,
}: RelatedQuestionsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-gray-700">
        Related Questions
      </h3>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <RelatedQuestionPill
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
          />
        ))}
      </div>
    </div>
  );
}

function RelatedQuestionPill({
  question,
  onClick,
}: {
  question: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full",
        "bg-gradient-to-r from-orange-50 to-purple-50",
        "border border-gray-200",
        "text-sm font-medium text-gray-700",
        "hover:shadow-md transition-shadow"
      )}
    >
      {question}
    </button>
  );
}
