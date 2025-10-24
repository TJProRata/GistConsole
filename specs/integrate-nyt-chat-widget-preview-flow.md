# Chore: Integrate NYT Chat Widget into Preview Flow with Custom Styling

## Chore Description
Replace the placeholder floating widget in the preview flow with the fully functional NYT Chat Widget component. The widget should be positioned at the bottom-center of the screen and respond dynamically to user configuration settings (colors, gradients, dimensions, placement). Update the configuration page to include all styling options that match what's available in the admin console for the NYT Chat Widget, ensuring full customization capabilities for preview users.

**Current State:**
- Preview flow uses a simple placeholder widget for "floating" type (lines 79-140 in `PreviewWidgetRenderer.tsx`)
- Placeholder shows basic chat bubble with minimal functionality
- Configuration options are limited (color, gradient, placement, dimensions)

**Desired State:**
- NYT Chat Widget component replaces placeholder for "floating" widget type
- Widget mounted at bottom-center position by default
- Full NYT Chat Widget functionality (4-state machine, suggestion categories, autocomplete, streaming answers, citations)
- Widget responds to all configuration settings: colors, gradients, dimensions, text customization
- Configuration page updated with NYT-specific settings (collapsed text, title, placeholder, categories, branding)

**Key Requirements:**
1. Use existing `NYTChatWidget` component from `@/components/widget_components`
2. Position widget at bottom-center (not bottom-right like current placeholder)
3. Apply user's color/gradient configuration to widget styling
4. Support dimension controls (width, height) for expanded widget
5. Add NYT-specific configuration fields to configure page
6. Maintain responsive behavior and state management

## Relevant Files

### Files to Modify

- **`components/PreviewWidgetRenderer.tsx`** (Lines 79-140)
  - Replace placeholder floating widget implementation with NYTChatWidget
  - Change positioning from corner placement to bottom-center
  - Apply configuration props to NYTChatWidget component
  - Map color/gradient settings to widget's internal styling
  - Handle dimension controls for expanded widget state

- **`app/preview/configure/page.tsx`** (Lines 1-150+)
  - Add NYT-specific configuration state variables (collapsedText, title, placeholder, categories, brandingText)
  - Add new configuration fields in UI for text customization
  - Update debounced save to include NYT-specific settings
  - Conditionally show NYT fields only when widgetType is "floating"
  - Maintain existing color/gradient/dimension controls

- **`convex/schema.ts`** (Lines 6-26 in previewConfigurations configuration object)
  - Add optional fields for NYT widget customization
  - Fields: collapsedText, title, placeholder, followUpPlaceholder, suggestionCategories, brandingText
  - Maintain backward compatibility with existing preview configurations

- **`convex/previewConfigurations.ts`** (Lines 4-26)
  - Update configurationSchema to include new NYT-specific fields
  - Ensure schema validation accepts optional NYT fields

- **`components/widget_components/complete/nyt-chat-widget.tsx`**
  - Reference component interface for available props
  - Review styling approach to understand how to apply custom colors
  - Identify which props control visual appearance

- **`components/widget_components/types.ts`** (Lines 464+)
  - Review NYTChatWidgetProps interface
  - Identify all customizable props available
  - Map props to configuration settings

### Files to Reference

- **`app/admin/components/widgets/complete/nyt-chat-widget/page.tsx`**
  - Reference implementation showing full NYT widget capabilities
  - Copy configuration controls pattern (lines 122-193)
  - Understand state management and prop structure

- **`components/ColorGradientPicker.tsx`**
  - Existing color/gradient picker component
  - Understand value structure and onChange pattern
  - Maintain consistency with existing styling

- **`app/preview/demo/page.tsx`**
  - Reference how PreviewWidgetRenderer is used in demo context
  - Ensure demo page works with NYT widget integration
  - Test full preview flow end-to-end

## Step by Step Tasks

### Step 1: Update Convex Schema for NYT Widget Configuration
- Open `convex/schema.ts`
- Locate the `configuration` object definition inside `previewConfigurations` table (around line 175)
- Add new optional fields for NYT widget customization:
  - `collapsedText: v.optional(v.string())`
  - `title: v.optional(v.string())`
  - `placeholder: v.optional(v.string())`
  - `followUpPlaceholder: v.optional(v.string())`
  - `suggestionCategories: v.optional(v.array(v.string()))`
  - `brandingText: v.optional(v.string())`
- Open `convex/previewConfigurations.ts`
- Update `configurationSchema` constant (lines 4-26) to include the same optional fields
- Ensure backward compatibility by making all new fields optional
- Deploy schema changes: Run `npx convex dev` to deploy updated schema

