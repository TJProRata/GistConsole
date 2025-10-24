# Chore: Integrate Women's World Widget into Preview Flow with Color Controls

## Chore Description
Replace the placeholder Women's World widget in the preview flow with the actual `WomensWorldWidget` component from `components/widget_components/complete/womens-world-widget.tsx`. Update the configure page to include color configuration controls similar to those in the admin page, and make the Women's World widget responsive to gradient color settings by applying CSS variables for the gradient background.

Currently, the preview flow shows a basic placeholder sidebar for the Women's World widget type. The chore involves:
1. Replacing the placeholder in `PreviewWidgetRenderer` with the actual `WomensWorldWidget` component
2. Adding Women's World-specific configuration controls to the configure page (seed questions, carousel settings)
3. Making the widget gradient colors customizable via the existing color picker
4. Ensuring the widget responds to gradient color changes using CSS variables

## Relevant Files
Use these files to resolve the chore:

- **`components/PreviewWidgetRenderer.tsx`** - Widget renderer that currently shows a placeholder for Women's World widget. Needs to be updated to render the actual `WomensWorldWidget` component.

- **`components/widget_components/complete/womens-world-widget.tsx`** - The actual Women's World widget component with auto-scrolling carousel, glassmorphism input, and health Q&A interface. This is the component we need to integrate.

- **`app/preview/configure/page.tsx`** - Preview configuration page with tabs for appearance, behavior, and content. Currently configured for NYT Chat widget text customization. Needs Women's World-specific controls in the Content tab.

- **`app/globals.css`** - Global CSS with CSS variables for gradients. Contains `--gradient-womens-world` variable that the Women's World widget uses. Need to make this dynamic based on user color selection.

- **`convex/previewConfigurations.ts`** - Convex mutations/queries for preview configurations. May need to add Women's World-specific fields to the configuration schema (seed questions, auto-scroll interval).

- **`convex/schema.ts`** - Convex schema defining the `previewConfigurations` table structure. May need to add Women's World-specific optional fields.

- **`components/widget_components/types.ts`** - TypeScript types for widget components including `WomensWorldWidgetProps`. Referenced to understand what props the widget accepts.

### New Files
No new files need to be created. All changes are modifications to existing files.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Convex Schema for Women's World Configuration
Add Women's World-specific fields to the preview configuration schema to support seed questions and carousel auto-scroll interval.

- Open `convex/schema.ts`
- Locate the `previewConfigurations` table definition (around line 219)
- Add the following optional fields to the `configuration` object schema (after line 269):
  - `seedQuestions: v.optional(v.array(v.string()))` - Array of seed question strings for carousel
  - `autoScrollInterval: v.optional(v.number())` - Milliseconds for carousel auto-scroll
- Save the file

### Step 2: Update Convex Mutations Schema
Update the configuration schema in `convex/previewConfigurations.ts` to match the schema changes.

- Open `convex/previewConfigurations.ts`
- Locate the `configurationSchema` constant (around line 5)
- Add the same Women's World-specific fields after the NYT Chat Widget fields (after line 32):
  - `seedQuestions: v.optional(v.array(v.string()))`
  - `autoScrollInterval: v.optional(v.number())`
- Save the file

### Step 3: Update PreviewWidgetRenderer Interface
Add Women's World fields to the TypeScript interface in PreviewWidgetRenderer.

- Open `components/PreviewWidgetRenderer.tsx`
- Locate the `WidgetConfiguration` interface (around line 10)
- Add Women's World-specific fields after the NYT Chat Widget fields (after line 33):
  ```typescript
  // Women's World Widget Configuration
  seedQuestions?: string[];
  autoScrollInterval?: number;
  ```
- Save the file

### Step 4: Update PreviewWidgetRenderer to Import and Use WomensWorldWidget
Replace the placeholder Women's World widget sidebar with the actual `WomensWorldWidget` component.

- Open `components/PreviewWidgetRenderer.tsx`
- Add import for `WomensWorldWidget` from `@/components/widget_components` at the top (after line 8):
  ```typescript
  import { RufusWidget, NYTChatWidget, WomensWorldWidget } from "@/components/widget_components";
  ```
