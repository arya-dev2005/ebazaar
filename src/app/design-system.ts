/**
 * E-Commerce Application Design System
 * 
 * This file defines the visual language for the application, including:
 * - Colors (CSS variables and Tailwind mappings)
 * - Typography (font sizes, weights, line heights)
 * - Spacing (padding, margins, gaps)
 * - UI Standards (borders, shadows, transitions)
 * 
 * All tokens are designed to work with the existing dark theme.
 * The system uses Tailwind CSS classes where applicable, with CSS variables
 * as the source of truth for colors.
 */

// ============================================================================
// COLORS
// ============================================================================

/**
 * Color Palette
 * 
 * Primary: Deep indigo/slate tones - Used for main actions, branding
 * Secondary: Neutral grays - Used for backgrounds, borders
 * Accent: Vibrant amber/orange - Used for CTAs, prices, important highlights
 * Background: Dark theme with slate base
 * Text: Hierarchical white/gray tones
 */

export const colors = {
    // Primary - Deep indigo (brand color, primary actions)
    primary: {
        DEFAULT: '#6366f1',      // Indigo-500 - Main primary color
        hover: '#818cf8',        // Indigo-400 - Hover state
        light: '#a5b4fc',        // Indigo-300 - Subtle highlights
        dark: '#4f46e5',         // Indigo-600 - Pressed state
    },

    // Accent - Amber/Orange (CTAs, prices, important elements)
    accent: {
        DEFAULT: '#f59e0b',      // Amber-500 - Main accent (prices, CTAs)
        hover: '#fbbf24',        // Amber-400 - Hover state
        light: '#fcd34d',        // Amber-300 - Subtle highlights
        dark: '#d97706',         // Amber-600 - Pressed state
    },

    // Background - Dark theme
    background: {
        base: '#0f172a',         // Slate-900 - Main background
        surface: '#0f172a',      // Slate-900 - Container backgrounds
        elevated: '#1e293b',     // Slate-800 - Cards, elevated surfaces
        card: '#1e293b',         // Slate-800 - Card backgrounds
    },

    // Border colors
    border: {
        DEFAULT: '#334155',      // Slate-700 - Default borders
        light: '#475569',        // Slate-600 - Lighter borders
        subtle: '#1e293b',       // Slate-800 - Subtle dividers
    },

    // Text hierarchy
    text: {
        primary: '#f8fafc',      // Slate-50 - Primary text (headings, body)
        secondary: '#cbd5e1',    // Slate-300 - Secondary text
        muted: '#94a3b8',        // Slate-400 - Muted/placeholder text
        inverse: '#0f172a',      // Slate-900 - Text on light backgrounds
    },

    // Semantic colors
    semantic: {
        success: '#22c55e',      // Green-500 - Success states
        warning: '#eab308',      // Yellow-500 - Warning states
        error: '#ef4444',        // Red-500 - Error states
        info: '#3b82f6',         // Blue-500 - Info states
    },

    // Tailwind class mappings (for reference)
    tailwind: {
        primary: 'bg-indigo-500 hover:bg-indigo-400',
        accent: 'bg-amber-500 hover:bg-amber-400',
        background: 'bg-slate-900',
        surface: 'bg-slate-800',
        textPrimary: 'text-slate-50',
        textMuted: 'text-slate-400',
    },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Typography System
 * 
 * Font Family: Inter (configured in layout.tsx)
 * 
 * Rationale:
 * - Inter is a highly readable, modern sans-serif font
 * - Optimized for screens with excellent legibility at all sizes
 * - Widely used in modern web applications
 */

export const typography = {
    // Font family
    fontFamily: {
        sans: 'Inter, system-ui, sans-serif',
        // Tailwind: font-sans
    },

    // Font sizes
    fontSize: {
        // Display - Hero sections, large announcements
        display: {
            '4xl': '2.25rem',    // 36px - h1 equivalent
            '5xl': '3rem',       // 48px - Hero headings
            '6xl': '3.75rem',    // 60px - Large hero
        },

        // Headings
        h1: {
            value: '2.25rem',    // 36px
            lineHeight: '2.5rem', // 40px
            className: 'text-4xl font-bold',
            // Tailwind: text-4xl font-bold leading-tight
        },
        h2: {
            value: '1.5rem',     // 24px
            lineHeight: '2rem',  // 32px
            className: 'text-2xl font-semibold',
            // Tailwind: text-2xl font-semibold
        },
        h3: {
            value: '1.25rem',    // 20px
            lineHeight: '1.75rem', // 28px
            className: 'text-xl font-semibold',
            // Tailwind: text-xl font-semibold
        },
        h4: {
            value: '1.125rem',   // 18px
            lineHeight: '1.75rem', // 28px
            className: 'text-lg font-medium',
            // Tailwind: text-lg font-medium
        },

        // Body text
        body: {
            base: {
                value: '1rem',      // 16px
                lineHeight: '1.5rem', // 24px
                className: 'text-base',
                // Tailwind: text-base
            },
            small: {
                value: '0.875rem',  // 14px
                lineHeight: '1.25rem', // 20px
                className: 'text-sm',
                // Tailwind: text-sm
            },
            xs: {
                value: '0.75rem',   // 12px
                lineHeight: '1rem', // 16px
                className: 'text-xs',
                // Tailwind: text-xs
            },
        },

        // Special text
        label: {
            value: '0.875rem',   // 14px
            lineHeight: '1.25rem', // 20px
            className: 'text-sm font-medium',
            // Tailwind: text-sm font-medium
        },
        caption: {
            value: '0.75rem',    // 12px
            lineHeight: '1rem',  // 16px
            className: 'text-xs text-slate-400',
            // Tailwind: text-xs text-slate-400
        },
    },

    // Font weights
    fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        // Tailwind: font-normal, font-medium, font-semibold, font-bold
    },

    // Letter spacing
    letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        // Tailwind: tracking-tight, tracking-normal, tracking-wide
    },
} as const;

