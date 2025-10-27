# Chore: Align Women's World Admin Widget Configuration with Preview Configure Page

## Chore Description

The admin widget preview page (`/admin/components/widgets/complete/womens-world-widget`) currently only has a simple width slider for dimension control. This needs to be enhanced to match the comprehensive configuration interface found in the preview configure page (`/preview/configure`), which includes:

1. **Content Tab Controls** - Already in preview/configure but missing in admin:
   - Collapsed button text
   - Widget title
   - Search placeholder
   - Branding text
   - Seed questions (textarea with one per line)
   - Auto-scroll interval slider (1000-10000ms)

2. **New Features to Add** - Currently not configurable anywhere:
   - Seed questions speed control (already exists in preview but needs better UX)
   - Individual seed question editing/management

The goal is to create a consistent, comprehensive configuration experience in the admin panel that matches (and potentially exceeds) the preview configure page, while adding new controls for seed question speed and question management.

## Relevant Files

### Existing Files to Modify

- **`app/admin/components/widgets/complete/[widget]/page.tsx`** (lines 164-188)
  - Currently has basic width slider for womens-world-widget
  - Needs enhancement with tabbed interface (Appearance, Behavior, Content)
  - Add state management for all configuration options
  - Pass configuration props to WomensWorldWidgetDemo component

- **`components/component-previews/widget-demos.tsx`** (lines 272-291)
  - `WomensWorldWidgetDemo` function currently accepts width/height props
  - Needs to accept full configuration object matching WomensWorldWidgetProps
  - Pass configuration to WomensWorldWidget component

- **`components/widget_components/complete/womens-world-widget.tsx`** (entire file)
  - Already accepts all necessary props via WomensWorldWidgetProps
  - No changes needed - component is already fully configurable

- **`components/widget_components/types.ts`** (lines 113-152)
  - WomensWorldWidgetProps type definition
  - Already has all necessary properties defined
  - No changes needed - types are complete

### Reference Files (No Changes Needed)

- **`app/preview/configure/page.tsx`** (lines 393-502)
  - Women's World Widget Controls section (Content tab)
  - Provides UI pattern reference for:
    - Text inputs (collapsedText, title, placeholder, brandingText)
    - Textarea for seed questions (line-separated)
    - Slider for autoScrollInterval (1000-10000ms, 500ms steps)
  - This is the design pattern to replicate in admin

## Step by Step Tasks

### Step 1: Add State Management to Admin Widget Page

Update `app/admin/components/widgets/complete/[widget]/page.tsx` to add comprehensive state management for Women's World Widget configuration:

- Add state variables for all widget configuration options:
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
- Keep existing `widgetWidth` state for dimension control

### Step 2: Replace Simple Slider with Tabbed Configuration Interface

Replace the current dimension controls section (lines 164-188) with a comprehensive tabbed interface:

- Import required components:
  ```typescript
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  ```

- Create three tabs structure:
  - **Appearance Tab**: Width slider (existing functionality)
  - **Behavior Tab**: Auto-scroll interval slider
  - **Content Tab**: Text inputs and seed questions textarea

### Step 3: Build Appearance Tab

Implement the Appearance tab with dimension controls:

- Move existing width slider into this tab
- Keep range 392-800px with 8px steps
- Maintain current label format showing pixel value
- Add helper text explaining preview-only nature

### Step 4: Build Behavior Tab

Create the Behavior tab for interaction settings:

- Add auto-scroll interval slider:
  - Label: "Auto-scroll Interval: {value}ms"
  - Range: 1000-10000ms
  - Step: 500ms
  - Helper text: "How often the carousel auto-scrolls (1-10 seconds)"
  - Update handler: `setWomensWorldConfig({ ...womensWorldConfig, autoScrollInterval: value })`

### Step 5: Build Content Tab

Implement the Content tab with all text customization options:

- **Collapsed Button Text** input:
  - Label: "Collapsed Button Text"
  - Value: `womensWorldConfig.collapsedText`
  - Placeholder: "Ask AI"
  - Helper text: "Text shown on the collapsed button"

- **Widget Title** input:
  - Label: "Widget Title"
  - Value: `womensWorldConfig.title`
  - Placeholder: "✨ Woman's World Answers"
  - Helper text: "Main title shown in the expanded widget"

- **Search Placeholder** input:
  - Label: "Search Placeholder"
  - Value: `womensWorldConfig.placeholder`
  - Placeholder: "Ask us your health questions"
  - Helper text: "Placeholder text for the search input"