- Locate the `womensWorld` widget type condition (around line 158)
- Replace the entire placeholder implementation (lines 159-198) with:
  ```tsx
  // Women's World Widget (bottom-right position)
  if (widgetType === "womensWorld") {
    const positionClasses = isDemo
      ? "fixed bottom-4 right-4 z-50"
      : "absolute bottom-4 right-4";

    // Inject CSS variable override for gradient colors
    const gradientOverride = configuration.useGradient && configuration.gradientStart && configuration.gradientEnd
      ? `--gradient-womens-world: linear-gradient(180deg, ${configuration.gradientStart}, ${configuration.gradientEnd});`
      : '';

    return (
      <>
        {gradientOverride && (
          <style>{`
            :root {
              ${gradientOverride}
            }
          `}</style>
        )}
        <div className={cn(positionClasses, className)}>
          <WomensWorldWidget
            collapsedText={configuration.collapsedText || "Ask AI"}
            title={configuration.title || "✨ Woman's World Answers"}
            placeholder={configuration.placeholder || "Ask us your health questions"}
            seedQuestions={configuration.seedQuestions}
            autoScrollInterval={configuration.autoScrollInterval || 3000}
            brandingText={configuration.brandingText || "Powered by Gist.ai"}
            width={configuration.width || 392}
            height={configuration.height}
            onSubmit={(question) => console.log("Preview: Question submitted:", question)}
          />
        </div>
      </>
    );
  }
  ```
- Save the file

### Step 5: Add Women's World Configuration State
Add state management for Women's World-specific settings in the configure page.

- Open `app/preview/configure/page.tsx`
- After the `nytConfig` state declaration (around line 63), add a new state for Women's World config:
  ```typescript
  const [womensWorldConfig, setWomensWorldConfig] = useState({
    collapsedText: "Ask AI",
    title: "✨ Woman's World Answers",
    placeholder: "Ask us your health questions",
    seedQuestions: [
      "What's the best bread for weight loss?",
      "How can I make Hamburger Helper healthier?",
      "Can I prevent dementia?",
      "Is there a link between trauma and autoimmune symptoms?",
      "What are natural ways to boost energy?",
      "How do I improve my gut health?",
    ],
    autoScrollInterval: 3000,
    brandingText: "Powered by Gist.ai",
  });
  ```
- Save the file

### Step 6: Load Women's World Configuration from Preview
Update the `useEffect` that loads preview configuration to include Women's World settings.

- Open `app/preview/configure/page.tsx`
- Locate the `useEffect` that loads `previewConfig` (around line 65)
- After loading `nytConfig` (around line 89), add logic to load Women's World config:
  ```typescript
  setWomensWorldConfig({
    collapsedText: config.collapsedText ?? "Ask AI",
    title: config.title ?? "✨ Woman's World Answers",
    placeholder: config.placeholder ?? "Ask us your health questions",
    seedQuestions: config.seedQuestions ?? [
      "What's the best bread for weight loss?",
      "How can I make Hamburger Helper healthier?",
      "Can I prevent dementia?",
      "Is there a link between trauma and autoimmune symptoms?",
      "What are natural ways to boost energy?",
      "How do I improve my gut health?",
    ],
    autoScrollInterval: config.autoScrollInterval ?? 3000,
    brandingText: config.brandingText ?? "Powered by Gist.ai",
  });
  ```
- Save the file

### Step 7: Save Women's World Configuration
Update the debounced save effect to include Women's World configuration.

- Open `app/preview/configure/page.tsx`
- Locate the debounced save `useEffect` (around line 95)
- Update the configuration object to conditionally include Women's World config (replace lines 100-110):
  ```typescript
  await updateConfig({
    sessionId,
    configuration: {
      ...colorConfig,
      placement,
      width: width[0],
      height: height[0],
      textColor: "#ffffff",
      ...(previewConfig.widgetType === "floating" ? nytConfig : womensWorldConfig),
    },
  });
  ```
- Add `womensWorldConfig` to the dependency array (line 117):
  ```typescript
  }, [sessionId, colorConfig, placement, width, height, nytConfig, womensWorldConfig, previewConfig, updateConfig]);
  ```
- Save the file

### Step 8: Add Women's World Content Tab Controls
Create Women's World-specific content controls in the Content tab.

