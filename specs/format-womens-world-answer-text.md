# Feature: Format Women's World Answer Text with Structured Layout

## Feature Description
Transform the plain text streaming answer format on the Women's World Answer Page into a structured, visually formatted layout with section headings, bulleted lists, and inline source citations. The current implementation displays a single paragraph with `##` markers and citation numbers. The new format should parse the text and render it with proper HTML structure including headings, bullet points, bold text, and inline source citation pills.

## User Story
As a user viewing health answers on the Women's World Answer Page
I want to see well-formatted, scannable content with clear headings and bullet points
So that I can quickly understand the key takeaways and find specific information easily

## Problem Statement
The current answer display shows streaming text as a single paragraph with markdown-like markers (`##`, `**`, `[citation]`) that are not properly rendered. This creates a poor reading experience with:
- No visual hierarchy between sections
- Difficult to scan for key information
- Citations displayed as inline numbers without context
- No distinction between list items and body text
- Poor accessibility for screen readers

## Solution Statement
Parse the streaming text during or after completion to identify structural elements (headings, bullet points, bold text, citations) and render them as proper HTML components. Create a custom markdown-like parser that converts:
- `## Heading Text` → `<h3>` tags with proper styling
- `**Bold text**` → `<strong>` tags
- `- List item` → `<li>` within `<ul>` structure
- `[citation number]` → Inline citation pill components with source linking
- Paragraph breaks → Proper `<p>` tag separation

Implement this as an enhanced version of the `StreamingText` component that can handle both streaming (progressive parsing) and complete state (full parsing).

## Relevant Files
Use these files to implement the feature:

- **`app/womens-world/answers/page.tsx`** (Lines 1-331)
  - Main answer page component containing state management and streaming logic
  - Currently uses `StreamingText` component for text display (line 249)
  - Manages answer data including sources array
  - Needs integration with new formatted text component

- **`components/widget_components/ai-elements/streaming-text.tsx`** (Lines 1-16)
  - Current simple streaming text component with plain paragraph rendering
  - Needs to be enhanced or replaced with structured text parser
  - Handles streaming cursor animation
  - Should maintain streaming capability while adding format parsing

- **`components/widget_components/ai-elements/attribution-bar.tsx`**
  - Already exists for source count display
  - Can be referenced for citation pill styling consistency
  - Provides design patterns for source references

- **`components/widget_components/types.ts`**
  - Contains `StreamingTextProps` interface
  - May need extension for formatted text props
  - Includes `AttributionSource` type for citation data

- **`lib/utils.ts`**
  - Contains `cn()` utility for class merging
  - May need additional text parsing utilities

### New Files

- **`components/widget_components/ai-elements/formatted-text.tsx`**
  - New component for parsing and rendering structured markdown-like text
  - Handles sections, bullets, bold text, citations
  - Maintains streaming animation support
  - Uses React 19.2 patterns with proper ref forwarding

- **`lib/text-parser.ts`**
  - Utility functions for parsing markdown-like syntax
  - Extract sections, lists, citations from text
  - Progressive parsing for streaming support
  - Type-safe parsing results

- **`components/widget_components/ai-elements/inline-citation.tsx`**
  - Small pill component for inline source citations
  - Clickable to show source details
  - Consistent with attribution bar styling
  - Accessible with proper ARIA labels

## shadcn/ui Components
### Existing Components to Use
- **`components/ui/badge.tsx`** - For inline citation pills (may need variant customization)
- No other shadcn/ui components needed - will use custom components following shadcn patterns

### New Components to Add
None - existing badge component can be customized with variants

### Custom Components to Create
- **`InlineCitation`** - Custom citation pill component following shadcn/ui patterns (CVA variants, forwardRef, CSS variables, cn() utility)
- **`FormattedText`** - Custom formatted text renderer following shadcn/ui composition patterns
- All custom components will use CVA for variants, React.forwardRef, CSS variables from theme, and cn() utility for class merging

## Implementation Plan
### Phase 1: Foundation
1. Create text parsing utilities in `lib/text-parser.ts` to extract structural elements from text
2. Define TypeScript interfaces for parsed text structure (sections, paragraphs, lists, citations)
3. Implement progressive parsing algorithm for streaming support
4. Create unit tests for parsing logic with various text patterns

