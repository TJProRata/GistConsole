import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireAdmin } from "./admin";

/**
 * Component Preview Queries (Admin-Only)
 *
 * Provides detailed component metadata including code snippets and navigation
 * for the component preview pages.
 */

// UI component data with code snippets and metadata
const UI_COMPONENTS_DATA = [
  {
    name: "accordion",
    description: "A vertically stacked set of interactive headings that each reveal a section of content.",
    category: "shadcn/ui",
    code: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that you can customize.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
  },
  {
    name: "alert",
    description: "Displays a callout for user attention.",
    category: "shadcn/ui",
    code: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function AlertDemo() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}`,
  },
  {
    name: "badge",
    description: "Displays a badge or a component that looks like a badge.",
    category: "shadcn/ui",
    code: `import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}`,
  },
  {
    name: "button",
    description: "Displays a button or a component that looks like a button.",
    category: "shadcn/ui",
    code: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}`,
  },
  {
    name: "card",
    description: "Displays a card with header, content, and footer.",
    category: "shadcn/ui",
    code: `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}`,
  },
  {
    name: "carousel",
    description: "A carousel with motion and swipe built using Embla.",
    category: "shadcn/ui",
    code: `import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}`,
  },
  {
    name: "checkbox",
    description: "A control that allows the user to toggle between checked and not checked.",
    category: "shadcn/ui",
    code: `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}`,
  },
  {
    name: "dialog",
    description: "A window overlaid on either the primary window or another dialog window.",
    category: "shadcn/ui",
    code: `import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
  },
  {
    name: "dropdown-menu",
    description: "Displays a menu to the user — such as a set of actions or functions — triggered by a button.",
    category: "shadcn/ui",
    code: `import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
  },
  {
    name: "form",
    description: "Building forms with React Hook Form and Zod.",
    category: "shadcn/ui",
    code: `import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function FormDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input placeholder="Enter your username" />
        <p className="text-sm text-muted-foreground">This is your public display name.</p>
      </div>
      <Button>Submit</Button>
    </div>
  )
}`,
  },
  {
    name: "input",
    description: "Displays a form input field or a component that looks like an input field.",
    category: "shadcn/ui",
    code: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputDemo() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  )
}`,
  },
  {
    name: "label",
    description: "Renders an accessible label associated with controls.",
    category: "shadcn/ui",
    code: `import { Label } from "@/components/ui/label"

export function LabelDemo() {
  return (
    <div>
      <Label htmlFor="email">Your email address</Label>
    </div>
  )
}`,
  },
  {
    name: "radio-group",
    description: "A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.",
    category: "shadcn/ui",
    code: `import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}`,
  },
  {
    name: "scroll-area",
    description: "Augments native scroll functionality for custom, cross-browser styling.",
    category: "shadcn/ui",
    code: `import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i}>
            <div className="text-sm">Tag {i + 1}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}`,
  },
  {
    name: "select",
    description: "Displays a list of options for the user to pick from—triggered by a button.",
    category: "shadcn/ui",
    code: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
  },
  {
    name: "separator",
    description: "Visually or semantically separates content.",
    category: "shadcn/ui",
    code: `import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}`,
  },
  {
    name: "skeleton",
    description: "Use to show a placeholder while content is loading.",
    category: "shadcn/ui",
    code: `import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}`,
  },
  {
    name: "slider",
    description: "An input where the user selects a value from within a given range.",
    category: "shadcn/ui",
    code: `import { Slider } from "@/components/ui/slider"

export function SliderDemo() {
  return <Slider defaultValue={[50]} max={100} step={1} className="w-[60%]" />
}`,
  },
  {
    name: "table",
    description: "A responsive table component.",
    category: "shadcn/ui",
    code: `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
  },
  {
    name: "tabs",
    description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    category: "shadcn/ui",
    code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Account settings content goes here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Password settings content goes here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}`,
  },
  {
    name: "textarea",
    description: "Displays a form textarea or a component that looks like a textarea.",
    category: "shadcn/ui",
    code: `import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function TextareaDemo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  )
}`,
  },
];

// Widget component data
const WIDGET_COMPONENTS_DATA = [
  {
    name: "blue-star",
    description: "Blue star icon component",
    category: "icons",
    code: `import { BlueStar } from "@/components/widget_components/icons/blue-star"

export function BlueStarDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <BlueStar />
    </div>
  )
}`,
  },
  {
    name: "powered-by-button",
    description: "Powered by Gist.ai branding button",
    category: "icons",
    code: `import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button"

