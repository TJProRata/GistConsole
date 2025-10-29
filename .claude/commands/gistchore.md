# Chore Planning

Create a new plan in specs/*.md to resolve the `Chore` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

- You're writing a plan to resolve a chore, it should be simple but we need to be thorough and precise so we don't miss anything or waste time with any second round of changes.
- Create the plan in the `specs/active/YYYY-MM-DD-HHMM-{chore-name}.md` file. Name it appropriately based on the `Chore`.
- Use today's date and time in YYYY-MM-DD-HHMM format (24-hour time) as the filename prefix.
- Example: For a chore 'refactor authentication' created on Oct 29, 2025 at 9:15 AM, the filename would be: `specs/active/2025-10-29-0915-refactor-authentication.md`
- Use the plan format below to create the plan.
- Research the codebase and put together a plan to accomplish the chore.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to accomplish the chore.
- Use your reasoning model: THINK HARD about the plan and the steps to accomplish the chore.
- **Use shadcn/ui components**: If UI changes are needed, always use existing shadcn/ui components from `components/ui/`.
- **Follow shadcn/ui best practices**: Read `ai_docs/shadcn/shadcn_component_library_bp.md` for component maintenance, styling, and update patterns.
- **Update components properly**: When updating shadcn/ui components, maintain CVA variants, forwardRef patterns, CSS variables, and accessibility features.
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.

## Relevant Files

Focus on the following files:
- `README.md` - Contains the project overview and setup instructions.
- `app/**` - Next.js 16 App Router pages and layouts (React 19.2).
- `convex/**` - Convex backend (schema, queries, mutations, auth config).
- `components/**` - React components (UI components, Header).
- `components/ui/**` - shadcn/ui component library (button, card, form, input, label).
- `lib/utils.ts` - Utility functions including cn() for class name merging.
- `ai_docs/shadcn/shadcn_component_library_bp.md` - shadcn/ui best practices and maintenance patterns.
- `middleware.ts` - Clerk authentication middleware.
- `package.json` - Dependencies and scripts.

Ignore all other files in the codebase.

## Plan Format

```md
# Chore: <chore name>

## Chore Description
<describe the chore in detail>

## Relevant Files
Use these files to resolve the chore:

<find and list the files that are relevant to the chore describe why they are relevant in bullet points. If there are new files that need to be created to accomplish the chore, list them in an h3 'New Files' section.>

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. use as many h3 headers as needed to accomplish the chore. Order matters, start with the foundational shared changes required to fix the chore then move on to the specific changes required to fix the chore. Your last step should be running the `Validation Commands` to validate the chore is complete with zero regressions.>

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

<list commands you'll use to validate with 100% confidence the chore is complete with zero regressions. every command must execute without errors so be specific about what you want to run to validate the chore is complete with zero regressions. Don't validate with curl commands.>
- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete
- `bun test` - Run tests to validate the chore is complete with zero regressions (if tests exist)

## Notes
<optionally list any additional notes or context that are relevant to the chore that will be helpful to the developer>
```

## Chore
$ARGUMENTS