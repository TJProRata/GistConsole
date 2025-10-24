"use client";

import { useState } from "react";
import { RufusWidget } from "@/components/widget_components";
import { ComponentPreview } from "@/components/ComponentPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const DEFAULT_SEED_QUESTIONS = [
  "Does it fit in most cup holders?",
  "Is the straw removable?",
  "Can it keep drinks hot?",
  "What do customers say?",
  "Is this bottle leak-proof?",
  "What's the warranty coverage?",
  "How long does it keep drinks cold?",
  "Is it dishwasher safe?",
];

export default function RufusWidgetPreviewPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState(3);
  const [showMenu, setShowMenu] = useState(true);
  const [seedQuestions, setSeedQuestions] = useState(DEFAULT_SEED_QUESTIONS);

  const handleSubmit = (question: string) => {
    console.log("Question submitted:", question);
    alert(`Question submitted: ${question}`);
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
    alert("Menu clicked - settings/options would open here");
  };

  const codeString = `"use client";

import { RufusWidget } from "@/components/widget_components";

export default function Example() {
  const handleSubmit = (question: string) => {
    console.log("User asked:", question);
    // Send to AI backend, trigger response, etc.
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
    // Open settings/options modal
  };

  return (
    <RufusWidget
      collapsedText="Ask Rufus"
      visibleSeedQuestionsCollapsed={3}
      seedQuestions={[
        "Does it fit in most cup holders?",
        "Is the straw removable?",
        "Can it keep drinks hot?",
        "What do customers say?",
        "Is this bottle leak-proof?",
        "What's the warranty coverage?",
        "How long does it keep drinks cold?",
        "Is it dishwasher safe?"
      ]}
      welcomeHeading="Welcome!"
      welcomeMessage="Hi, I'm Rufus, your shopping assistant. My answers are powered by AI, so I may not always get things right."
      questionPrompt="What do you need help with today?"
      inputPlaceholder="Ask Rufus a question"
      showMenu={true}
      onSubmit={handleSubmit}
      onMenuClick={handleMenuClick}
    />
  );
}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/components/widgets">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Rufus Widget</h1>
              <p className="text-gray-600 mt-1">
                Amazon shopping assistant with AI-powered Q&A
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Rufus Widget Preview</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Interactive demo of the Amazon Rufus shopping assistant widget
                </p>
              </CardHeader>
              <CardContent>
                <ComponentPreview>
                  <ComponentPreview.Demo>
                    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg min-h-[500px]">
                      <RufusWidget
                        isExpanded={isExpanded}
                        onExpandChange={setIsExpanded}
                        visibleSeedQuestionsCollapsed={visibleQuestions}
                        seedQuestions={seedQuestions}
                        showMenu={showMenu}
                        onSubmit={handleSubmit}
                        onMenuClick={handleMenuClick}
                      />
                    </div>
                  </ComponentPreview.Demo>
                  <ComponentPreview.Code code={codeString} />
                </ComponentPreview>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Widget Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Expansion State */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="expanded"
                      checked={isExpanded}
                      onCheckedChange={(checked) => setIsExpanded(checked === true)}
                    />
                    <Label htmlFor="expanded">Widget Expanded</Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Toggle between collapsed and expanded states
                  </p>
                </div>

                {/* Visible Questions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="visible-questions">
                      Visible Questions (Collapsed)
                    </Label>
                    <span className="text-sm font-medium">{visibleQuestions}</span>
                  </div>
                  <Slider
                    id="visible-questions"
                    min={1}
                    max={5}
                    step={1}
                    value={[visibleQuestions]}
                    onValueChange={(value) => setVisibleQuestions(value[0])}
                  />
                  <p className="text-xs text-gray-500">
                    Number of seed questions visible in collapsed state
                  </p>
                </div>

                {/* Show Menu */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-menu"
                      checked={showMenu}
                      onCheckedChange={(checked) => setShowMenu(checked === true)}
                    />
                    <Label htmlFor="show-menu">Show Menu Button</Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Display menu button in expanded header
                  </p>
                </div>

                {/* Reset Button */}
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setVisibleQuestions(3);
                    setShowMenu(true);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <h4 className="font-medium">Collapsed State</h4>
                  <ul className="text-gray-600 space-y-1 pl-4 list-disc">
                    <li>Compact horizontal button</li>
                    <li>3 visible seed question pills</li>
                    <li>"Ask something else" CTA</li>
                    <li>Orange sparkle icon</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium">Expanded State</h4>
                  <ul className="text-gray-600 space-y-1 pl-4 list-disc">
                    <li>Full chat interface</li>
                    <li>Welcome card with AI disclaimer</li>
                    <li>Scrollable seed questions</li>
                    <li>Down arrow scroll indicator</li>
                    <li>Text input with submit</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium">Interactions</h4>
                  <ul className="text-gray-600 space-y-1 pl-4 list-disc">
                    <li>Click seed question to populate input</li>
                    <li>Manual submit (no auto-submit)</li>
                    <li>Keyboard navigation support</li>
                    <li>Responsive design</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#FF9900] border" />
                  <div>
                    <p className="text-sm font-medium">Amazon Orange</p>
                    <p className="text-xs text-gray-500">#FF9900</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#5F99CF] border" />
                  <div>
                    <p className="text-sm font-medium">Rufus Blue</p>
                    <p className="text-xs text-gray-500">#5F99CF</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#E8F4FD] border" />
                  <div>
                    <p className="text-sm font-medium">Rufus Blue Light</p>
                    <p className="text-xs text-gray-500">#E8F4FD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#436E9C] border" />
                  <div>
                    <p className="text-sm font-medium">Rufus Blue Dark</p>
                    <p className="text-xs text-gray-500">#436E9C</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
