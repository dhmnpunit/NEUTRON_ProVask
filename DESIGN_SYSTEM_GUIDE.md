# Design System Guide for ProVask

This guide provides standards for maintaining design consistency throughout the ProVask application. Following these guidelines will ensure a cohesive user experience and make development more efficient.

## Table of Contents

1. [Typography](#typography)
2. [Colors](#colors)
3. [Spacing](#spacing)
4. [Borders & Radius](#borders--radius)
5. [Shadows](#shadows)
6. [Components](#components)
7. [Icons](#icons)
8. [Implementation Guide](#implementation-guide)

## Typography

Use our typography system to maintain consistent text styles:

```typescript
import { typography } from '@/constants/design';

// Typography Usage
<Text style={styles.title}>Title Text</Text>

// In StyleSheet
const styles = StyleSheet.create({
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: typography.h3.color,
  },
});
```

Typography scale:
- `h1`: 24px, 700 - Main screen titles
- `h2`: 20px, 700 - Section headers
- `h3`: 18px, 600 - Card titles, important content
- `body`: 16px, 400 - Primary content text
- `bodySmall`: 14px, 400 - Secondary content
- `caption`: 12px, 400 - Supporting text, labels
- `label`: 14px, 500 - Input labels, section labels

## Colors

All colors are defined in `colors.ts`. Never use hardcoded color values:

```typescript
import { colors } from '@/constants/colors';

// Color Usage
<View style={{ backgroundColor: colors.primary }} />
```

Key color usage:
- `primary`: Main brand color for buttons, active states
- `primaryLight`: Light variant for backgrounds, inactive states
- `text`: Primary text color
- `textSecondary`: Secondary text, labels
- `textTertiary`: Placeholders, disabled text
- `card`: Card backgrounds
- `background`: Main app background
- `border`: Border colors, dividers
- `success`/`warning`/`danger`/`info`: Status indicators

## Spacing

Use our spacing scale for consistent margins, padding, and layout:

```typescript
import { spacing } from '@/constants/design';

// Spacing Usage
<View style={{ margin: spacing.md, padding: spacing.sm }} />
```

Spacing scale:
- `xs`: 4px - Minimal spacing
- `sm`: 8px - Tight spacing
- `md`: 16px - Standard spacing
- `lg`: 24px - Loose spacing
- `xl`: 32px - Section spacing
- `xxl`: 48px - Screen spacing

## Borders & Radius

Use consistent border radius values:

```typescript
import { radius } from '@/constants/design';

// Radius Usage
<View style={{ borderRadius: radius.medium }} />
```

Radius scale:
- `small`: 8px - Tags, small elements
- `medium`: 12px - Cards, buttons 
- `large`: 16px - Modal windows
- `circle`: 999 - Circular elements

## Shadows

Apply consistent shadows for elevation:

```typescript
import { shadows } from '@/constants/design';

// Shadow Usage
<View style={{ ...shadows.small }} />
```

Shadow levels:
- `small`: Subtle elevation (cards, buttons)
- `medium`: Medium elevation (modals, floating elements)

## Components

Common component styles are available in `componentStyles`:

```typescript
import { componentStyles } from '@/constants/design';

// Component Style Usage
<View style={componentStyles.card} />
```

Available component styles:
- `card`: Standard card container
- `header`: Screen headers
- `primaryButton`: Main action buttons
- `secondaryButton`: Alternative action buttons
- `tag`: Tag styling
- `input`: Input field styling
- `container`: Full-screen container

## Icons

Use consistent icon sizes and prefer the Lucide icon library:

```typescript
import { iconSizes } from '@/constants/design';
import { Heart } from 'lucide-react-native';

// Icon Usage
<Heart size={iconSizes.medium} color={colors.primary} />
```

Icon sizes:
- `small`: 16px - In-line with text, minor UI elements
- `medium`: 20px - Standard UI icons
- `large`: 24px - Header icons, primary actions
- `xlarge`: 32px - Feature highlights

## Implementation Guide

### Refactoring Existing Components

1. Import the design system:
```typescript
import { 
  typography, 
  spacing, 
  radius, 
  shadows, 
  iconSizes, 
  componentStyles 
} from '@/constants/design';
```

2. Replace hardcoded values:
   - Replace pixel values with spacing constants
   - Replace font sizes, weights with typography values
   - Replace border radius with radius constants
   - Replace shadows with shadow objects
   - Replace icon sizes with iconSize constants

3. For visual consistency:
   - Cards should use `radius.medium` (12px)
   - Ensure consistent padding (use `spacing.md` for standard padding)
   - Apply shadows consistently

### New Component Development

When creating new components:
1. Use the design system constants for all values
2. Leverage existing componentStyles when applicable
3. Follow the design patterns established in existing components

### Common Issues to Avoid

1. **Inconsistent card styles:** All cards should have the same border radius, padding, and shadow
2. **Mixed typography:** Avoid mixing different font sizes and weights for similar elements
3. **Variable spacing:** Use the spacing scale consistently for margins and padding
4. **Inconsistent icons:** Use the recommended icon library and size constants
5. **Color inconsistencies:** Only use colors from the color palette

By following this guide, we'll maintain design consistency throughout the app and improve the user experience. 