### Phase 2: Core Implementation
1. Create `InlineCitation` component with badge-based styling and click handling
2. Build `FormattedText` component with section, list, and citation rendering
3. Integrate parsing utilities with streaming text display
4. Add proper semantic HTML structure (h3, ul, li, strong, p tags)
5. Implement citation click handling to show source details
6. Style components using Tailwind and CSS variables from theme

### Phase 3: Integration
1. Replace `StreamingText` usage in answer page with `FormattedText`
2. Pass source data to `FormattedText` for citation resolution
3. Test streaming animation with formatted text
4. Ensure accessibility with proper ARIA labels and semantic HTML
5. Add responsive styles for mobile/tablet viewing
6. Test with various answer text patterns and lengths

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create Text Parsing Utilities
- Create `lib/text-parser.ts` with parsing functions
- Implement `parseSection()` to extract `## Heading` patterns
- Implement `parseBulletList()` to extract `- Item` patterns
- Implement `parseBoldText()` to extract `**text**` patterns
- Implement `parseCitations()` to extract `[number]` patterns
- Implement `parseFormattedText()` master function for full text parsing
- Add TypeScript interfaces: `ParsedSection`, `ParsedParagraph`, `ParsedListItem`, `ParsedText`
- Write unit tests for each parsing function with edge cases

### Step 2: Create Inline Citation Component
- Create `components/widget_components/ai-elements/inline-citation.tsx`
- Use CVA for variant definitions (default, clickable)
- Implement React.forwardRef pattern for DOM access
- Add props: `sourceNumber`, `onClick`, `sources`, `className`
- Style as small blue pill badge consistent with design system
- Add hover effect and cursor pointer for clickable state
- Include ARIA label: "Source {number}"
- Export component with displayName set

### Step 3: Create Formatted Text Component
- Create `components/widget_components/ai-elements/formatted-text.tsx`
- Accept props: `text`, `isComplete`, `sources`, `onCitationClick`, `className`
- Implement progressive parsing for streaming state (parse incrementally as text arrives)
- Implement full parsing for complete state
- Render sections with `<h3>` tags and proper styling
- Render bullet lists with `<ul>` and `<li>` structure
- Render bold text with `<strong>` tags
- Render inline citations with `InlineCitation` component
- Maintain streaming cursor animation when `isComplete={false}`
- Use semantic HTML for accessibility
- Apply prose styling for consistent typography
- Export component with TypeScript types

### Step 4: Update TypeScript Types
- Update `components/widget_components/types.ts`
- Add `FormattedTextProps` interface extending `StreamingTextProps`
- Add `InlineCitationProps` interface
- Add `ParsedTextStructure` type for parsed content
- Ensure compatibility with existing `AttributionSource` type

### Step 5: Integrate with Answer Page
- Update `app/womens-world/answers/page.tsx` (line 249)
- Replace `StreamingText` with `FormattedText` component
- Pass `sources={answerData?.sources}` prop for citation resolution
- Implement `handleCitationClick` to show source details (modal or scroll to attribution cards)
- Test streaming behavior with formatted text
- Verify citation numbers match source array indices
- Ensure smooth transition from streaming to complete state

### Step 6: Style and Polish
- Add responsive styles for mobile (smaller font sizes, adjusted spacing)
- Ensure proper line spacing between sections and lists
- Style headings with Women's World brand colors (purple/orange accent)
- Add subtle animations for citation pill hover states
- Verify color contrast meets WCAG AA standards
- Test with long and short answer text variations

### Step 7: Accessibility and Testing
- Verify screen reader navigation through formatted content
- Test keyboard navigation for citation pills
- Ensure proper heading hierarchy (h1 → h3 progression)
- Add focus visible styles for citation pills
- Test with various screen sizes and devices
- Manually test complete user flow: search → streaming → formatted answer → citation clicks

### Step 8: Run Validation Commands
- Execute all validation commands listed below to ensure zero regressions
- Fix any TypeScript errors or build issues
- Test the feature end-to-end in browser
- Verify all formatting renders correctly with live streaming
- Confirm citations link to correct sources

