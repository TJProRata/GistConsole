# Chore: Migrate Widget Components from ask-anything-ui

## Chore Description

Migrate the onboarding widget and all its supporting components from the `ask-anything-ui` project to the `gist-console` project. This includes:

1. **Main Widget Component**: `onboarding-widget.tsx` - A complex multi-phase onboarding flow with 18 phases
2. **AI Elements Components**: Glass widget containers, prompt inputs, progress indicators, animations
3. **UI Components**: Carousel, separator, phase navigation, pricing cards
4. **Icon Components**: Custom SVG icons (BlueStar, Wand)
5. **Animation Components**: Searching animation, success phase
6. **Supporting Types**: TypeScript type definitions

All components will be migrated to a new `components/widget_components/` directory while maintaining shadcn/ui best practices and ensuring compatibility with the existing gist-console stack (Next.js 16, React 19.2, TypeScript 5.9.3).

## Relevant Files

### Existing Files in gist-console

- **`components/ui/button.tsx`** - shadcn/ui button component (already exists, compatible)
- **`components/ui/card.tsx`** - shadcn/ui card component (already exists, compatible)
- **`components/ui/separator.tsx`** - Already installed, needed by onboarding widget
- **`lib/utils.ts`** - Contains `cn()` utility for class merging (already exists)
- **`package.json`** - Need to verify dependencies and add missing ones (framer-motion, embla-carousel)
- **`app/globals.css`** - May need CSS variable additions for widget theming
- **`components.json`** - shadcn/ui configuration file

### New Files to Create

All files will be created under `components/widget_components/`:

#### Main Widget
- **`components/widget_components/complete/onboarding-widget.tsx`** - Main onboarding widget component

#### AI Elements (Custom Components)
- **`components/widget_components/ai-elements/glass_widget_container.tsx`** - Glassmorphic widget container with expand/collapse
- **`components/widget_components/ai-elements/prompt-input.tsx`** - Gradient-bordered prompt input with icons
- **`components/widget_components/ai-elements/dual-phase-progress.tsx`** - Two-phase progress indicator
- **`components/widget_components/ai-elements/simple-progress-bar.tsx`** - Simple progress bar component
- **`components/widget_components/ai-elements/gif-housing.tsx`** - GIF preview container
- **`components/widget_components/ai-elements/success-phase.tsx`** - Success screen with animation
- **`components/widget_components/ai-elements/readiness-score-gauge.tsx`** - Circular readiness score gauge

#### Icons
- **`components/widget_components/icons/blue-star.tsx`** - Custom blue star icon
- **`components/widget_components/icons/wand.tsx`** - Custom wand icon

#### Animations
- **`components/widget_components/animations/searching-animation.tsx`** - Searching state animation

#### Ask-Anything Components
- **`components/widget_components/ask-anything/pricing-card.tsx`** - Pricing plan card component

#### Additional UI Components (from shadcn/ui)
- **`components/ui/carousel.tsx`** - Carousel component (needs to be added via shadcn CLI)
- **`components/ui/phase-navigation.tsx`** - Custom phase navigation buttons
- **`components/ui/powered-by-button.tsx`** - Branding button component

#### Types
- **`components/widget_components/types.ts`** - TypeScript type definitions for widget

## Step by Step Tasks

### Step 1: Install Missing Dependencies

Install required npm packages that are used by the onboarding widget but not present in gist-console:

- `bun add framer-motion` - For animations and transitions
- `npx shadcn@latest add carousel` - For pricing card carousel
- Verify `@radix-ui/react-separator` is installed (already present)
- Verify `lucide-react` is installed (already present)

### Step 2: Create Directory Structure

Create the new `widget_components` directory structure:

```bash
mkdir -p components/widget_components/ai-elements
mkdir -p components/widget_components/icons
mkdir -p components/widget_components/animations
mkdir -p components/widget_components/ask-anything
```

### Step 3: Migrate Icon Components

Copy and adapt custom icon components from ask-anything-ui:

- **`components/widget_components/icons/blue-star.tsx`**
  - Read from: `/Users/tjmcgovern/ask-anything-ui/components/icons/blue-star.tsx`
  - Update import paths to use `@/` alias
  - Maintain React.forwardRef pattern and TypeScript types

- **`components/widget_components/icons/wand.tsx`**
  - Read from: `/Users/tjmcgovern/ask-anything-ui/components/icons/wand.tsx`
  - Update import paths to use `@/` alias
  - Maintain component structure

### Step 4: Migrate Animation Components

Copy searching animation component:

- **`components/widget_components/animations/searching-animation.tsx`**
  - Read from: `/Users/tjmcgovern/ask-anything-ui/components/animations/searching-animation.tsx`
  - Update import paths
  - Ensure framer-motion is imported correctly

### Step 5: Migrate AI Elements Components

Copy all AI element components from ask-anything-ui and adapt import paths:

- **`glass_widget_container.tsx`** - Core widget container with glassmorphic styling
  - Update imports to reference new paths
  - Verify CSS variable usage matches gist-console globals.css

