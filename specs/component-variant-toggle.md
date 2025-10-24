# Feature: Component Variant Toggle for Preview Pages

## Feature Description
Add interactive variant toggle controls to component preview pages that allow admins to switch between different variants of components dynamically. Currently, the prompt-input component only shows the "glassmorphism" variant, but it also has a "default" variant that isn't visible. This feature will add a toggle UI that works for any component with variants, enabling comprehensive component exploration across both UI components (shadcn/ui) and widget components.

## User Story
As an admin viewing component previews
I want to toggle between different component variants (e.g., "default" vs "glassmorphism" for prompt-input, or "default", "destructive", "outline" for Button)
So that I can see all available variants of a component without navigating to different pages or modifying code

## Problem Statement
The current component preview system only renders a single demo configuration per component. For components with multiple variants (like Button with 6 variants, Badge with 4 variants, or PromptInput with 2 variants), users cannot see all available options. This limits the usefulness of the preview system for:
1. **Component exploration**: Admins can't discover all available variants
2. **Design decisions**: Can't compare variants side-by-side
3. **Documentation completeness**: Preview doesn't reflect full component capabilities
4. **Developer experience**: Requires reading code to discover variants

## Solution Statement
Implement a flexible variant toggle system that:
1. Detects components with multiple variants automatically
2. Displays variant controls (toggle buttons, radio group, or select dropdown depending on variant count)
3. Re-renders the demo component with the selected variant
4. Persists variant selection to localStorage for better UX
5. Works for both UI components (shadcn/ui) and widget components
6. Uses existing shadcn/ui components (Tabs, ToggleGroup, RadioGroup) for the toggle UI

The system will be metadata-driven, where component demo functions can optionally export variant configuration metadata that the preview system uses to render controls.

## Relevant Files
Use these files to implement the feature:

- **`components/ComponentPreview.tsx`** (lines 1-133) - Root component preview system with tabs, dark mode toggle. Will be extended to support variant controls.
- **`app/admin/components/widgets/[widget]/page.tsx`** (lines 1-170) - Widget preview page that uses ComponentPreview. Needs to pass variant metadata.
- **`app/admin/components/ui-components/[component]/page.tsx`** (lines 1-164) - UI component preview page. Needs to pass variant metadata.
- **`components/component-previews/widget-demos.tsx`** (lines 1-204) - Contains all widget demo functions including PromptInputDemo. Will add variant metadata exports.
- **`components/component-previews/ui-demos.tsx`** - Contains all UI component demo functions. Will add variant metadata for Button, Badge, etc.
- **`convex/componentPreviews.ts`** (lines 495-708) - Backend data for widget components. Will add variants field to component data.

### New Files
- **`lib/types/component-preview.ts`** - TypeScript types for variant configuration and component metadata
- **`components/VariantControls.tsx`** - Reusable component for rendering variant selection UI based on variant metadata

## shadcn/ui Components
### Existing Components to Use
- **`components/ui/tabs.tsx`** - Already used for Preview/Code tabs, will be the container for variant controls
- **`components/ui/button.tsx`** - For variant toggle buttons
- **`components/ui/radio-group.tsx`** - For selecting between 3-5 variants
- **`components/ui/select.tsx`** - For selecting between 6+ variants (dropdown)
- **`components/ui/label.tsx`** - For labeling variant controls
- **`components/ui/separator.tsx`** - For visually separating variant controls from other controls

### New Components to Add
```bash
npx shadcn@latest add toggle-group
```
This component provides a group of toggle buttons (perfect for 2-3 variants like default/glassmorphism).

### Custom Components to Create
None - all UI needs can be met with existing and newly added shadcn/ui components.

## Implementation Plan
### Phase 1: Foundation
1. Add `toggle-group` shadcn/ui component for variant selection
2. Create TypeScript types for variant configuration (`VariantConfig`, `ComponentMetadata`)
3. Create `VariantControls` component that renders appropriate UI based on variant count (ToggleGroup for 2-3, RadioGroup for 4-5, Select for 6+)
4. Update `ComponentPreview` context to include variant state management

### Phase 2: Core Implementation
1. Extend `ComponentPreview` to accept and manage variant metadata
2. Update `ComponentPreviewDemo` to render VariantControls when variants are provided
3. Add localStorage persistence for variant selection (keyed by component name)
4. Create variant metadata for PromptInputDemo (default, glassmorphism)
5. Update PromptInputDemo to accept and use selected variant prop

