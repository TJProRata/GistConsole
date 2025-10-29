# Widget Feature Planning

Create a new plan in specs/*.md to implement the `Widget Feature` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

- You're writing a plan to implement a new widget or widget feature using React 19.2 and modern component patterns.
- Create the plan in the `specs/active/YYYY-MM-DD-HHMM-{widget-feature-name}.md` file. Name it appropriately based on the `Widget Feature`.
- Use today's date and time in YYYY-MM-DD-HHMM format (24-hour time) as the filename prefix.
- Example: For a widget feature 'add carousel widget' created on Oct 29, 2025 at 3:45 PM, the filename would be: `specs/active/2025-10-29-1545-add-carousel-widget.md`
- Use the `Plan Format` below to create the plan.
- Research the codebase to understand existing widget patterns, architecture, and conventions before planning the feature.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to implement the widget successfully.
- Use your reasoning model: THINK HARD about the widget requirements, component hierarchy, state management, and user interactions.
- **Follow React Thinking Process**: Apply the 5-step process from `ai_docs/react_docs/thinkinginreact.md`:
  1. Break UI into component hierarchy
  2. Build static version first (props only)
  3. Find minimal but complete UI state
  4. Identify where state should live
  5. Add inverse data flow (event handlers)
- **Widget Architecture**: Determine widget category (icon, animation, ai-element, ask-anything, complete) and place in appropriate subdirectory
- **State Management**: Apply DRY principle - compute derived values, minimize stored state
- **TypeScript First**: Define prop interfaces and types in `components/widget_components/types.ts`
- **Use shadcn/ui components**: Always use existing shadcn/ui components from `components/ui/` for UI elements
- **Follow shadcn/ui best practices**: Read `ai_docs/shadcn/shadcn_component_library_bp.md` for component creation, styling, customization patterns
- **Add new shadcn/ui components**: Use `npx shadcn@latest add <component>` when needed
- **Component patterns**: Use CVA for variants, React.forwardRef for DOM elements, CSS variables for theming, cn() utility for class merging
- **Embeddable Widgets**: For complete widgets that need to be embeddable, include Bun bundling strategy from `ai_docs/bun_docs/bun_bundling.md`
- **CRITICAL - Component Reuse Philosophy**:
  - ✅ **ALWAYS check first**: `components/ui/` for shadcn components, `components/widget_components/` for widget components
  - ❌ **NEVER recreate**: Button, Form, Input, Card, Dialog, Select, Checkbox, etc. - these already exist in `components/ui/`
  - ✅ **Variants allowed**: Create new variants of existing shadcn components using CVA pattern
  - ✅ **CSS edits allowed**: Modify `app/globals.css` for theme-level styling changes
  - ✅ **Custom widgets only**: Only create NEW components for unique widget-specific functionality not available in existing library
  - 📍 **Component location**: All reusable components are in `/Users/tjmcgovern/gist-console/components`
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.

## Relevant Files

Focus on the following files:
- `README.md` - Project overview and setup instructions
- `/Users/tjmcgovern/gist-console/components/` - **PRIMARY SOURCE**: All reusable components live here
- `components/ui/` - **CHECK FIRST**: shadcn/ui component library (accordion, alert, badge, button, card, carousel, checkbox, dialog, dropdown-menu, form, input, label, radio-group, scroll-area, select, separator, skeleton, slider, table, tabs, textarea, phase-navigation, powered-by-button)
- `components/widget_components/` - Widget library structure (icons, animations, ai-elements, ask-anything, complete)
- `components/widget_components/index.ts` - Widget exports (must be updated for new widgets)
- `components/widget_components/types.ts` - TypeScript type definitions for widgets
- `app/admin/components/widgets/` - Widget preview and management pages
- `convex/componentPreviews.ts` - Component preview data and metadata
- `lib/utils.ts` - Utility functions including cn() for class name merging
- `ai_docs/react_docs/thinkinginreact.md` - React component design methodology
- `ai_docs/bun_docs/bun_bundling.md` - Bun bundling for embeddable widgets
- `ai_docs/shadcn/shadcn_component_library_bp.md` - shadcn/ui best practices and patterns
- `package.json` - Dependencies and scripts

Ignore all other files in the codebase.

## Plan Format

```md
# Widget Feature: <widget feature name>

## Feature Description
<describe the widget feature in detail, including its purpose, visual design, and interactions>

## User Story
As a <type of user>
I want to <action/goal with the widget>
So that <benefit/value>

## Widget Classification
**Category**: <icon | animation | ai-element | ask-anything | complete>
**Embeddable**: <yes | no> (if yes, requires Bun bundling configuration)
**Complexity**: <simple | moderate | complex>

## Problem Statement
<clearly define the specific problem or opportunity this widget addresses>

## Solution Statement
<describe the proposed widget solution and how it solves the problem>

## React Component Design (Thinking in React)

### Step 1: Component Hierarchy
<break down the widget UI into a component hierarchy. Draw the tree structure showing parent-child relationships. Apply single responsibility principle.>

Example:
```
WidgetName (root)
├── WidgetHeader
│   ├── Title
│   └── CloseButton
├── WidgetContent
│   ├── InputField
│   └── ResultDisplay
└── WidgetFooter
    └── ActionButton
```

### Step 2: Static Version (Props Only)
<describe the static version implementation. List all components with their props. No state yet - just props flowing down.>

Component Props:
- `WidgetName`: { title: string, onClose: () => void, ... }
- `WidgetHeader`: { title: string, onClose: () => void }
- etc.

### Step 3: Minimal UI State
<identify the absolute minimum state needed. Apply the DRY principle. For each piece of data, answer:
1. Does it remain unchanged over time? → NOT state (use props/constants)
2. Is it passed from parent via props? → NOT state
3. Can you compute it from existing state/props? → NOT state (derive it)

What's left IS state.>

Minimal State:
- `<stateName>`: <type> - <why it's state>
- `<derivedValue>`: computed from <state> - NOT stored

### Step 4: State Location
<determine where each piece of state should live:
1. Identify components that render based on that state
2. Find their closest common parent
3. Decide: parent, above parent, or new component>

State Ownership:
- `<stateName>` lives in `<ComponentName>` because <reasoning>

### Step 5: Inverse Data Flow
<describe how child components will update parent state. List event handlers and their prop names.>

Event Handlers:
- `<ComponentName>`: receives `onChange={handleChange}` to update parent state
- Pattern: parent passes setter functions down as props

## TypeScript Type Definitions

### Prop Interfaces
<define TypeScript interfaces for all component props>

```typescript
export interface WidgetNameProps {
  // Props with JSDoc comments
  /** Description of prop */
  propName: type;
}
```

### State Types
<define types for state management if using complex state>

```typescript
export interface WidgetState {
  // State shape
}