- Open `app/preview/configure/page.tsx`
- Locate the `TabsContent value="content"` section (around line 250)
- Replace the entire content tab section with conditional rendering based on widget type:
  ```tsx
  <TabsContent value="content" className="space-y-6">
    {/* NYT Chat Widget Controls */}
    {previewConfig.widgetType === "floating" && (
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Widget Text Customization</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="collapsedText">Collapsed Button Text</Label>
            <Input
              id="collapsedText"
              value={nytConfig.collapsedText}
              onChange={(e) =>
                setNytConfig({ ...nytConfig, collapsedText: e.target.value })
              }
              placeholder="Ask"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Text shown on the collapsed button
            </p>
          </div>

          <div>
            <Label htmlFor="title">Widget Title</Label>
            <Input
              id="title"
              value={nytConfig.title}
              onChange={(e) =>
                setNytConfig({ ...nytConfig, title: e.target.value })
              }
              placeholder="Ask Anything!"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Main title shown in the expanded widget
            </p>
          </div>

          <div>
            <Label htmlFor="placeholder">Search Placeholder</Label>
            <Input
              id="placeholder"
              value={nytConfig.placeholder}
              onChange={(e) =>
                setNytConfig({ ...nytConfig, placeholder: e.target.value })
              }
              placeholder="Ask anything"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Placeholder text for the search input
            </p>
          </div>

          <div>
            <Label htmlFor="followUpPlaceholder">Follow-up Placeholder</Label>
            <Input
              id="followUpPlaceholder"
              value={nytConfig.followUpPlaceholder}
              onChange={(e) =>
                setNytConfig({ ...nytConfig, followUpPlaceholder: e.target.value })
              }
              placeholder="Ask a follow up..."
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Placeholder for follow-up questions
            </p>
          </div>

          <div>
            <Label htmlFor="brandingText">Branding Text</Label>
            <Input
              id="brandingText"
              value={nytConfig.brandingText}
              onChange={(e) =>
                setNytConfig({ ...nytConfig, brandingText: e.target.value })
              }
              placeholder="Powered by Gist Answers"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Footer branding text
            </p>
          </div>

          <div>
            <Label htmlFor="suggestionCategories">Suggestion Categories</Label>
            <Textarea
              id="suggestionCategories"
              value={nytConfig.suggestionCategories.join(", ")}
              onChange={(e) =>
                setNytConfig({
                  ...nytConfig,
                  suggestionCategories: e.target.value
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Top Stories, Breaking News, Sports, Technology"
              className="mt-2"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Comma-separated list of suggestion categories
            </p>
          </div>
        </div>
      </Card>
    )}

    {/* Women's World Widget Controls */}
    {previewConfig.widgetType === "womensWorld" && (
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Women's World Widget Customization</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ww-collapsedText">Collapsed Button Text</Label>
            <Input
              id="ww-collapsedText"
              value={womensWorldConfig.collapsedText}
              onChange={(e) =>
                setWomensWorldConfig({ ...womensWorldConfig, collapsedText: e.target.value })
              }
              placeholder="Ask AI"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Text shown on the collapsed button
            </p>
          </div>

          <div>
            <Label htmlFor="ww-title">Widget Title</Label>
            <Input
              id="ww-title"
              value={womensWorldConfig.title}
              onChange={(e) =>
                setWomensWorldConfig({ ...womensWorldConfig, title: e.target.value })
              }
              placeholder="✨ Woman's World Answers"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Main title shown in the expanded widget
            </p>
          </div>

          <div>
            <Label htmlFor="ww-placeholder">Search Placeholder</Label>
            <Input
              id="ww-placeholder"
              value={womensWorldConfig.placeholder}
              onChange={(e) =>
                setWomensWorldConfig({ ...womensWorldConfig, placeholder: e.target.value })
              }
              placeholder="Ask us your health questions"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Placeholder text for the search input
            </p>
          </div>

          <div>
            <Label htmlFor="ww-brandingText">Branding Text</Label>
            <Input
              id="ww-brandingText"
              value={womensWorldConfig.brandingText}
              onChange={(e) =>
                setWomensWorldConfig({ ...womensWorldConfig, brandingText: e.target.value })
              }
              placeholder="Powered by Gist.ai"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Footer branding text
            </p>
          </div>

          <div>
            <Label htmlFor="ww-seedQuestions">Seed Questions</Label>
            <Textarea
              id="ww-seedQuestions"
              value={womensWorldConfig.seedQuestions.join("\n")}
              onChange={(e) =>
                setWomensWorldConfig({
                  ...womensWorldConfig,
                  seedQuestions: e.target.value
                    .split("\n")
                    .map((q) => q.trim())
                    .filter(Boolean),
                })
              }
              placeholder="One question per line"
              className="mt-2"
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter one seed question per line for the carousel
            </p>
          </div>

          <div>
            <Label>Auto-scroll Interval: {womensWorldConfig.autoScrollInterval}ms</Label>
            <Slider
              value={[womensWorldConfig.autoScrollInterval]}
              onValueChange={([value]) =>
                setWomensWorldConfig({ ...womensWorldConfig, autoScrollInterval: value })
              }
              min={1000}
              max={10000}
              step={500}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              How often the carousel auto-scrolls (1-10 seconds)
            </p>
          </div>
        </div>
      </Card>
    )}

    {/* Rufus Widget Controls */}
    {previewConfig.widgetType === "rufus" && (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Rufus widget uses default configuration. Customize colors in the Appearance tab.
        </p>
      </Card>
    )}
  </TabsContent>
  ```
