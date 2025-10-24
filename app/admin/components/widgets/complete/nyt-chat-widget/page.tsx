"use client";

import { useState } from "react";
import { ArrowLeft, Code2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { NYTChatWidget } from "@/components/widget_components";
import { CodeBlock } from "@/components/CodeBlock";

export default function NYTChatWidgetPreview() {
  // Demo state
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsedText, setCollapsedText] = useState("Ask");
  const [title, setTitle] = useState("Ask New York Times Anything!");
  const [placeholder, setPlaceholder] = useState("Ask anything");
  const [followUpPlaceholder, setFollowUpPlaceholder] = useState("Ask a follow up...");
  const [categories, setCategories] = useState("Top Stories,Breaking News,Generate a new Wordle,Election Coverage,Climate News");
  const [brandingText, setBrandingText] = useState("Powered by Gist Answers");

  const categoryArray = categories.split(",").map((c) => c.trim()).filter(Boolean);

  const handleSubmit = (query: string) => {
    console.log("Query submitted:", query);
  };

  const handleCategoryClick = (category: string) => {
    console.log("Category clicked:", category);
  };

  const handleCitationClick = (citation: string) => {
    console.log("Citation clicked:", citation);
  };

  const codeExample = `import { NYTChatWidget } from "@/components/widget_components";

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <NYTChatWidget
      isExpanded={isExpanded}
      onExpandChange={setIsExpanded}
      collapsedText="Ask"
      title="Ask New York Times Anything!"
      suggestionCategories={[
        "Top Stories",
        "Breaking News",
        "Generate a new Wordle",
        "Election Coverage",
        "Climate News"
      ]}
      placeholder="Ask anything"
      followUpPlaceholder="Ask a follow up..."
      brandingText="Powered by Gist Answers"
      onSubmit={(query) => console.log("Query:", query)}
      onCategoryClick={(category) => console.log("Category:", category)}
      onCitationClick={(citation) => console.log("Citation:", citation)}
    />
  );
}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/components/widgets">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">NYT Chat Widget</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Interactive news Q&A assistant with dark theme
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Complete Widget</Badge>
              <Badge variant="outline">4 States</Badge>
              <Badge variant="outline">11 Components</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Interactive Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Code
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Widget Controls</CardTitle>
                    <CardDescription>
                      Customize widget appearance and behavior
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* State Control */}
                    <div className="space-y-2">
                      <Label>Widget State</Label>
                      <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        variant="outline"
                        className="w-full"
                      >
                        {isExpanded ? "Collapse" : "Expand"} Widget
                      </Button>
                    </div>

                    <Separator />

                    {/* Text Customization */}
                    <div className="space-y-2">
                      <Label htmlFor="collapsedText">Collapsed Text</Label>
                      <Input
                        id="collapsedText"
                        value={collapsedText}
                        onChange={(e) => setCollapsedText(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Widget Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="placeholder">Search Placeholder</Label>
                      <Input
                        id="placeholder"
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="followUpPlaceholder">Follow-up Placeholder</Label>
                      <Input
                        id="followUpPlaceholder"
                        value={followUpPlaceholder}
                        onChange={(e) => setFollowUpPlaceholder(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categories">
                        Suggestion Categories (comma-separated)
                      </Label>
                      <Input
                        id="categories"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        placeholder="Category 1, Category 2, ..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brandingText">Branding Text</Label>
                      <Input
                        id="brandingText"
                        value={brandingText}
                        onChange={(e) => setBrandingText(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Widget Preview */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>
                      Interact with the widget to test all states and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8">
                      <NYTChatWidget
                        isExpanded={isExpanded}
                        onExpandChange={setIsExpanded}
                        collapsedText={collapsedText}
                        title={title}
                        suggestionCategories={categoryArray}
                        placeholder={placeholder}
                        followUpPlaceholder={followUpPlaceholder}
                        brandingText={brandingText}
                        onSubmit={handleSubmit}
                        onCategoryClick={handleCategoryClick}
                        onCitationClick={handleCitationClick}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Feature Documentation */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Widget Features</CardTitle>
                    <CardDescription>
                      Complete feature breakdown and interaction guide
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">State Machine (4 States)</h3>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• <strong>Collapsed:</strong> Compact button with sparkle icon and NYT logo</li>
                        <li>• <strong>Search:</strong> Expanded view with suggestion categories and search input</li>
                        <li>• <strong>Loading:</strong> Multi-stage animation ("Searching through articles... books... videos... podcasts")</li>
                        <li>• <strong>Answer:</strong> Streaming text answer with expandable content (3→10 lines) and citation pills</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Interactive Features</h3>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• <strong>Autocomplete:</strong> Type 3+ characters to trigger live suggestions</li>
                        <li>• <strong>Suggestion Categories:</strong> Pre-populated topics with sparkle icons</li>
                        <li>• <strong>Streaming Answer:</strong> Character-by-character text reveal animation</li>
                        <li>• <strong>Answer Expansion:</strong> Click to expand from 3 to 10 lines</li>
                        <li>• <strong>Scrollable Content:</strong> Answers &gt;10 lines enable scrolling</li>
                        <li>• <strong>Citation Pills:</strong> Source attribution with clickable pills</li>
                        <li>• <strong>Follow-up Input:</strong> Ask additional questions after initial answer</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Design System</h3>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• <strong>Dark Theme:</strong> #1a1a1a background, white text, purple accents</li>
                        <li>• <strong>Purple Accent:</strong> #9333ea for interactive elements and branding</li>
                        <li>• <strong>Typography:</strong> Clean sans-serif with proper line heights</li>
                        <li>• <strong>Animations:</strong> Smooth transitions, streaming text, loading states</li>
                        <li>• <strong>Accessibility:</strong> Keyboard navigation, ARIA labels, proper contrast</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Component Architecture (11 Components)</h3>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>1. NYTChatWidget (root orchestrator)</li>
                        <li>2. NYTWidgetCollapsed (compact state)</li>
                        <li>3. NYTWidgetExpanded (full interface)</li>
                        <li>4. SuggestionCategories (category pills grid)</li>
                        <li>5. CategoryPill (individual suggestion)</li>
                        <li>6. AutocompleteList (live suggestions)</li>
                        <li>7. AutocompleteSuggestion (suggestion item)</li>
                        <li>8. AnswerDisplay (complete answer section)</li>
                        <li>9. StreamingAnswer (animated text reveal)</li>
                        <li>10. CitationPills (source attribution)</li>
                        <li>11. LoadingIndicator (multi-stage animation)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Code</CardTitle>
                <CardDescription>
                  Copy this example to integrate the NYT Chat Widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={codeExample} language="tsx" />

                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold">TypeScript Types</h3>
                  <CodeBlock
                    code={`interface NYTChatWidgetProps {
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  defaultExpanded?: boolean;
  collapsedText?: string;
  title?: string;
  suggestionCategories?: string[];
  placeholder?: string;
  followUpPlaceholder?: string;
  brandingText?: string;
  onSubmit?: (query: string) => void;
  onCategoryClick?: (category: string) => void;
  onCitationClick?: (citation: string) => void;
  className?: string;
}`}
                    language="typescript"
                  />

                  <h3 className="font-semibold mt-6">State Machine Flow</h3>
                  <CodeBlock
                    code={`// Widget State: collapsed | search | loading | answer

collapsed → search:   User clicks expand button
search → loading:     User submits query (or clicks category)
loading → answer:     API response received
answer → search:      User asks follow-up question
answer → collapsed:   User closes widget`}
                    language="text"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