### Step 2: Update PreviewWidgetRenderer for NYT Widget Integration
- Open `components/PreviewWidgetRenderer.tsx`
- Import NYTChatWidget component: `import { NYTChatWidget } from "@/components/widget_components";`
- Locate floating widget implementation (lines 79-140)
- **Replace entire floating widget section** with NYTChatWidget implementation:
  - Remove placeholder Card component and Button
  - Add NYTChatWidget component with proper props
  - Set up internal state for isExpanded (controlled by widget internally)
- **Update positioning logic**:
  - Change from `getPlacementClasses()` corner positioning
  - Use fixed bottom-center positioning: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50`
  - Remove placement-based conditional classes (NYT widget is always bottom-center)
- **Apply configuration props to NYTChatWidget**:
  - Pass `collapsedText` from `configuration.collapsedText` or default "Ask"
  - Pass `title` from `configuration.title` or default "Ask Anything!"
  - Pass `placeholder` from `configuration.placeholder` or default "Ask anything"
  - Pass `followUpPlaceholder` from `configuration.followUpPlaceholder` or default "Ask a follow up..."
  - Pass `suggestionCategories` from `configuration.suggestionCategories` or default array
  - Pass `brandingText` from `configuration.brandingText` or default "Powered by Gist Answers"
- **Handle color styling** (NYT widget has fixed dark theme, but support custom accent colors):
  - NYT widget uses internal dark theme (#1a1a1a background, white text)
  - Widget has purple accent color (#9333ea) for interactive elements
  - Consider adding inline style overrides or CSS variables if color customization is required
  - For now, document that NYT widget uses fixed dark theme (can enhance later)
- **Handle dimensions**:
  - NYT widget expanded state is fixed width (~400px) but height can be controlled
  - Pass width/height via inline styles or wrapper div if needed
  - Default: Let widget use its internal sizing
- Add event handlers for widget interactions (onSubmit, onCategoryClick, onCitationClick) with console.log for preview

### Step 3: Enhance Configuration Page with NYT-Specific Settings
- Open `app/preview/configure/page.tsx`
- Add new state variables after existing configuration state (around line 51):
  ```typescript
  const [nytConfig, setNytConfig] = useState({
    collapsedText: "Ask",
    title: "Ask Anything!",
    placeholder: "Ask anything",
    followUpPlaceholder: "Ask a follow up...",
    suggestionCategories: ["Top Stories", "Breaking News", "Sports", "Technology"],
    brandingText: "Powered by Gist Answers",
  });
  ```
- Load NYT configuration from previewConfig in useEffect (around line 53-72):
  ```typescript
  if (previewConfig.configuration) {
    const config = previewConfig.configuration;
    setNytConfig({
      collapsedText: config.collapsedText ?? "Ask",
      title: config.title ?? "Ask Anything!",
      placeholder: config.placeholder ?? "Ask anything",
      followUpPlaceholder: config.followUpPlaceholder ?? "Ask a follow up...",
      suggestionCategories: config.suggestionCategories ?? ["Top Stories", "Breaking News", "Sports", "Technology"],
      brandingText: config.brandingText ?? "Powered by Gist Answers",
    });
  }
  ```
- Update debounced save useEffect (lines 75-96) to include nytConfig:
  ```typescript
  await updateConfig({
    sessionId,
    configuration: {
      ...colorConfig,
      placement,
      width: width[0],
      height: height[0],
      textColor: "#ffffff",
      ...nytConfig, // Include NYT-specific config
    },
  });
  ```
- Add dependency to useEffect: `[..., nytConfig]`
- **Add new "Content" tab to Tabs component** (after "Behavior" tab, around line 141):
  - Add `<TabsTrigger value="content" className="flex-1">Content</TabsTrigger>`
  - Create `<TabsContent value="content" className="space-y-6">`
- **Add NYT configuration fields in Content tab**:
  - Card with title "Widget Text Customization"
  - Input field for Collapsed Text (with label and description)
  - Input field for Widget Title
  - Input field for Search Placeholder
  - Input field for Follow-up Placeholder
  - Input field for Branding Text
  - Textarea for Suggestion Categories (comma-separated, with split/trim logic)
- Follow existing Card/Label/Input pattern from appearance tab
- Use `nytConfig` state and update handlers: `onChange={(e) => setNytConfig({ ...nytConfig, collapsedText: e.target.value })}`

### Step 4: Update Preview Widget Interface to Support NYT Configuration
- Open `components/PreviewWidgetRenderer.tsx` (again, after Step 2)
- Verify WidgetConfiguration interface (lines 10-27) includes new fields:
  ```typescript
  interface WidgetConfiguration {
    // Existing fields...
    primaryColor?: string;
    // ... other existing fields

    // Add NYT-specific fields
    collapsedText?: string;
    title?: string;
    placeholder?: string;
    followUpPlaceholder?: string;
    suggestionCategories?: string[];
    brandingText?: string;
  }
  ```
- Update TypeScript interface to match Convex schema
- Ensure type safety across entire preview flow

### Step 5: Test NYT Widget in Preview Live Preview Panel
- Open `app/preview/configure/page.tsx`
- Locate live preview panel (around line 200+)
- Verify PreviewWidgetRenderer is receiving updated configuration
- Test that preview updates in real-time as user changes configuration
- Ensure debounced save (500ms) works correctly
- **Test positioning**: Widget should appear at bottom-center, not in corner
- **Test color changes**: While NYT widget has dark theme, verify configuration saves correctly
- **Test text customization**: Verify all NYT-specific fields update widget in real-time
- **Test dimension controls**: Verify width/height sliders affect expanded widget size

### Step 6: Update Demo Page to Use NYT Widget
- Open `app/preview/demo/page.tsx`
- Verify PreviewWidgetRenderer with `isDemo={true}` prop works correctly
- Test that NYT widget renders in full demo page context
- Verify fixed positioning (`fixed bottom-4`) works in demo layout
- Test widget interactions (expand, collapse, category clicks, search)
- Ensure "Create Account & Save" button is not blocked by widget

### Step 7: Add NYT Widget Documentation to Configuration Page
- Open `app/preview/configure/page.tsx`
- Add info card or alert explaining NYT widget features (optional but helpful):
  - Fixed dark theme with purple accents
  - 4-state machine (collapsed, search, loading, answer)
  - Interactive suggestion categories
  - Streaming text animations
  - Citation attribution
- Position info card above or below configuration tabs
- Use Alert or Card component with informational variant
- Include link to admin console preview page for full feature demo

### Step 8: Validate Schema Changes and Data Persistence
- Open Convex Dashboard (https://dashboard.convex.dev)
- Navigate to project → Data → previewConfigurations table
- Verify schema update shows new fields (collapsedText, title, etc.)
- Create a test preview configuration via the app
- Verify all configuration fields save correctly to database
- Check that reading configuration includes NYT-specific fields
- Test backward compatibility: Old preview configs without NYT fields should still work

### Step 9: Run Validation Commands
- Execute all validation commands to ensure chore is complete with zero regressions
- Manually test the complete preview flow end-to-end
- Verify NYT widget integration in all contexts (configure page preview, demo page)
- Test configuration persistence across page refreshes
- Validate TypeScript types are correct

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background terminal)
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete

### Manual Testing Checklist
1. **Schema Validation**
   - Open Convex Dashboard → Data → previewConfigurations
   - Verify new fields exist in schema
   - Create test preview and verify data saves correctly

2. **Configuration Page**
   - Navigate to `/preview` → enter API key → select "floating" widget
   - Navigate to `/preview/configure`
   - **Test Content Tab**: Verify new "Content" tab appears with NYT configuration fields
   - **Test Text Inputs**: Change collapsed text, title, placeholder, categories, branding text
   - **Test Live Preview**: Verify changes reflect in live preview panel in real-time (500ms debounce)
   - **Test Color/Gradient**: Verify color picker works (note: NYT widget has fixed dark theme but config saves)
   - **Test Dimensions**: Verify width/height sliders work (note: NYT widget has mostly fixed dimensions)
   - **Test Positioning**: Verify widget appears at bottom-center of preview panel, not in corner

3. **Demo Page**
   - Click "Preview in Demo" button to navigate to `/preview/demo`
   - **Test Widget Position**: Verify NYT widget appears at bottom-center of screen
   - **Test Widget Interaction**: Click to expand widget
   - **Test Suggestion Categories**: Click on suggestion category pills
   - **Test Search Input**: Type in search input (3+ chars should show autocomplete)
   - **Test Collapsed State**: Verify collapsed button shows custom "collapsedText"
   - **Test Expanded State**: Verify title shows custom "title" text
   - **Test Branding**: Verify branding text appears at bottom of widget
   - **Test CTA Button**: Verify "Create Account & Save" button is not blocked by widget

4. **State Persistence**
   - Configure NYT widget with custom settings
   - Navigate to demo page
   - Refresh browser
   - Verify configuration persists (loaded from localStorage sessionId)
   - Navigate back to configure page
   - Verify all settings are still present

5. **Backward Compatibility**
   - Create new preview session with old configuration (no NYT fields)
   - Verify app doesn't crash
   - Verify default values are used for missing NYT fields
   - Verify existing configurations (rufus, womensWorld) still work

6. **Build & Type Safety**
   - Run `bun run build`
   - Verify no TypeScript errors
   - Verify no missing prop warnings
   - Verify all interfaces match Convex schema

## Notes

### NYT Chat Widget Specifications
- **Component**: `NYTChatWidget` from `@/components/widget_components`
- **States**: 4-state machine (collapsed, search, loading, answer)
- **Dark Theme**: Fixed #1a1a1a background, white text, #9333ea purple accent
- **Dimensions**: Default expanded width ~400px, height flexible
- **Position**: Bottom-center is recommended for optimal UX
- **Interactive Features**:
  - Suggestion categories with sparkle icons
  - Autocomplete (3+ character trigger)
  - Streaming text animation (20ms per character)
  - Expandable answer content (3→10 lines)
  - Citation pills with source attribution
  - Follow-up question input

### Bottom-Center Positioning Implementation
```css
/* Fixed positioning at bottom-center */
position: fixed;
bottom: 1rem; /* 16px from bottom */
left: 50%; /* Centered horizontally */
transform: translateX(-50%); /* Offset by half width */
z-index: 50;
```

This ensures the widget is:
- Always centered horizontally regardless of screen size
- Fixed at bottom of viewport
- Above other page content (z-index: 50)
- Responsive to screen width changes

### Color Customization Considerations
The NYT Chat Widget has a **fixed dark theme** for brand consistency:
- Background: #1a1a1a (very dark gray, almost black)
- Text: White (#ffffff)
- Accent: Purple #9333ea
- Interactive elements: Purple tints and shades

While user color/gradient configuration is saved to the database, the NYT widget currently does not apply custom colors. This is intentional to maintain the NYT brand aesthetic.

**Future Enhancement Options**:
1. Add CSS variable overrides to NYTChatWidget component
2. Create a "theme" prop that accepts color object
3. Add a "customTheme" boolean flag in configuration

For this chore, **we'll save the color configuration** but the widget will use its fixed theme. This allows for future enhancement without breaking existing code.

### Suggestion Categories Format
- Input as comma-separated string in configuration UI
- Stored as string array in database
- Default categories: `["Top Stories", "Breaking News", "Sports", "Technology"]`
- Parse on change: `categories.split(",").map(c => c.trim()).filter(Boolean)`
- Widget displays as pill buttons with sparkle icons

### Configuration Schema Evolution
New fields added to `previewConfigurations.configuration` object:
```typescript
{
  // Existing fields (unchanged)
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  useGradient?: boolean;
  gradientStart?: string;
  gradientEnd?: string;
  width?: number;
  height?: number;
  placement?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  openByDefault?: boolean;
  iconUrl?: string;
  iconStorageId?: Id<"_storage">;

  // NEW: NYT-specific fields
  collapsedText?: string;
  title?: string;
  placeholder?: string;
  followUpPlaceholder?: string;
  suggestionCategories?: string[];
  brandingText?: string;
}
```

All new fields are **optional** to maintain backward compatibility with existing preview configurations.

### Testing Considerations
- **Responsive Design**: Test NYT widget on mobile viewport sizes (320px, 768px, 1024px)
- **Dark Mode**: NYT widget always uses dark theme regardless of system theme
- **State Management**: Widget manages its own expanded/collapsed state internally
- **Event Handlers**: Preview uses console.log for events (onSubmit, onCategoryClick, onCitationClick)
- **Performance**: Streaming text animation uses 20ms intervals (smooth but not resource-intensive)

### Admin Console Reference
The admin console has a complete NYT widget preview page at `/admin/components/widgets/complete/nyt-chat-widget`. This page demonstrates:
- All 4 widget states with interactive controls
- Full customization options (matching what we're adding to preview flow)
- Feature documentation and component architecture
- Code examples and TypeScript types

Use this as a reference for understanding the full capabilities of the NYT Chat Widget.

### Future Enhancements (Out of Scope for This Chore)
- **Custom Theming**: Add theme prop to NYTChatWidget for user color customization
- **Mobile Optimization**: Add responsive breakpoints for mobile-specific styling
- **Animation Controls**: Allow users to disable/enable streaming text animation
- **Category Templates**: Provide pre-populated category sets (news, sports, entertainment, etc.)
- **Advanced Positioning**: Support custom positioning beyond bottom-center
- **Widget Preview Modes**: Add button to toggle between collapsed/expanded preview states
