"use client";

import { useState } from "react";
import { EaterWidget } from "@/components/widget_components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

export default function EaterWidgetPreviewPage() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  // Custom seed questions for variant demo
  const customSeedQuestions = [
    "Best Italian restaurants in NYC?",
    "Where to find authentic ramen?",
    "Top food festivals this summer?",
    "Wine pairing recommendations?",
    "Farm-to-table restaurants nearby?",
  ];

  const handleCopyCode = async () => {
    const code = `import { EaterWidget } from "@/components/widget_components";

export default function Page() {
  return (
    <EaterWidget
      defaultExpanded={false}
    />
  );
}

// Widget automatically navigates to /womens-world/answers?q=<question> on submit`;

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Eater Widget</h1>
            <p className="text-muted-foreground text-lg">
              Food and restaurant discovery AI assistant with Eater branding
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Complete Widget</Badge>
            <Badge variant="outline">React 19.2</Badge>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge className="bg-[#E60001] hover:bg-[#E60001]/90">Eater Red #E60001</Badge>
          <Badge variant="secondary">Degular Typography</Badge>
          <Badge variant="secondary">Literata Font</Badge>
          <Badge variant="outline">132px Border Radius</Badge>
        </div>
      </div>

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>
                Test the Eater Widget with full interaction. Click seed questions to populate input,
                type your own questions, and submit. <strong>Submit button navigates to Women&apos;s World Answer Page.</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={isExpanded ? "default" : "outline"}
                  onClick={() => setIsExpanded(true)}
                  size="sm"
                >
                  Expanded
                </Button>
                <Button
                  variant={!isExpanded ? "default" : "outline"}
                  onClick={() => setIsExpanded(false)}
                  size="sm"
                >
                  Collapsed
                </Button>
              </div>

              <div className="border rounded-lg p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
                <EaterWidget
                  isExpanded={isExpanded}
                  onExpandChange={setIsExpanded}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Variant</CardTitle>
              <CardDescription>
                Standard configuration with 3 default seed questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-gray-50">
                <EaterWidget
                  defaultExpanded={true}
                  onSubmit={(question: string) => console.log("Default variant:", question)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Seed Questions</CardTitle>
              <CardDescription>
                Widget with 5 custom restaurant-related questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-gray-50">
                <EaterWidget
                  defaultExpanded={true}
                  seedQuestions={customSeedQuestions}
                  onSubmit={(question: string) => console.log("Custom variant:", question)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collapsed State</CardTitle>
              <CardDescription>
                Widget starts in collapsed button state, expands on click
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-[200px]">
                <EaterWidget
                  defaultExpanded={false}
                  collapsedText="Ask Eater Anything"
                  onSubmit={(question: string) => console.log("Collapsed variant:", question)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usage Example</CardTitle>
                  <CardDescription>Copy and paste this code to use the Eater Widget</CardDescription>
                </div>
                <Button onClick={handleCopyCode} size="sm" variant="outline">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import { EaterWidget } from "@/components/widget_components";

export default function Page() {
  return (
    <EaterWidget
      defaultExpanded={false}
      onSubmit={(question) => {
        console.log("User asked:", question);
        // Send to API endpoint
      }}
    />
  );
}`}</code>
              </pre>

              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">Custom Configuration</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{`<EaterWidget
  isExpanded={isOpen}
  onExpandChange={setIsOpen}
  title="Ask Eater with AI"
  placeholder="Ask about restaurants, food, recipes..."
  seedQuestions={[
    "Best Italian restaurants in NYC?",
    "Wine pairing for steak?",
    "Top food festivals this summer?"
  ]}
  onSubmit={(question) => handleSubmit(question)}
/>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="props" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Props</CardTitle>
              <CardDescription>
                All available props for the EaterWidget component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Prop</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Default</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">isExpanded</td>
                      <td className="py-3 px-4 font-mono text-xs">boolean?</td>
                      <td className="py-3 px-4 font-mono text-xs">undefined</td>
                      <td className="py-3 px-4">Controlled expand state</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">onExpandChange</td>
                      <td className="py-3 px-4 font-mono text-xs">(expanded: boolean) =&gt; void</td>
                      <td className="py-3 px-4 font-mono text-xs">undefined</td>
                      <td className="py-3 px-4">Callback when expand state changes</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">defaultExpanded</td>
                      <td className="py-3 px-4 font-mono text-xs">boolean</td>
                      <td className="py-3 px-4 font-mono text-xs">false</td>
                      <td className="py-3 px-4">Initial expanded state (uncontrolled)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">collapsedText</td>
                      <td className="py-3 px-4 font-mono text-xs">string</td>
                      <td className="py-3 px-4 font-mono text-xs">"Ask Eater"</td>
                      <td className="py-3 px-4">Text shown in collapsed button state</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">title</td>
                      <td className="py-3 px-4 font-mono text-xs">string</td>
                      <td className="py-3 px-4 font-mono text-xs">"Ask Eater with AI"</td>
                      <td className="py-3 px-4">Main widget title</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">placeholder</td>
                      <td className="py-3 px-4 font-mono text-xs">string</td>
                      <td className="py-3 px-4 font-mono text-xs">"Ask Anything"</td>
                      <td className="py-3 px-4">Search input placeholder</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">seedQuestions</td>
                      <td className="py-3 px-4 font-mono text-xs">string[]</td>
                      <td className="py-3 px-4 font-mono text-xs">[3 default questions]</td>
                      <td className="py-3 px-4">Pre-populated seed questions with squiggle underlines</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">onSubmit</td>
                      <td className="py-3 px-4 font-mono text-xs">(question: string) =&gt; void</td>
                      <td className="py-3 px-4 font-mono text-xs">undefined</td>
                      <td className="py-3 px-4">Callback when question is submitted</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">className</td>
                      <td className="py-3 px-4 font-mono text-xs">string</td>
                      <td className="py-3 px-4 font-mono text-xs">undefined</td>
                      <td className="py-3 px-4">Additional CSS classes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Design Tokens</CardTitle>
              <CardDescription>
                Brand colors and typography used in the widget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: "#E60001" }}></div>
                    <div>
                      <div className="font-mono text-xs">#E60001</div>
                      <div className="text-xs text-muted-foreground">Eater Red (Primary)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: "#FFFFFF" }}></div>
                    <div>
                      <div className="font-mono text-xs">#FFFFFF</div>
                      <div className="text-xs text-muted-foreground">White (Background)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: "#414141" }}></div>
                    <div>
                      <div className="font-mono text-xs">#414141</div>
                      <div className="text-xs text-muted-foreground">Dark Gray (Pills)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border bg-black/50"></div>
                    <div>
                      <div className="font-mono text-xs">rgba(0,0,0,0.5)</div>
                      <div className="text-xs text-muted-foreground">Button Background</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Typography</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Title:</strong> Degular 32px Bold</li>
                  <li><strong>Input:</strong> Literata 14px Regular</li>
                  <li><strong>Pills:</strong> Degular 12px Semi-Bold Uppercase (0.24px letter-spacing)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Measurements</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Max Width:</strong> 977px</li>
                  <li><strong>Input Height:</strong> 53px</li>
                  <li><strong>Border Radius:</strong> 132px (ultra-rounded pill)</li>
                  <li><strong>Submit Button:</strong> 32px diameter circular</li>
                  <li><strong>Border:</strong> 2px solid #E60001</li>
                  <li><strong>Squiggle Width:</strong> 114px</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Eater red (#E60001) brand color throughout</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Premium Degular and Literata typography</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Signature red squiggle underlines on pills</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Ultra-rounded 132px pill-shaped input</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Circular dark submit button (32px)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Controlled/uncontrolled expansion modes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Seed question pills with click-to-populate</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Keyboard navigation (Enter to submit)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Accessible ARIA labels and focus states</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E60001] mt-2"></div>
              <span>Responsive design with max-width constraint</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