// ============================================================================
// SPACING
// ============================================================================

/**
 * Spacing System
 * 
 * Rationale:
 * - Uses a consistent scale based on 4px increments
 * - py-16/py-20 for sections provides adequate breathing room
 * - max-w-7xl container keeps content readable on large screens
 * - gap-4 to gap-6 for component spacing
 */

export const spacing = {
    // Section spacing
    section: {
        py: {
            default: '4rem',      // py-16 - Default section padding
            large: '5rem',         // py-20 - Large section padding
            compact: '3rem',      // py-12 - Compact sections
        },
        // Tailwind: py-16, py-20, py-12
    },

    // Container
    container: {
        maxWidth: '80rem',       // max-w-7xl - 1280px
        padding: '1rem',        // px-4 - Side padding
        paddingLG: '2rem',      // px-8 - Large screen padding
        // Tailwind: max-w-7xl px-4 (mobile) md:px-8 (tablet+)
    },

    // Component gaps
    gap: {
        xs: '0.5rem',           // gap-2 - Tight spacing
        sm: '1rem',             // gap-4 - Default small gap
        md: '1.5rem',           // gap-6 - Medium gap
        lg: '2rem',             // gap-8 - Large gap
        xl: '3rem',             // gap-12 - Extra large gap
        // Tailwind: gap-2, gap-4, gap-6, gap-8, gap-12
    },

    // Card padding
    card: {
        padding: '1rem',        // p-4 - Compact card
        paddingLG: '1.5rem',    // p-6 - Standard card
        paddingXL: '2rem',      // p-8 - Large card
        // Tailwind: p-4, p-6, p-8
    },

    // Element spacing
    element: {
        xs: '0.25rem',          // 4px
        sm: '0.5rem',           // 8px
        md: '1rem',             // 16px
        lg: '1.5rem',           // 24px
        xl: '2rem',             // 32px
        '2xl': '3rem',          // 48px
        // Tailwind: m-1, m-2, m-4, m-6, m-8, m-12
    },
} as const;

// ============================================================================
// UI STANDARDS
// ============================================================================

/**
 * UI Standards
 * 
 * Defines reusable component styling patterns:
 * - Border radius for consistent shaping
 * - Shadows for depth and hierarchy
 * - Transitions for smooth interactions
 * - Hover states for feedback
 */

