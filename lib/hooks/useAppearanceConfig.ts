"use client";

import { useState, useMemo } from "react";

export interface AppearanceSectionConfig {
  type: "solid" | "gradient" | "none";
  solidColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
}

export interface AppearanceConfig {
  border: AppearanceSectionConfig;
  background: AppearanceSectionConfig;
  text: AppearanceSectionConfig;
}

export interface MergedAppearanceConfig {
  borderType?: "solid" | "gradient" | "none";
  borderSolidColor?: string;
  borderGradientStart?: string;
  borderGradientEnd?: string;
  backgroundType?: "solid" | "gradient" | "none";
  backgroundSolidColor?: string;
  backgroundGradientStart?: string;
  backgroundGradientEnd?: string;
  textType?: "solid" | "gradient" | "none";
  textSolidColor?: string;
  textGradientStart?: string;
  textGradientEnd?: string;
  aiStarsType?: "solid" | "gradient" | "none";
  aiStarsSolidColor?: string;
  aiStarsGradientStart?: string;
  aiStarsGradientEnd?: string;
}

export function useAppearanceConfig() {
  const [border, setBorder] = useState<AppearanceSectionConfig>({
    type: "solid",
    solidColor: "#3b82f6",
  });

  const [background, setBackground] = useState<AppearanceSectionConfig>({
    type: "none",
  });

  const [text, setText] = useState<AppearanceSectionConfig>({
    type: "solid",
    solidColor: "#000000",
  });

  const [aiStars, setAiStars] = useState<AppearanceSectionConfig>({
    type: "gradient",
    gradientStart: "#6F61EF",
    gradientEnd: "#E19736",
  });

  // Merge all four sections into flat structure for database
  const merged = useMemo<MergedAppearanceConfig>(() => {
    return {
      borderType: border.type,
      borderSolidColor: border.solidColor,
      borderGradientStart: border.gradientStart,
      borderGradientEnd: border.gradientEnd,
      backgroundType: background.type,
      backgroundSolidColor: background.solidColor,
      backgroundGradientStart: background.gradientStart,
      backgroundGradientEnd: background.gradientEnd,
      textType: text.type,
      textSolidColor: text.solidColor,
      textGradientStart: text.gradientStart,
      textGradientEnd: text.gradientEnd,
      aiStarsType: aiStars.type,
      aiStarsSolidColor: aiStars.solidColor,
      aiStarsGradientStart: aiStars.gradientStart,
      aiStarsGradientEnd: aiStars.gradientEnd,
    };
  }, [border, background, text, aiStars]);

  return {
    border,
    background,
    text,
    aiStars,
    setBorder,
    setBackground,
    setText,
    setAiStars,
    merged,
  };
}
