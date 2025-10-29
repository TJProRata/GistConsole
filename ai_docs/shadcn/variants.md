# shadcn/ui Variants: Complete Guide

> Deep dive into the variant system powered by class-variance-authority (CVA)

## Table of Contents

1. [What Are Variants?](#what-are-variants)
2. [Basic Variant Structure](#basic-variant-structure)
3. [Variant Types](#variant-types)
4. [Compound Variants](#compound-variants)
5. [Default Variants](#default-variants)
6. [TypeScript Integration](#typescript-integration)
7. [Real-World Examples](#real-world-examples)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)

---

## What Are Variants?

Variants provide a **systematic, type-safe way to create component style variations** while maintaining consistency across your design system.

### Why Variants?

**Without Variants (Inconsistent):**

```typescript
// Different implementations, hard to maintain
<Button className="bg-blue-500 text-white px-4 py-2" />
<Button className="bg-red-500 text-white px-4 py-2" />
<Button className="bg-blue-500 text-white px-2 py-1 text-sm" />
```

**With Variants (Systematic):**

```typescript
// Consistent, maintainable API
<Button variant="default" size="md" />
<Button variant="destructive" size="md" />
<Button variant="default" size="sm" />
```

### Benefits

- ✅ **Type Safety**: TypeScript autocomplete for all variants
- ✅ **Consistency**: Centralized style definitions
- ✅ **Maintainability**: Update styles in one place
- ✅ **Composability**: Combine variants together
- ✅ **Documentation**: Self-documenting API

---

## Basic Variant Structure

### The CVA Function

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const componentVariants = cva(
  // 1. Base classes (always applied)
  "base-class-1 base-class-2",

  // 2. Configuration object
  {
    variants: {
      // Variant definitions
    },
    defaultVariants: {
      // Default values
    },
  }
);
```

### Complete Button Example

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. Define variants
const buttonVariants = cva(
  // Base classes - always applied to every button
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Visual variant
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Size variant
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// 2. Extract TypeScript types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// 3. Implement component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Usage

```typescript
// Uses default variant and size
<Button>Click me</Button>

// Specify variant
<Button variant="destructive">Delete</Button>

// Specify size
<Button size="lg">Large Button</Button>

// Combine variants
<Button variant="outline" size="sm">Small Outline</Button>

// Add custom classes
<Button variant="ghost" className="w-full">
  Full Width Ghost
</Button>
```

---

## Variant Types

### 1. Visual Variants (Appearance)

Define different visual styles for the same component.

```typescript
const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600",
        warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600",
      }
    }
  }
)

// Usage
<Alert variant="default">Info message</Alert>
<Alert variant="destructive">Error message</Alert>
<Alert variant="success">Success message</Alert>
<Alert variant="warning">Warning message</Alert>
```

### 2. Size Variants

Control component dimensions systematically.

```typescript
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    }
  }
)

// Usage
<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>
```

### 3. State Variants

Represent different component states.

```typescript
const inputVariants = cva(
  "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
  {
    variants: {
      state: {
        default: "border-input focus-visible:ring-2 focus-visible:ring-ring",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        disabled: "cursor-not-allowed opacity-50",
      }
    }
  }
)

// Usage
<Input state="default" />
<Input state="error" />
<Input state="success" />
<Input state="disabled" disabled />
```

### 4. Layout Variants

Control positioning and spacing.

```typescript
const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      width: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        full: "max-w-full",
      },
      padding: {
        none: "px-0",
        sm: "px-4",
        md: "px-6",
        lg: "px-8",
      }
    }
  }
)

// Usage
<Container width="lg" padding="md">
  Content
</Container>
```

### 5. Boolean Variants

Use boolean flags for on/off features.

```typescript
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground",
  {
    variants: {
      hoverable: {
        true: "transition-shadow hover:shadow-lg cursor-pointer",
        false: "",
      },
      bordered: {
        true: "border-2 border-primary",
        false: "border",
      },
      padded: {
        true: "p-6",
        false: "p-0",
      }
    }
  }
)

// Usage
<Card hoverable bordered padded>
  Interactive card with border and padding
</Card>
```

---

## Compound Variants

Compound variants apply styles when **multiple variant conditions are met**.

### Basic Compound Variants

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      }
    },
    compoundVariants: [
      // Special case: outline + small = tighter spacing
      {
        variant: "outline",
        size: "sm",
        class: "px-2 border-2",
      },
      // Special case: default + large = bolder text
      {
        variant: "default",
        size: "lg",
        class: "font-bold text-base",
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    }
  }
)

// When variant="outline" AND size="sm", the compound variant styles apply
<Button variant="outline" size="sm">
  Outline Small (gets px-2 border-2)
</Button>
```