export const ui = {
    // Border radius
    borderRadius: {
        none: '0',
        sm: '0.25rem',          // rounded - Small elements
        DEFAULT: '0.5rem',      // rounded-lg - Buttons, inputs
        md: '0.5rem',           // rounded-lg - Medium elements
        lg: '0.75rem',          // rounded-xl - Larger elements
        xl: '1rem',             // rounded-2xl - Cards, panels
        '2xl': '1.5rem',        // rounded-2xl - Large cards
        full: '9999px',         // rounded-full - Pills, avatars
        // Tailwind: rounded, rounded-lg, rounded-xl, rounded-2xl, rounded-full

        // Component-specific
        button: '0.5rem',       // rounded-lg - Standard button
        input: '0.5rem',        // rounded-lg - Input fields
        card: '1rem',           // rounded-xl - Card containers
        badge: '9999px',        // rounded-full - Status badges
    },

    // Shadows
    shadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        // Tailwind: shadow, shadow-md, shadow-lg, shadow-xl

        // Custom shadows
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        cardHover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        button: '0 4px 6px -1px rgb(99 102 241 / 0.3)', // Indigo glow
        glow: '0 0 15px rgb(245 158 11 / 0.3)',        // Amber glow
    },

    // Transitions
    transition: {
        duration: {
            fast: '150ms',        // duration-150 - Quick transitions
            DEFAULT: '200ms',    // duration-200 - Standard transitions
            slow: '300ms',       // duration-300 - Smooth transitions
            slower: '500ms',     // duration-500 - Emphasis
        },
        timing: {
            DEFAULT: 'ease-in-out',
            in: 'ease-in',
            out: 'ease-out',
        },
        // Tailwind: duration-150, duration-200, duration-300, duration-500

        // Common transitions
        all: 'all 200ms ease-in-out',
        color: 'color 200ms ease-in-out',
        transform: 'transform 200ms ease-in-out',
    },

    // Hover states
    hover: {
        // Scale transforms
        scale: {
            sm: 'scale-102',     // 1.02
            DEFAULT: 'scale-105', // 1.05
            lg: 'scale-110',     // 1.10
        },
        // Tailwind: hover:scale-105

        // Brightness
        brightness: {
            light: 'brightness-110',
            DEFAULT: 'brightness-125',
        },
        // Tailwind: hover:brightness-110, hover:brightness-125

        // Opacity
        opacity: {
            reduce: 'opacity-80',
            increase: 'opacity-90',
        },

        // Common hover combinations
        button: 'hover:scale-105 hover:brightness-110',
        card: 'hover:shadow-xl hover:scale-[1.02]',
        link: 'hover:text-white',
    },

    // Focus states
    focus: {
        ring: 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900',
        ringOffset: 'focus:ring-offset-2',
        // Tailwind: focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
    },

    // Z-index layers
    zIndex: {
        dropdown: 'z-50',
        modal: 'z-50',
        tooltip: 'z-60',
        toast: 'z-70',
        // Tailwind: z-50, z-60, z-70
    },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Breakpoint references (Tailwind defaults)
 */

export const breakpoints = {
    sm: '640px',    // sm
    md: '768px',    // md
    lg: '1024px',   // lg
    xl: '1280px',   // xl
    '2xl': '1536px', // 2xl
    // Tailwind: sm, md, lg, xl, 2xl
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Combined design system object for easy import
 */

export const designSystem = {
    colors,
    typography,
    spacing,
    ui,
    breakpoints,
} as const;

/**
 * Type exports for TypeScript support
 */

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type UI = typeof ui;
export type Breakpoints = typeof breakpoints;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate Tailwind classes for a button variant
 */
export function getButtonClasses(variant: 'primary' | 'secondary' | 'accent' | 'ghost' = 'primary'): string {
    const variants = {
        primary: 'bg-indigo-500 hover:bg-indigo-400 text-white',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
        accent: 'bg-amber-500 hover:bg-amber-400 text-slate-900',
        ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white',
    };
    return `${variants[variant]} px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105`;
}

/**
 * Generate Tailwind classes for a card
 */
export function getCardClasses(variant: 'default' | 'elevated' | 'interactive' = 'default'): string {
    const variants = {
        default: 'bg-slate-800 rounded-xl p-6 border border-slate-700',
        elevated: 'bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg',
        interactive: 'bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] cursor-pointer',
    };
    return variants[variant];
}

/**
 * Generate text color classes based on background
 */
export function getTextColorClasses(role: 'primary' | 'secondary' | 'muted' = 'primary'): string {
    const roles = {
        primary: 'text-slate-50',
        secondary: 'text-slate-300',
        muted: 'text-slate-400',
    };
    return roles[role];
}

export default designSystem;