- **Branding Text** input:
  - Label: "Branding Text"
  - Value: `womensWorldConfig.brandingText`
  - Placeholder: "Powered by Gist.ai"
  - Helper text: "Footer branding text"

- **Seed Questions** textarea:
  - Label: "Seed Questions"
  - Value: `womensWorldConfig.seedQuestions.join("\n")`
  - Rows: 6
  - Placeholder: "One question per line"
  - Helper text: "Enter one seed question per line for the carousel"
  - Update handler: Split by newline, trim, filter empty

### Step 6: Update WomensWorldWidgetDemo Props

Modify `components/component-previews/widget-demos.tsx` to accept and pass full configuration:

- Update `WomensWorldWidgetDemo` function signature:
  ```typescript
  export function WomensWorldWidgetDemo(props?: {
    width?: number;
    height?: number;
    collapsedText?: string;
    title?: string;
    placeholder?: string;
    seedQuestions?: string[];
    autoScrollInterval?: number;
    brandingText?: string;
  })
  ```

- Pass all props to `WomensWorldWidget` component:
  ```typescript
  <WomensWorldWidget
    isExpanded={isExpanded}
    onExpandChange={setIsExpanded}
    onSubmit={(question) => console.log("Question submitted:", question)}
    width={props?.width}
    height={props?.height}
    collapsedText={props?.collapsedText}
    title={props?.title}
    placeholder={props?.placeholder}
    seedQuestions={props?.seedQuestions}
    autoScrollInterval={props?.autoScrollInterval}
    brandingText={props?.brandingText}
  />
  ```

### Step 7: Connect Configuration to Demo Component

Update the demo component rendering in `app/admin/components/widgets/complete/[widget]/page.tsx`:

- Pass all configuration options to `WomensWorldWidgetDemo`:
  ```typescript
  {widget === "womens-world-widget" ? (
    <DemoComponent
      width={widgetWidth}
      {...womensWorldConfig}
    />
  ) : (
    <DemoComponent />
  )}
  ```

### Step 8: Run Validation Commands

Execute all validation commands to ensure the chore is complete with zero regressions:

- Run `bun run build` to validate TypeScript and build
- Start `npx convex dev` in background
- Start `bun dev` and manually test:
  - Navigate to `/admin/components/widgets/complete/womens-world-widget`
  - Verify all three tabs render correctly
  - Test Appearance tab width slider
  - Test Behavior tab auto-scroll slider
  - Test Content tab all inputs and textarea
  - Verify live preview updates with configuration changes
  - Test seed questions textarea (add/remove/edit questions)
  - Verify collapsed state shows configured text
  - Verify expanded state shows all configured values
- Compare with `/preview/configure` page for consistency

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate:
  - Navigate to `/admin/components/widgets/complete/womens-world-widget`
  - Test all three tabs (Appearance, Behavior, Content)
  - Verify width slider works (392-800px range)
  - Verify auto-scroll interval slider works (1000-10000ms range)
  - Verify all text inputs update widget in real-time
  - Verify seed questions textarea with line-separated input
  - Test adding/removing seed questions
  - Test empty/invalid states
  - Compare configuration UI with `/preview/configure` for consistency
  - Verify no console errors or warnings

## Notes

### Design Patterns to Follow

1. **Tab Structure**: Use shadcn/ui Tabs component with three tabs (Appearance, Behavior, Content)
2. **Input Patterns**: Follow preview/configure page patterns:
   - Label above input with htmlFor attribute
   - Helper text below input in text-xs text-muted-foreground
   - Consistent spacing with space-y-4 on container
3. **Slider Pattern**: Label with inline value display (e.g., "Width: 392px")
4. **Textarea Pattern**: Line-separated input with split/join logic for array conversion

### Configuration Persistence

This chore focuses on local state management for live preview. Future enhancements may include:
- Saving widget configurations to Convex database
- Loading saved configurations on page mount
- Configuration templates/presets

### Seed Questions Management

The textarea approach provides simple editing:
- One question per line
- Empty lines filtered out automatically
- Real-time preview updates as user types
- Future enhancement: drag-and-drop reordering with dedicated question list UI

### Auto-scroll Behavior

The autoScrollInterval prop controls carousel speed:
- Lower values (1000-3000ms) = faster scrolling
- Higher values (5000-10000ms) = slower scrolling
- Default: 3000ms (3 seconds per cycle)
- The widget already implements pause-on-hover functionality

### Responsive Behavior

The widget configuration affects:
- Collapsed state: collapsedText only
- Expanded state: All other properties (title, placeholder, seedQuestions, etc.)
- Both states are fully controllable via the admin panel