export type WidgetAction =
  | { type: 'ACTION_NAME'; payload: type }
  | ...;
```

## Relevant Files
Use these files to implement the widget:

<find and list the files that are relevant to the widget. Describe why they are relevant in bullet points. If there are new files that need to be created, list them in an h3 'New Files' section.>

### New Files
<list new widget component files to create with their purpose>

## shadcn/ui Components

### Component Reuse Checklist
**BEFORE adding any new component, verify it doesn't already exist:**
- [ ] Checked `components/ui/` for existing shadcn components
- [ ] Checked `components/widget_components/` for existing widget components
- [ ] Confirmed the needed functionality is NOT available in existing components
- [ ] Verified that creating a variant won't suffice

### Existing Components to Use
<list which components from `components/ui/` you WILL use. Be thorough - check the full list before claiming you need something new.>

**Available in `components/ui/`:**
- accordion, alert, badge, button, card, carousel, checkbox, dialog, dropdown-menu, form, input, label, radio-group, scroll-area, select, separator, skeleton, slider, table, tabs, textarea, phase-navigation, powered-by-button

### New Components to Add (DISCOURAGED)
<list shadcn components to add via `npx shadcn@latest add <component>` ONLY if genuinely needed and not already in `components/ui/`.>

**⚠️ WARNING**: Only add if component doesn't exist in `components/ui/`. Adding duplicates is wasteful.

Example (only if truly needed):
- `npx shadcn@latest add tooltip` - For tooltip functionality (verify not already added first)

### Variants of Existing Components (ENCOURAGED)
<list variants you'll create of EXISTING shadcn components using CVA pattern. This is preferred over adding new components.>

Example:
- Create "ghost-gradient" variant of existing Button component in `app/globals.css`
- Create "compact" variant of existing Card component using CVA

### Custom Widget Components (Only if Necessary)
<list ONLY widget-specific components that have no equivalent in existing library. These should be truly custom functionality not available in shadcn/ui or existing widgets.>

**Requirements for custom components:**
- Must follow shadcn/ui patterns from `ai_docs/shadcn/shadcn_component_library_bp.md`
- Must use CVA for variants, forwardRef for DOM elements, CSS variables for theming, cn() utility for class merging
- Must be truly unique widget functionality (not a button, form, input, card, etc.)

## Widget Integration

### Export Configuration
<describe how the widget will be exported from `components/widget_components/index.ts`>

```typescript
// Add to appropriate section:
export { WidgetName } from "./category/widget-name";
export type { WidgetNameProps } from "./types";
```

### Preview Page Integration (if applicable)
<describe how the widget will be integrated into the admin component browser>

- Location: `app/admin/components/widgets/[category]/[widget]/page.tsx`
- Demo variants to showcase
- Interactive controls to demonstrate

## Embeddable Widget Configuration (if applicable)

### Bundling Strategy
<if widget is embeddable, describe Bun build configuration from `ai_docs/bun_docs/bun_bundling.md`>

**Build Script**: `build/<widget-name>.ts`
**Output Format**: IIFE (Immediately Invoked Function Expression)
**Global API**: `window.WidgetName`
**CSS Strategy**: <inline | external>
**Bundle Target**: CDN deployment

### Build Configuration
```typescript
// build/<widget-name>.ts
await Bun.build({
  entrypoints: ["./components/widget_components/complete/<widget-name>.tsx"],
  outdir: "./dist/widgets",
  format: "iife",
  target: "browser",
  minify: true,
  splitting: false,
  naming: "<widget-name>.js",
  external: [],
  packages: "bundle",
});
```

### Client Integration
```html
<!-- Usage example -->
<div id="widget-root"></div>
<script src="https://cdn.example.com/<widget-name>.js"></script>
<script>
  const widget = new window.WidgetName();
  widget.init({ containerId: "widget-root", ...config });