### Phase 3: Integration
1. Update widget preview page to detect and pass variant metadata to ComponentPreview
2. Update UI component preview page to detect and pass variant metadata to ComponentPreview
3. Add variant metadata to Convex backend data for widgets (optional field)
4. Document variant metadata pattern for future component additions
5. Add variant metadata for Button, Badge, and other multi-variant UI components

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Install shadcn/ui toggle-group component
- Run `npx shadcn@latest add toggle-group` to add the ToggleGroup component
- Verify component exists at `components/ui/toggle-group.tsx`

### Step 2: Create TypeScript types for variant system
- Create new file `lib/types/component-preview.ts`
- Define `VariantConfig` interface with fields: name (string), label (string), description? (string)
- Define `ComponentMetadata` interface with fields: variants (VariantConfig[]), defaultVariant (string)
- Define `ComponentDemoProps` interface with fields: variant? (string)
- Export all types

### Step 3: Create VariantControls component
- Create new file `components/VariantControls.tsx`
- Import shadcn/ui components: ToggleGroup, RadioGroup, Select, Label, Separator
- Component accepts props: variants (VariantConfig[]), selectedVariant (string), onVariantChange (callback)
- Implement logic: 2-3 variants → ToggleGroup, 4-5 variants → RadioGroup, 6+ variants → Select
- Add ARIA labels and accessibility attributes
- Style with consistent spacing and alignment to match existing ComponentPreview UI

### Step 4: Extend ComponentPreview context
- Update `components/ComponentPreview.tsx` PreviewContext to include:
  - `variant` (string | null)
  - `setVariant` (function)
  - `variants` (VariantConfig[] | null)
  - `setVariants` (function)
- Update context provider state management
- Add localStorage persistence for variant selection (key: `component-preview-variant-${componentName}`)

### Step 5: Update ComponentPreview to accept variant metadata
- Add new props to `ComponentPreviewProps`: variants? (VariantConfig[]), componentName? (string), defaultVariant? (string)
- Pass variant metadata to context provider
- Load saved variant from localStorage on mount (if componentName provided)

### Step 6: Integrate VariantControls into ComponentPreviewDemo
- Update `ComponentPreviewDemo` to check if variants exist in context
- If variants exist, render VariantControls between TabsList and dark mode toggle
- Use Separator to visually separate controls
- Ensure responsive layout (controls stack on mobile)

### Step 7: Update PromptInputDemo with variant support
- In `components/component-previews/widget-demos.tsx`, update `PromptInputDemo` to accept `variant` prop
- Add variant metadata export: `PromptInputDemo.variants = [...]`
- Update demo to render both "default" and "glassmorphism" variants based on prop
- Create two separate demo implementations (default UI with attachments, glassmorphism with gradient input)

### Step 8: Update widget preview page to use variants
- In `app/admin/components/widgets/[widget]/page.tsx`, detect if demo component has variants metadata
- Pass variants and componentName to ComponentPreview component
- Pass selected variant to DemoComponent

### Step 9: Update UI component preview page to use variants
- In `app/admin/components/ui-components/[component]/page.tsx`, detect if demo component has variants metadata
- Pass variants and componentName to ComponentPreview component
- Pass selected variant to DemoComponent

### Step 10: Add variant metadata to ButtonDemo
- In `components/component-previews/ui-demos.tsx`, create variant metadata for ButtonDemo
- Variants: default, destructive, outline, secondary, ghost, link
- Update ButtonDemo to accept variant prop and render single button with selected variant
- Export ButtonDemo.variants metadata

### Step 11: Add variant metadata to BadgeDemo
- In `components/component-previews/ui-demos.tsx`, create variant metadata for BadgeDemo
- Variants: default, secondary, destructive, outline
- Update BadgeDemo to accept variant prop and render single badge with selected variant
- Export BadgeDemo.variants metadata

### Step 12: Add variant metadata to AlertDemo
- In `components/component-previews/ui-demos.tsx`, create variant metadata for AlertDemo
- Variants: default, destructive
- Update AlertDemo to accept variant prop and render alert with selected variant
- Export AlertDemo.variants metadata

### Step 13: Update Convex backend with variants field (optional)
- In `convex/componentPreviews.ts`, add optional `variants` field to WIDGET_COMPONENTS_DATA entries
- Add variants for prompt-input: `variants: ["default", "glassmorphism"]`
- This is optional metadata for display purposes only (actual variants come from demo component)

### Step 14: Test variant toggle with PromptInputDemo
- Start dev servers (convex dev + bun dev)
- Navigate to `/admin/components/widgets/prompt-input`
- Verify ToggleGroup appears with "Default" and "Glassmorphism" options
- Toggle between variants and verify component re-renders correctly
- Refresh page and verify selected variant persists via localStorage
- Toggle dark mode and verify variants work in both themes

