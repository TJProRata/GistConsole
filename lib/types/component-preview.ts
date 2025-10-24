/**
 * Component Preview Variant Types
 *
 * Type definitions for the component variant toggle system.
 * These types enable components to declare multiple variants that users
 * can switch between in the preview UI.
 */

/**
 * Configuration for a single component variant
 */
export interface VariantConfig {
  /** Unique identifier for the variant (e.g., "default", "destructive") */
  name: string;
  /** Display label shown in the UI (e.g., "Default", "Destructive") */
  label: string;
  /** Optional description explaining what the variant does */
  description?: string;
}

/**
 * Metadata for components that support variants
 */
export interface ComponentMetadata {
  /** Array of available variants for this component */
  variants: VariantConfig[];
  /** The default variant to show when component first loads */
  defaultVariant: string;
}

/**
 * Props interface for demo components that support variants
 */
export interface ComponentDemoProps {
  /** The currently selected variant name */
  variant?: string;
}

/**
 * Extended demo component type with variant metadata
 */
export type DemoComponentWithVariants = React.ComponentType<ComponentDemoProps> & {
  variants?: VariantConfig[];
  defaultVariant?: string;
};