### Complex Compound Variants

```typescript
const cardVariants = cva("rounded-lg border p-6", {
  variants: {
    variant: {
      default: "bg-card",
      primary: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
    size: {
      sm: "p-4 text-sm",
      default: "p-6 text-base",
      lg: "p-8 text-lg",
    },
    elevated: {
      true: "shadow-lg",
      false: "",
    },
  },
  compoundVariants: [
    // Primary + elevated = extra shadow
    {
      variant: "primary",
      elevated: true,
      class: "shadow-xl shadow-primary/50",
    },
    // Destructive + elevated = red shadow
    {
      variant: "destructive",
      elevated: true,
      class: "shadow-xl shadow-destructive/50",
    },
    // Large + elevated = more shadow
    {
      size: "lg",
      elevated: true,
      class: "shadow-2xl",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
    elevated: false,
  },
});
```

---

## Default Variants

Always specify default variants to ensure predictable behavior.

```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        sm: "small-styles",
        md: "medium-styles",
        lg: "large-styles",
      }
    },
    // IMPORTANT: Define defaults
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
)

// This button will use variant="default" and size="md"
<Button>Click me</Button>

// Explicit props override defaults
<Button variant="secondary" size="lg">
  Large Secondary
</Button>
```

### When Defaults Matter

```typescript
// Without default variants
const badVariants = cva("base", {
  variants: {
    color: {
      red: "bg-red-500",
      blue: "bg-blue-500",
    }
  }
  // No defaultVariants!
})

// This renders with NO color variant applied
<Component /> // Only has "base" class

// With default variants
const goodVariants = cva("base", {
  variants: {
    color: {
      red: "bg-red-500",
      blue: "bg-blue-500",
    }
  },
  defaultVariants: {
    color: "blue", // ✅ Default specified
  }
})

// This renders with blue color
<Component /> // Has "base bg-blue-500"
```

---

## TypeScript Integration

### Extract Variant Types

```typescript
import { type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base", {
  variants: {
    variant: {
      default: "default-styles",
      destructive: "destructive-styles",
    },
    size: {
      sm: "sm-styles",
      lg: "lg-styles",
    },
  },
});

// Extract variant props as TypeScript type
type ButtonVariants = VariantProps<typeof buttonVariants>;
// Equivalent to:
// {
//   variant?: "default" | "destructive"
//   size?: "sm" | "lg"
// }
```

### Component Interface

```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// TypeScript now knows about:
// - All HTML button attributes (onClick, disabled, etc.)
// - Variant props (variant, size)
// - Custom props (asChild)
```

### Full TypeScript Example

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

// Extract variant props
export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

export { Alert, alertVariants }
```

### Using in Components

```typescript
// TypeScript autocomplete works!
<Button
  variant="default" // ✅ Autocompletes: "default" | "destructive" | "outline" | ...
  size="lg"         // ✅ Autocompletes: "default" | "sm" | "lg" | "icon"
/>

// TypeScript catches errors
<Button variant="invalid" /> // ❌ Error: Type '"invalid"' is not assignable
```

---

## Real-World Examples

### 1. Badge Component

```typescript
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Usage
<Badge variant="default">New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Completed</Badge>
```

### 2. Input Component with States

```typescript
const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        error: "border-destructive focus-visible:ring-2 focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-2 focus-visible:ring-green-500",
      },
      inputSize: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

// Usage
<Input variant="default" />
<Input variant="error" placeholder="Email is required" />
<Input variant="success" inputSize="lg" />
```

### 3. Card with Multiple Variant Types

```typescript
const cardVariants = cva(
  "rounded-lg border text-card-foreground",
  {
    variants: {
      variant: {
        default: "bg-card",
        elevated: "bg-card shadow-lg",
        outline: "bg-transparent border-2",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      hoverable: {
        true: "transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        false: "",
      }
    },
    compoundVariants: [
      {
        variant: "elevated",
        hoverable: true,
        class: "hover:shadow-2xl",
      }
    ],
    defaultVariants: {
      variant: "default",
      padding: "default",
      hoverable: false,
    }
  }
)

// Usage
<Card variant="elevated" padding="lg" hoverable>
  Interactive elevated card
</Card>
```

### 4. Typography Component

```typescript
const typographyVariants = cva(
  "",
  {
    variants: {
      variant: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
        h4: "scroll-m-20 text-xl font-semibold tracking-tight",
        p: "leading-7 [&:not(:first-child)]:mt-6",
        lead: "text-xl text-muted-foreground",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-sm text-muted-foreground",
      }
    },
    defaultVariants: {
      variant: "p",
    }
  }
)

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements
}