</script>
```

## Implementation Plan

### Phase 1: Foundation & Type Definitions
<describe foundational work: type definitions, interfaces, utility functions>

### Phase 2: Static Component Structure
<describe static component implementation with props only, following React Thinking Step 2>

### Phase 3: State Management Integration
<describe state management implementation, following React Thinking Steps 3-5>

### Phase 4: Styling & Polish
<describe Tailwind CSS styling, animations, responsive design>

### Phase 5: Integration & Export
<describe integration with widget library, exports, preview pages>

### Phase 6: Bundling (if embeddable)
<describe Bun build script creation and testing for embeddable widgets>

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. Use as many h3 headers as needed to implement the widget. Order matters:
1. Type definitions in types.ts
2. Static component structure (leaf components → root)
3. Add state management
4. Add event handlers (inverse data flow)
5. Styling with Tailwind CSS
6. Export from index.ts
7. Preview page (if needed)
8. Build script (if embeddable)
9. Testing and validation
10. Run Validation Commands

Include creating tests throughout the implementation process. Your last step should be running the `Validation Commands`.>

## Testing Strategy

### Component Testing
<describe how to test the widget components>

- Props rendering correctly
- State updates working
- Event handlers firing
- Edge cases handled

### Integration Testing
<describe how to test widget integration with the system>

- Export from index.ts working
- Preview page rendering
- Interactive controls functioning
- Build process (if embeddable)

### Edge Cases
<list edge cases that need to be tested>

- Empty states
- Loading states
- Error states
- Long content/overflow
- Mobile/responsive behavior
- Accessibility (keyboard navigation, screen readers)

## Acceptance Criteria
<list specific, measurable criteria that must be met for the widget to be considered complete>

- [ ] Widget follows React 19.2 patterns ("use client", modern hooks)
- [ ] Component hierarchy follows single responsibility principle
- [ ] State management uses minimal state with derived values
- [ ] TypeScript types defined in types.ts
- [ ] Props interfaces documented with JSDoc
- [ ] Exported from index.ts correctly
- [ ] Tailwind CSS styling follows project conventions
- [ ] shadcn/ui components used where applicable
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Preview page created (if applicable)
- [ ] Build script working (if embeddable)
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] Manual testing completed

## Validation Commands
Execute every command to validate the widget works correctly with zero regressions.

<list commands you'll use to validate with 100% confidence the widget is implemented correctly. Every command must execute without errors.>

- `bun run build` - Build Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start Next.js dev server and manually test the widget
- `bun run build:widget` - Build embeddable widget bundle (if applicable)
- `bun test` - Run tests to validate widget works with zero regressions (if tests exist)

### Manual Testing Checklist
- [ ] Navigate to widget preview page: `/admin/components/widgets/[category]/[widget]`
- [ ] Verify widget renders correctly
- [ ] Test all interactive features
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Test keyboard navigation and accessibility
- [ ] Verify no console errors or warnings
- [ ] Test embeddable bundle in standalone HTML (if applicable)

## Notes
<optionally list any additional notes, future considerations, or context that are relevant to the widget that will be helpful to the developer>

### Performance Considerations
- Avoid unnecessary re-renders (React.memo if needed)
- Optimize images and assets
- Lazy load heavy components

### Future Enhancements
<potential future improvements or variations>

### Related Widgets
<list related widgets in the library that share patterns or could be composed together>
```

## Widget Feature
$ARGUMENTS