## Testing Strategy
### Unit Tests
- **Text Parser Tests** (`lib/text-parser.test.ts`)
  - Test section heading extraction with various formats
  - Test bullet list parsing with nested lists and edge cases
  - Test bold text extraction with multiple occurrences
  - Test citation number extraction and validation
  - Test progressive parsing with partial text
  - Test edge cases: empty text, no formatting, malformed syntax

- **Component Tests**
  - Test `InlineCitation` renders correctly with source number
  - Test citation click handler fires with correct source data
  - Test `FormattedText` renders sections, lists, bold text correctly
  - Test streaming cursor animation appears during streaming
  - Test formatted text updates as streaming text arrives

### Integration Tests
- **Answer Page Integration**
  - Test complete flow: query submission → loading → streaming → formatted complete answer
  - Test citation clicks resolve to correct sources
  - Test formatted text displays correctly with real API streaming data
  - Test responsive layout on mobile and desktop
  - Test source count matches citations in text

### Edge Cases
- Empty answer text (no content streamed)
- Answer with no citations (no `[number]` patterns)
- Answer with no bullet points (pure paragraph text)
- Answer with no section headings (no `## Text` patterns)
- Very long answer text (multiple screens)
- Malformed markdown syntax (unclosed `**`, invalid citation numbers)
- Citation numbers that exceed available sources
- Streaming interrupted mid-word or mid-format marker
- Unicode characters and special symbols in formatted text
- Rapid format marker changes during streaming

## Acceptance Criteria
- [ ] Answer text displays with proper section headings (`<h3>` tags) rendered from `## Text` patterns
- [ ] Bullet lists render as structured `<ul>`/`<li>` elements from `- Item` patterns
- [ ] Bold text renders with `<strong>` tags from `**text**` patterns
- [ ] Inline citations appear as small blue pills with source numbers
- [ ] Clicking citation pills shows corresponding source details (scroll to attribution cards or modal)
- [ ] Streaming animation works correctly with formatted text (progressive parsing)
- [ ] Citation numbers correctly match source array indices
- [ ] Formatted text is fully accessible (semantic HTML, ARIA labels, keyboard navigation)
- [ ] Responsive layout works on mobile, tablet, and desktop
- [ ] Color contrast meets WCAG AA standards
- [ ] No regressions in existing streaming, loading, or error states
- [ ] Build completes with zero TypeScript errors
- [ ] Manual testing confirms smooth user experience from search to formatted answer

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually test the feature end-to-end
- Navigate to `http://localhost:3000/womens-world/answers?q=What%20are%20natural%20ways%20to%20boost%20energy%3F`
- Verify formatted text renders with sections, bullets, bold text, and inline citation pills
- Click citation pills and verify source details display correctly
- Test with different queries to verify parsing works with various text patterns
- Test responsive layout by resizing browser window
- Test keyboard navigation through formatted content and citation pills
- Verify streaming animation works smoothly with progressive parsing
- Check browser console for any errors or warnings

## Notes
- **Parsing Strategy**: Use progressive parsing during streaming to avoid UI lag. Parse incrementally as chunks arrive, maintaining state of partial format markers (e.g., incomplete `**` or `##`).
- **Citation Resolution**: Map citation numbers `[1]`, `[2]` etc. to indices in the `sources` array. Handle cases where citation numbers exceed available sources gracefully (show number but disable click).
- **Streaming Performance**: Test with long answers (2000+ words) to ensure parsing doesn't cause janky streaming animations. Consider debouncing parse operations during rapid chunk arrival.
- **Future Enhancement**: Consider adding support for additional markdown features: links, code blocks, nested lists, tables. Keep parser extensible for future syntax additions.
- **Accessibility**: Use semantic HTML as primary accessibility strategy. Supplement with ARIA only where semantic HTML is insufficient (e.g., citation pill click actions).
- **Design Consistency**: Maintain visual consistency with existing Women's World widget components. Use same color palette (orange/purple gradients) and spacing patterns.
- **Error Handling**: Handle malformed markdown gracefully - render as plain text if parsing fails. Log parsing errors for debugging but don't break user experience.
- **Testing with Real API**: The Gist API streaming format may vary. Test with live API responses to ensure parser handles real-world text patterns correctly. May need adjustments based on actual API response format.