export function PoweredByButtonDemo() {
  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-purple-50">
      <PoweredByButton />
    </div>
  )
}`,
  },
  {
    name: "profile-blank",
    description: "Blank profile icon component",
    category: "icons",
    code: `import { ProfileBlank } from "@/components/widget_components/icons/profile-blank"

export function ProfileBlankDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <ProfileBlank />
    </div>
  )
}`,
  },
  {
    name: "wand",
    description: "Magic wand icon component",
    category: "icons",
    code: `import { Wand } from "@/components/widget_components/icons/wand"

export function WandDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <Wand />
    </div>
  )
}`,
  },
  {
    name: "searching-animation",
    description: "Loading animation for search",
    category: "animations",
    code: `import { SearchingAnimation } from "@/components/widget_components/animations/searching-animation"

export function SearchingAnimationDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <SearchingAnimation />
    </div>
  )
}`,
  },
  {
    name: "dual-phase-progress",
    description: "Two-phase progress indicator",
    category: "ai-elements",
    code: `import { DualPhaseProgress } from "@/components/widget_components/ai-elements/dual-phase-progress"

export function DualPhaseProgressDemo() {
  return (
    <div className="w-full max-w-md p-8">
      <DualPhaseProgress currentPhase="searching" progress={65} />
    </div>
  )
}`,
  },
  {
    name: "simple-progress-bar",
    description: "Basic progress bar component",
    category: "ai-elements",
    code: `import { SimpleProgressBar } from "@/components/widget_components/ai-elements/simple-progress-bar"

export function SimpleProgressBarDemo() {
  return (
    <div className="w-full max-w-md p-8">
      <SimpleProgressBar progress={75} />
    </div>
  )
}`,
  },
  {
    name: "readiness-score-gauge",
    description: "Visual gauge for readiness score",
    category: "ai-elements",
    code: `import { ReadinessScoreGauge } from "@/components/widget_components/ai-elements/readiness-score-gauge"

export function ReadinessScoreGaugeDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <ReadinessScoreGauge score={85} />
    </div>
  )
}`,
  },
  {
    name: "question-pill",
    description: "Reusable question button with gradient selection state and pill shape (40px border-radius)",
    category: "ai-elements",
    code: `import { QuestionPill } from "@/components/widget_components/ai-elements/question-pill"

export function QuestionPillDemo() {
  const [selected, setSelected] = React.useState(false)

  return (
    <div className="flex items-center gap-2 p-8">
      <QuestionPill
        question="What is the best diet for weight loss?"
        onClick={() => setSelected(!selected)}
        isSelected={selected}
      />
      <QuestionPill
        question="How can I improve my gut health?"
        onClick={() => {}}
        isSelected={false}
      />
    </div>
  )
}`,
  },
  {
    name: "seed-questions-carousel",
    description: "Auto-scrolling carousel for seed questions with pause-on-hover functionality using Framer Motion",
    category: "ai-elements",
    code: `import { SeedQuestionsCarousel } from "@/components/widget_components/ai-elements/seed-questions-carousel"

export function SeedQuestionsCarouselDemo() {
  const [selected, setSelected] = React.useState("")

  const questions = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "Is there a link between trauma and autoimmune symptoms?",
    "How do I improve my gut health?",
    "What are signs of vitamin deficiency?",
  ]

  return (
    <div className="w-full max-w-2xl p-8">
      <SeedQuestionsCarousel
        questions={questions}
        autoScrollInterval={35000}
        onQuestionClick={setSelected}
        selectedQuestion={selected}
      />
    </div>
  )
}`,
  },
  {
    name: "search-input-section",
    description: "Glassmorphism input with dual auto-scrolling seed question carousels, gradient border, and profile icon",
    category: "ai-elements",
    code: `import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section"

export function SearchInputSectionDemo() {
  const seedQuestionsRow1 = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "How do I improve my gut health?",
  ]

  const seedQuestionsRow2 = [
    "How can I make Hamburger Helper healthier?",
    "What are natural ways to boost energy?",
    "What foods improve sleep quality?",
  ]

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl">
      <SearchInputSection
        placeholder="Ask us your health questions"
        onSubmit={(question) => console.log("Submitted:", question)}
        seedQuestionsRow1={seedQuestionsRow1}
        seedQuestionsRow2={seedQuestionsRow2}
        autoScrollInterval={35000}
      />
    </div>
  )
}`,
  },
  {
    name: "glass-widget-container",
    description: "Glassmorphism styled container with expand/collapse",
    category: "ai-elements",
    code: `import { useState } from "react"
import { GlassWidgetContainer, GlassWidgetHeader, GlassWidgetContent, GlassWidgetFooter } from "@/components/widget_components/ai-elements/glass_widget_container"