- **`prompt-input.tsx`** - Prompt input with gradient borders and icon buttons
  - Update lucide-react imports
  - Update utility imports

- **`dual-phase-progress.tsx`** - Two-phase progress indicator
  - Simple component, minimal changes needed

- **`simple-progress-bar.tsx`** - Basic progress bar
  - Verify CSS variable compatibility

- **`gif-housing.tsx`** - GIF preview container
  - Update imports

- **`success-phase.tsx`** - Success screen component
  - Update imports and verify framer-motion compatibility

- **`readiness-score-gauge.tsx`** - Circular gauge component
  - Update imports

### Step 6: Migrate Ask-Anything Components

Copy pricing card component:

- **`components/widget_components/ask-anything/pricing-card.tsx`**
  - Read from: `/Users/tjmcgovern/ask-anything-ui/components/ask-anything/pricing-card.tsx`
  - Update imports to use gist-console paths
  - Ensure button and card components are imported from `@/components/ui/`

### Step 7: Add Missing UI Components

Add missing shadcn/ui components and create custom UI components:

- **Phase Navigation** - Create custom component in `components/ui/phase-navigation.tsx`
  - Build using shadcn/ui button as base
  - Implement prev/next navigation pattern

- **Powered By Button** - Create custom component in `components/ui/powered-by-button.tsx`
  - Simple branding button component
  - Use shadcn/ui button patterns

### Step 8: Migrate Types

Copy TypeScript type definitions:

- **`components/widget_components/types.ts`**
  - Read from: `/Users/tjmcgovern/ask-anything-ui/components/widgets/onboarding-widget/types.ts`
  - Update any import paths
  - Ensure type compatibility with gist-console

### Step 9: Migrate Main Widget Component

Copy and adapt the main onboarding widget:

- **`components/widget_components/complete/onboarding-widget.tsx`**
  - Read from: `/Users/tjmcgovern/ask-anything-ui/components/widgets/onboarding-widget/onboarding-widget.tsx`
  - Update all import paths to reference new `widget_components/` directory
  - Update shadcn/ui component imports to use `@/components/ui/`
  - Ensure environment variable handling (`NEXT_PUBLIC_CDN_BASE_URL`) is compatible
  - Verify all 18 phases work correctly with new import paths

### Step 10: Add CSS Variables

Review and add any missing CSS variables to `app/globals.css`:

- Check for custom CSS variables used in widget components
- Add gradient definitions (`--gradient-brand`, etc.)
- Add text color variables (`--text-primary`, `--text-secondary`, etc.)
- Add background variables (`--background-action-secondary`, etc.)
- Ensure all design tokens are defined in the `:root` selector

### Step 11: Update Import Paths and Exports

Create a barrel export file for easy imports:

- **`components/widget_components/index.ts`**
  - Export all widget components
  - Enable clean imports like `import { OnboardingWidget } from '@/components/widget_components'`

## Validation Commands

Execute every command to validate the chore is complete with zero regressions:

- `bun install` - Install all new dependencies (framer-motion, carousel)
- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx tsc --noEmit` - Explicit TypeScript check for type errors
- `npx convex dev` - Deploy Convex schema and functions (run in background, verify no errors)
- `bun dev` - Start the Next.js dev server and manually validate:
  - Import OnboardingWidget in a test page
  - Verify all 18 phases render without errors
  - Check console for missing imports or runtime errors
  - Verify animations work correctly
  - Test carousel functionality
  - Validate all icon components render

## Notes

### Migration Strategy

- **Preserve Component Structure**: Maintain original component architecture and logic
- **Update Import Paths**: All imports must use gist-console's `@/` alias system
- **Maintain shadcn/ui Patterns**: Follow existing button, card patterns from gist-console
- **CSS Variable Compatibility**: Ensure design tokens work with gist-console's theme system
- **Dependency Management**: Use Bun for package installation, verify compatibility with Bun runtime

### Key Dependencies

- **framer-motion**: Critical for animations, transitions, and phase changes
- **embla-carousel**: Used by shadcn/ui carousel component
- **lucide-react**: Already installed, used for icons throughout widget
- **@radix-ui primitives**: Already installed for shadcn/ui components

### Environment Variables

The widget uses `NEXT_PUBLIC_CDN_BASE_URL` for asset loading (GIFs, images). This should be:
- Added to `.env.local` if needed
- Documented in README.md
- Set to empty string as fallback (already handled in widget code)

### Testing Considerations

- Widget is complex with 18 phases - thorough manual testing required
- Each phase has different UI elements and interactions
- Animation timing and transitions need verification
- Carousel interaction in Phase 6 needs specific testing
- Form input components need validation

### Future Enhancements

After successful migration, consider:
- Creating a dedicated demo page at `/app/demo/widget/page.tsx`
- Adding Storybook or component playground
- Extracting reusable patterns into shared components
- Documentation for widget configuration and customization