- Save the file

### Step 9: Update Preview Renderer to Pass Women's World Config
Update the live preview renderer to pass Women's World configuration.

- Open `app/preview/configure/page.tsx`
- Locate the `PreviewWidgetRenderer` component usage (around line 388)
- Update the configuration prop to conditionally pass the right config:
  ```tsx
  <PreviewWidgetRenderer
    widgetType={previewConfig.widgetType}
    configuration={{
      ...colorConfig,
      placement,
      width: width[0],
      height: height[0],
      textColor: "#ffffff",
      ...(previewConfig.widgetType === "floating" ? nytConfig : womensWorldConfig),
    }}
  />
  ```
- Save the file

### Step 10: Run Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- Stop any running dev servers
- Run `bun run build` to validate TypeScript and build errors
- Run `npx convex dev` in terminal 1 to deploy schema changes
- Run `bun dev` in terminal 2 to start Next.js dev server
- Navigate to `/preview` flow in browser
- Select "Women's World" widget type
- Verify the configure page shows Women's World-specific content controls
- Test changing gradient colors and verify widget updates in live preview
- Test changing seed questions and auto-scroll interval
- Click "Preview in Demo" and verify widget renders correctly on demo page
- Test expanding/collapsing the widget
- Test clicking seed question pills to populate input
- Verify carousel auto-scrolls at configured interval
- Verify hover-to-pause functionality works
- Test dark mode toggle on widget

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete
- Manual validation steps:
  - Navigate to `/preview` and complete the API key step
  - Select "Women's World" widget type
  - Verify configure page loads with Women's World content controls
  - Change gradient colors via ColorGradientPicker and verify widget updates
  - Edit seed questions and verify they update in carousel
  - Change auto-scroll interval and verify carousel timing changes
  - Navigate to demo page and verify widget renders with custom configuration
  - Test widget interactions (expand, collapse, click pills, carousel scroll/pause)
  - Verify no console errors or TypeScript warnings

## Notes

### Color System Integration
- The Women's World widget uses a CSS variable `--gradient-womens-world` defined in `globals.css`
- To make it responsive to user color selection, we inject a `<style>` tag with CSS variable override
- The widget's expanded state uses `background: var(--gradient-womens-world)` in its container style
- When `useGradient` is true and gradient colors are provided, we override the CSS variable dynamically

### Widget Props Mapping
- The `WomensWorldWidget` component accepts these key props:
  - `collapsedText` - Button text when collapsed (default: "Ask AI")
  - `title` - Widget title when expanded (default: "✨ Woman's World Answers")
  - `placeholder` - Input placeholder text (default: "Ask us your health questions")
  - `seedQuestions` - Array of seed question strings for carousel (optional, uses defaults if not provided)
  - `autoScrollInterval` - Milliseconds for carousel auto-scroll (default: 3000)
  - `brandingText` - Footer branding text (default: "Powered by Gist.ai")
  - `width` - Widget width in pixels (default: 392)
  - `height` - Widget height in pixels (optional, auto if not specified)
  - `onSubmit` - Callback when user submits a question

### Positioning
- The Women's World widget should use bottom-right positioning (like NYT Chat widget)
- Not sidebar positioning as the placeholder currently shows
- The widget is self-contained and manages its own expand/collapse state

### Configuration Persistence
- All configuration changes are auto-saved with 500ms debounce
- Preview configurations expire after 24 hours
- On sign-up, preview config is converted to user config via `convertPreviewToUserConfig` mutation

### Type Safety
- Ensure all new fields are added to both the Convex schema and TypeScript interfaces
- The `configurationSchema` in `previewConfigurations.ts` must match the schema in `schema.ts`
- The `WidgetConfiguration` interface in `PreviewWidgetRenderer.tsx` must include all fields

### Seed Questions Format
- In the configure page, seed questions are entered as newline-separated text (easier UX)
- When saving/loading, they're stored as an array of strings
- Split on `\n` and filter out empty lines when converting from textarea to array
- Join with `\n` when converting from array to textarea display