export function GlassWidgetContainerDemo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex items-center justify-center p-8 min-h-[400px]">
      <GlassWidgetContainer
        isExpanded={isExpanded}
        onExpandChange={setIsExpanded}
        positioning="relative"
      >
        <GlassWidgetHeader>
          <h3 className="text-lg font-semibold">Widget Header</h3>
        </GlassWidgetHeader>
        <GlassWidgetContent>
          <p>Widget content goes here</p>
        </GlassWidgetContent>
        <GlassWidgetFooter>
          <button className="text-sm text-gray-600">Action</button>
        </GlassWidgetFooter>
      </GlassWidgetContainer>
    </div>
  )
}`,
  },
  {
    name: "gif-housing",
    description: "Container for animated GIF content",
    category: "ai-elements",
    code: `import { GifHousing } from "@/components/widget_components/ai-elements/gif-housing"

export function GifHousingDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <GifHousing
        gifSrc="/assets/preview.gif"
        alt="Preview animation"
      />
    </div>
  )
}`,
  },
  {
    name: "success-phase",
    description: "Success state display component",
    category: "ai-elements",
    code: `import { SuccessPhase } from "@/components/widget_components/ai-elements/success-phase"

export function SuccessPhaseDemo() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[600px]">
      <SuccessPhase onContinue={() => console.log("Continue clicked")} />
    </div>
  )
}`,
  },
  {
    name: "prompt-input",
    description: "AI prompt input field with gradient border",
    category: "ai-elements",
    code: `import { PromptInput, GradientBorderContainer, GradientPlaceholderInput, IconButton, GradientSubmitButton } from "@/components/widget_components/ai-elements/prompt-input"
import { PlusIcon, MicIcon } from "lucide-react"

export function PromptInputDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <PromptInput
        variant="glassmorphism"
        onSubmit={(message) => console.log(message)}
        maxWidth={348}
      >
        <GradientBorderContainer maxWidth={348}>
          <div className="flex items-center gap-1 px-1.5 py-2 h-12">
            <IconButton
              icon={<PlusIcon className="size-5" />}
              aria-label="Add attachment"
            />
            <GradientPlaceholderInput placeholder="Ask me anything..." />
            <IconButton
              icon={<MicIcon className="size-5" />}
              aria-label="Voice input"
            />
            <GradientSubmitButton />
          </div>
        </GradientBorderContainer>
      </PromptInput>
    </div>
  )
}`,
  },
  {
    name: "pricing-card",
    description: "Pricing plan card component",
    category: "ask-anything",
    code: `import { PricingCard } from "@/components/widget_components/ask-anything/pricing-card"

export function PricingCardDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <PricingCard
        title="Pro Plan"
        price="$29"
        features={["Feature 1", "Feature 2", "Feature 3"]}
      />
    </div>
  )
}`,
  },
];

// Query: Get UI component preview data
export const getUIComponentPreview = query({
  args: {
    componentName: v.string(),
  },
  handler: async (ctx, { componentName }) => {
    await requireAdmin(ctx);

    // Find the component data
    const componentIndex = UI_COMPONENTS_DATA.findIndex(
      (c) => c.name === componentName
    );

    if (componentIndex === -1) {
      return null;
    }

    const component = UI_COMPONENTS_DATA[componentIndex];

    // Calculate navigation
    const previousComponent =
      componentIndex > 0 ? UI_COMPONENTS_DATA[componentIndex - 1].name : null;
    const nextComponent =
      componentIndex < UI_COMPONENTS_DATA.length - 1
        ? UI_COMPONENTS_DATA[componentIndex + 1].name
        : null;

    return {
      ...component,
      navigation: {
        previous: previousComponent,
        next: nextComponent,
        total: UI_COMPONENTS_DATA.length,
        current: componentIndex + 1,
      },
    };
  },
});

// Query: Get widget component preview data
export const getWidgetComponentPreview = query({
  args: {
    widgetName: v.string(),
  },
  handler: async (ctx, { widgetName }) => {
    await requireAdmin(ctx);

    // Find the widget data
    const widgetIndex = WIDGET_COMPONENTS_DATA.findIndex(
      (w) => w.name === widgetName
    );

    if (widgetIndex === -1) {
      return null;
    }

    const widget = WIDGET_COMPONENTS_DATA[widgetIndex];

    // Calculate navigation
    const previousWidget =
      widgetIndex > 0 ? WIDGET_COMPONENTS_DATA[widgetIndex - 1].name : null;
    const nextWidget =
      widgetIndex < WIDGET_COMPONENTS_DATA.length - 1
        ? WIDGET_COMPONENTS_DATA[widgetIndex + 1].name
        : null;

    return {
      ...widget,
      navigation: {
        previous: previousWidget,
        next: nextWidget,
        total: WIDGET_COMPONENTS_DATA.length,
        current: widgetIndex + 1,
      },
    };
  },
});

// Query: Get all UI component names (for navigation)
export const getUIComponentsList = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return UI_COMPONENTS_DATA.map((c) => c.name);
  },
});

// Query: Get all widget component names (for navigation)
export const getWidgetComponentsList = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return WIDGET_COMPONENTS_DATA.map((w) => w.name);
  },
});

// Complete widgets data (full widget implementations)
const WIDGET_DATA = [
  {
    name: "onboarding-widget",
    description: "Complete multi-phase onboarding widget with 18 interactive phases",
    category: "widgets",
    phases: 18,
    componentCount: 13,
    dependencies: [
      "GlassWidgetContainer",
      "DualPhaseProgress",
      "PromptInput",
      "PricingCard",
      "GifHousing",
      "SimpleProgressBar",
      "SearchingAnimation",
      "SuccessPhase",
      "ReadinessScoreGauge",
      "PhaseNavigation",
      "BlueStar",
      "Wand",
      "PoweredByButton"
    ],
    code: `"use client";