function Typography({
  className,
  variant,
  as,
  ...props
}: TypographyProps) {
  const Comp = as || "p"
  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

// Usage
<Typography variant="h1" as="h1">Heading</Typography>
<Typography variant="lead">Lead paragraph</Typography>
<Typography variant="muted">Muted text</Typography>
```

---

## Best Practices

### 1. Use Semantic Naming

```typescript
// ❌ Bad: Appearance-based names
const buttonVariants = cva("base", {
  variants: {
    color: {
      blue: "bg-blue-500",
      red: "bg-red-500",
      gray: "bg-gray-500",
    },
  },
});

// ✅ Good: Purpose-based names
const buttonVariants = cva("base", {
  variants: {
    variant: {
      default: "bg-primary",
      destructive: "bg-destructive",
      secondary: "bg-secondary",
    },
  },
});
```

### 2. Always Set Default Variants

```typescript
// ❌ Bad: No defaults
const badVariants = cva("base", {
  variants: {
    variant: {
      /* ... */
    },
  },
});

// ✅ Good: Explicit defaults
const goodVariants = cva("base", {
  variants: {
    variant: {
      /* ... */
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
```

### 3. Keep Base Classes Consistent

```typescript
// Base classes should contain styles that ALWAYS apply
const buttonVariants = cva(
  // These are ALWAYS on every button
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Variants add to or override base
    },
  }
);
```

### 4. Use Compound Variants Sparingly

```typescript
// Only use compound variants for truly unique combinations
const buttonVariants = cva("base", {
  variants: {
    variant: {
      /* ... */
    },
    size: {
      /* ... */
    },
  },
  compoundVariants: [
    // Only when combination needs special treatment
    {
      variant: "ghost",
      size: "sm",
      class: "hover:bg-accent/50", // Ghost + small needs lighter hover
    },
  ],
});
```

### 5. Group Related Variants

```typescript
const cardVariants = cva("base", {
  variants: {
    // Visual variants
    variant: {
      /* ... */
    },

    // Size variants
    size: {
      /* ... */
    },
    padding: {
      /* ... */
    },

    // State variants
    hoverable: {
      /* ... */
    },
    selected: {
      /* ... */
    },

    // Layout variants
    width: {
      /* ... */
    },
    alignment: {
      /* ... */
    },
  },
});
```

### 6. Leverage CSS Variables

```typescript
// Use design tokens for consistency
const buttonVariants = cva("base", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground", // Uses CSS variables
      destructive: "bg-destructive text-destructive-foreground",
    },
  },
});
```

---

## Common Patterns

### Pattern 1: Responsive Variants

```typescript
const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-screen-sm px-4",
      md: "max-w-screen-md px-6 sm:px-8",
      lg: "max-w-screen-lg px-8 sm:px-12",
      xl: "max-w-screen-xl px-8 md:px-16",
    },
  },
});
```

### Pattern 2: Loading States

```typescript
const buttonVariants = cva("base", {
  variants: {
    loading: {
      true: "relative text-transparent pointer-events-none",
      false: "",
    }
  }
})

function Button({ loading, children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader className="h-4 w-4 animate-spin" />
        </span>
      )}
      {children}
    </button>
  )
}
```

### Pattern 3: Icon Variants

```typescript
const buttonVariants = cva("base", {
  variants: {
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10", // Square for icon-only buttons
    }
  }
})

// Usage
<Button size="icon">
  <TrashIcon className="h-4 w-4" />
</Button>
```

### Pattern 4: Nested Element Styling

```typescript
const cardVariants = cva(
  "rounded-lg border p-6",
  {
    variants: {
      variant: {
        default: "bg-card [&_h3]:text-card-foreground",
        primary: "bg-primary [&_h3]:text-primary-foreground",
      }
    }
  }
)

// The [&_h3] selector targets nested h3 elements
<Card variant="primary">
  <h3>This heading inherits primary-foreground color</h3>
</Card>
```

### Pattern 5: Conditional Rendering with Variants

```typescript
const alertVariants = cva("base", {
  variants: {
    variant: {
      default: "[&>svg]:text-foreground",
      destructive: "[&>svg]:text-destructive",
      success: "[&>svg]:text-green-600",
    }
  }
})

function Alert({ variant, icon, children }: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }))}>
      {icon && <div>{icon}</div>}
      {children}
    </div>
  )
}
```

---

## Summary

**Variants** are the foundation of systematic component styling in shadcn/ui:

- **Use CVA** for type-safe, maintainable variant definitions
- **Always set defaults** to ensure predictable behavior
- **Leverage TypeScript** for autocomplete and type safety
- **Use compound variants** for special case combinations
- **Follow semantic naming** for better maintainability
- **Keep base classes minimal** and let variants do the work

Variants transform components from ad-hoc implementations into a **systematic, scalable design system**.