### Step 15: Test variant toggle with ButtonDemo
- Navigate to `/admin/components/ui-components/button`
- Verify RadioGroup or Select appears with all 6 button variants
- Test each variant renders correctly
- Verify persistence and dark mode compatibility

### Step 16: Test variant toggle with BadgeDemo
- Navigate to `/admin/components/ui-components/badge`
- Verify variant controls appear
- Test all 4 badge variants
- Verify persistence and dark mode compatibility

### Step 17: Run validation commands
- Execute all commands listed in "Validation Commands" section
- Fix any TypeScript, build, or runtime errors
- Ensure zero regressions across all component preview pages

## Testing Strategy
### Unit Tests
- VariantControls component renders correct UI for different variant counts (2-3: ToggleGroup, 4-5: RadioGroup, 6+: Select)
- VariantControls calls onVariantChange callback when selection changes
- ComponentPreview context provides correct variant state to children
- localStorage persistence works correctly (save and load variant selection)

### Integration Tests
- Demo components receive and respond to variant prop changes
- Variant selection persists across page refreshes
- Variant controls work correctly with dark mode toggle
- Multiple components on same page don't interfere with each other's variant state

### Edge Cases
- Component with no variants (should not render variant controls)
- Component with 1 variant (should not render variant controls, treat as no variants)
- Component with 10+ variants (should use Select dropdown for better UX)
- Invalid variant selected (should fall back to defaultVariant or first variant)
- localStorage unavailable (should gracefully degrade, use in-memory state only)
- Rapid variant switching (should debounce or handle cleanly without visual glitches)

## Acceptance Criteria
- [ ] ToggleGroup component successfully added via shadcn CLI
- [ ] TypeScript types created for variant configuration system
- [ ] VariantControls component created and renders appropriate UI for different variant counts
- [ ] ComponentPreview context extended with variant state management
- [ ] localStorage persistence implemented for variant selection
- [ ] PromptInputDemo updated with both "default" and "glassmorphism" variants
- [ ] Widget preview page detects and passes variant metadata to ComponentPreview
- [ ] UI component preview page detects and passes variant metadata to ComponentPreview
- [ ] ButtonDemo, BadgeDemo, and AlertDemo have variant metadata and support variant prop
- [ ] `/admin/components/widgets/prompt-input` shows working variant toggle
- [ ] Variant selection persists across page refreshes
- [ ] Variant controls work correctly in dark mode
- [ ] All existing component previews continue to work (no regressions)
- [ ] Build completes with zero TypeScript errors
- [ ] Component preview system is extensible for future components with variants

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually test the feature end-to-end
- Test `/admin/components/widgets/prompt-input` - Verify variant toggle appears and works
- Test `/admin/components/ui-components/button` - Verify variant toggle appears and works
- Test `/admin/components/ui-components/badge` - Verify variant toggle appears and works
- Test `/admin/components/ui-components/alert` - Verify variant toggle appears and works
- Test all other component preview pages - Verify no regressions (components without variants still work)
- Test dark mode toggle with variant controls - Verify visual consistency
- Test page refresh with variant selected - Verify localStorage persistence works

## Notes
### Future Enhancements
- Add variant support for more components (Dialog, DropdownMenu, Card, etc.)
- Create visual variant showcase page showing all variants of all components in a grid
- Add "Copy variant code" button that copies code snippet for selected variant
- Support compound variants (e.g., Button size + variant combinations)
- Add URL parameter support for deep-linking to specific variants

### Component Variant Metadata Pattern
Components should export variant metadata using this pattern:
```typescript
export function MyComponentDemo({ variant = "default" }: ComponentDemoProps) {
  // Render component with selected variant
}

MyComponentDemo.variants = [
  { name: "default", label: "Default", description: "Standard component style" },
  { name: "variant1", label: "Variant 1", description: "Alternative style" }
];

MyComponentDemo.defaultVariant = "default";
```

### PromptInput Variant Differences
- **default**: Full-featured input with attachment support, toolbar, model select, standard styling
- **glassmorphism**: Minimal gradient-styled input with pill-shaped container, gradient placeholder text, fixed width

### Accessibility Considerations
- All variant controls must have proper ARIA labels
- Keyboard navigation must work for all control types (ToggleGroup, RadioGroup, Select)
- Screen readers must announce variant changes
- Focus management must be maintained when switching variants

### Performance Considerations
- Variant switching should be instant (no loading states)
- Demo components should use React.memo if re-rendering is expensive
- localStorage operations should be debounced to avoid excessive writes
- Variant metadata should be kept minimal (avoid large objects)