import { useState, Fragment, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { PricingCard } from "@/components/widget_components/ask-anything/pricing-card";
import {
  GlassWidgetContainer,
  GlassWidgetHeader,
  GlassWidgetContent,
  GlassWidgetFooter
} from "@/components/widget_components/ai-elements/glass_widget_container";
import { GifHousing } from "@/components/widget_components/ai-elements/gif-housing";
import { DualPhaseProgress } from "@/components/widget_components/ai-elements/dual-phase-progress";
import {
  PromptInput,
  type PromptInputMessage,
  GradientBorderContainer,
  GradientPlaceholderInput,
  IconButton,
  GradientSubmitButton
} from "@/components/widget_components/ai-elements/prompt-input";
import { PlusIcon, MicIcon, X, Mic, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, UserCircle, Check, Loader2, Sparkles, Zap } from "lucide-react";
import { BlueStar } from "@/components/widget_components/icons/blue-star";
import { Wand } from "@/components/widget_components/icons/wand";
import { PhaseNavigation } from "@/components/ui/phase-navigation";
import { SimpleProgressBar } from "@/components/widget_components/ai-elements/simple-progress-bar";
import { SearchingAnimation } from "@/components/widget_components/animations/searching-animation";
import { SuccessPhase } from "@/components/widget_components/ai-elements/success-phase";
import { ReadinessScoreGauge } from "@/components/widget_components/ai-elements/readiness-score-gauge";

interface OnboardingWidgetProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

// Streaming text animation component
const StreamingText = ({ text, className, onComplete }: {
  text: string;
  className?: string;
  onComplete?: () => void
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const prevTextRef = useRef(text);
  const characters = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    if (prevTextRef.current !== text) {
      setHasAnimated(false);
      prevTextRef.current = text;
    }
  }, [text]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.1,
      }
    }
  };

  const child = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  if (hasAnimated) {
    return <p className={className}>{text}</p>;
  }

  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => {
        setHasAnimated(true);
        onComplete?.();
      }}
      key={text}
    >
      {characters.map((char, index) => (
        <motion.span key={\`\${char}-\${index}\`} variants={child}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

// Phase titles for navigation (phases 0-7)
const phaseTitles = [
  "Get Started",
  "Context",
  "Online Presence",
  "Socials",
  "Goals",
  "Audience",
  "[Ad] Paywall",
  "Connections",
  "Customization"
];

export function OnboardingWidget({ isExpanded, onExpandChange }: OnboardingWidgetProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [isInValidationTransition, setIsInValidationTransition] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Auto-transitions and validation timing
  useEffect(() => {
    if (currentPhase === 11) {
      const timer = setTimeout(() => setCurrentPhase(12), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPhase]);

  useEffect(() => {
    if (isInValidationTransition) {
      const targetPhase = currentPhase + 1;
      const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 1000);
      const completeTimer = setTimeout(() => {
        setIsInValidationTransition(false);
        setShowCheckmark(false);
        setCurrentPhase(targetPhase);
      }, 1800);

      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isInValidationTransition, currentPhase]);

  // ... additional phases and logic follow same pattern
  // Complete implementation with 18 phases including:
  // - Phase 0: Welcome & Get Started
  // - Phase 1-7: Form inputs & user data collection
  // - Phase 8-11: Search & validation
  // - Phase 12-14: Results & analysis
  // - Phase 15-17: Paywall & completion

  return (
    <GlassWidgetContainer
      isExpanded={isExpanded}
      onToggleExpanded={() => onExpandChange(!isExpanded)}
    >
      <GlassWidgetHeader>
        <PhaseNavigation
          currentPhase={currentPhase}
          totalPhases={8}
          phaseTitles={phaseTitles}
          onPhaseClick={setCurrentPhase}
        />
      </GlassWidgetHeader>

      <GlassWidgetContent>
        {/* Phase content rendering with AnimatePresence */}
        <AnimatePresence mode="wait">
          {/* Render current phase UI */}
        </AnimatePresence>
      </GlassWidgetContent>

      <GlassWidgetFooter>
        <PoweredByButton />
      </GlassWidgetFooter>
    </GlassWidgetContainer>
  );
}`,
  },
  {
    name: "womens-world-inline-widget",
    description: "Compact inline Q&A widget optimized for embedding between article paragraphs - always expanded, responsive width",
    category: "widgets",
    phases: 1,
    componentCount: 4,
    dependencies: [
      "SearchInputSection",
      "SeedQuestionsCarousel (x2)",
      "PoweredByButton",
      "ProfileBlank"
    ],
    code: `"use client";

import { WomensWorldInlineWidget } from "@/components/widget_components/complete/womens-world-inline-widget";

export function WomensWorldInlineWidgetDemo() {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-3xl">
        <div className="prose prose-sm mb-8">
          <p className="text-gray-600">
            This inline widget is designed to be embedded naturally within article content.
            It maintains the same Q&A functionality but with a compact, article-friendly design.
          </p>
        </div>

        <WomensWorldInlineWidget
          title="✨ Woman's World Answers"
          placeholder="Ask us your health questions"
          variant="light"
          maxWidth={640}
          onSubmit={(question) => console.log("Question submitted:", question)}
        />

        <div className="prose prose-sm mt-8">
          <p className="text-gray-600">
            Article content continues naturally after the widget, creating a seamless reading experience.
          </p>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    name: "womens-world-widget",
    description: "Health-focused Q&A widget with dual auto-scrolling seed question carousels with independent data sets",
    category: "widgets",
    phases: 1,
    componentCount: 4,
    dependencies: [
      "Carousel (x2 instances with separate data)",
      "Button",
      "PoweredByButton",
      "ProfileBlank",
      "Autoplay Plugin (x2 instances)"
    ],
    code: `"use client";

import { useState } from "react";
import { WomensWorldWidget } from "@/components/widget_components/complete/womens-world-widget";

export function WomensWorldWidgetDemo() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[600px] p-8 bg-gradient-to-br from-orange-50 to-purple-50">
      <WomensWorldWidget
        isExpanded={isExpanded}
        onExpandChange={setIsExpanded}
        onSubmit={(question) => console.log("Question submitted:", question)}
        // Row 1: Health/medical-focused questions
        seedQuestionsRow1={[
          "What's the best bread for weight loss?",
          "Can I prevent dementia?",
          "Is there a link between trauma and autoimmune symptoms?",
          "How do I improve my gut health?",
          "What are signs of vitamin deficiency?",
          "Can exercise reduce inflammation?",
        ]}
        // Row 2: Wellness/lifestyle-focused questions
        seedQuestionsRow2={[
          "How can I make Hamburger Helper healthier?",
          "What are natural ways to boost energy?",
          "Best morning routine for productivity?",
          "How much water should I drink daily?",
          "What foods improve sleep quality?",
          "Natural remedies for stress relief?",
        ]}
        autoScrollInterval={15000}
      />
    </div>
  );
}`,
  },
];

// Query: Get widget preview data (complete widgets)
export const getWidgetPreview = query({
  args: {
    widgetName: v.string(),
  },
  handler: async (ctx, { widgetName }) => {
    await requireAdmin(ctx);

    // Find the widget data
    const widgetIndex = WIDGET_DATA.findIndex(
      (w) => w.name === widgetName
    );

    if (widgetIndex === -1) {
      return null;
    }

    const widget = WIDGET_DATA[widgetIndex];

    // Calculate navigation
    const previousWidget =
      widgetIndex > 0 ? WIDGET_DATA[widgetIndex - 1].name : null;
    const nextWidget =
      widgetIndex < WIDGET_DATA.length - 1
        ? WIDGET_DATA[widgetIndex + 1].name
        : null;

    return {
      ...widget,
      navigation: {
        previous: previousWidget,
        next: nextWidget,
        total: WIDGET_DATA.length,
        current: widgetIndex + 1,
      },
    };
  },
});
