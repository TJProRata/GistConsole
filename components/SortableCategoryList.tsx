"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, X } from "lucide-react";

interface SortableCategoryListProps {
  categories: string[];
  onChange: (categories: string[]) => void;
}

export default function SortableCategoryList({
  categories,
  onChange,
}: SortableCategoryListProps) {
  const [newCategory, setNewCategory] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;

    const updatedCategories = [...categories, newCategory.trim()];
    onChange(updatedCategories);
    setNewCategory("");
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    onChange(updatedCategories);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newCategories = [...categories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);

    onChange(newCategories);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  return (
    <div className="space-y-3">
      {/* Add category input */}
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add category..."
          className="flex-1"
        />
        <Button onClick={handleAddCategory} type="button">
          Add
        </Button>
      </div>

      {/* Category list */}
      {categories.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            {categories.map((category, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center justify-between p-3 rounded border
                  bg-white cursor-move transition-all
                  ${draggedIndex === index ? "opacity-50" : "opacity-100"}
                  ${dragOverIndex === index && draggedIndex !== index ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                  hover:border-gray-300
                `}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Drag handle */}
                  <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />

                  {/* Category text */}
                  <span className="text-sm font-medium">{category}</span>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCategory(index)}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Helper text */}
      {categories.length > 0 && (
        <p className="text-sm text-gray-500 italic">Drag to reorder</p>
      )}
    </div>
  );
}
