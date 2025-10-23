# StayEasy Theme System

A comprehensive blue-first theme system with full dark mode support, designed for React Native with Expo and React Navigation.

## 🎨 Features

- **Blue-first design** with carefully chosen color palettes
- **Full dark mode support** with automatic system detection
- **React Navigation integration** with automatic theme sync
- **TypeScript support** with full type safety
- **Consistent spacing and typography** tokens
- **Easy-to-use components** that automatically adapt to theme

## 🚀 Quick Start

### 1. Using the Theme Provider

```tsx
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Using Theme in Components

```tsx
import { useTheme } from '../components/ThemeProvider';

function MyComponent() {
  const { theme, setMode, mode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.textPrimary }}>
        Current theme: {theme.mode}
      </Text>
    </View>
  );
}
```

### 3. Using UI Components

```tsx
import { Button, Card, Text } from '../components/ui';

function Example() {
  return (
    <Card>
      <Text variant="h2">Welcome</Text>
      <Text variant="body" color="secondary">
        This is a themed card
      </Text>
      <Button 
        title="Click me" 
        onPress={() => {}} 
        variant="primary"
      />
    </Card>
  );
}
```

## 🎨 Theme Tokens

### Colors

#### Light Theme
- **Primary**: `#1E90FF` - Main brand color
- **Primary Dark**: `#1565C0` - Pressed states, headers
- **Primary Light**: `#E3F2FD` - Subtle fills, chips
- **Background**: `#F9FAFB` - Main background
- **Surface**: `#FFFFFF` - Cards, modals
- **Text Primary**: `#0D1B2A` - Main text
- **Text Secondary**: `#6B7280` - Secondary text

#### Dark Theme
- **Primary**: `#4EA8FF` - Brighter for contrast
- **Primary Dark**: `#1D4ED8` - Pressed states
- **Background**: `#0B1220` - Main background
- **Surface**: `#111827` - Cards, modals
- **Text Primary**: `#E5E7EB` - Main text
- **Text Secondary**: `#9CA3AF` - Secondary text

### Spacing
```tsx
theme.spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 12,   // 12px
  lg: 16,   // 16px
  xl: 24,   // 24px
  '2xl': 32 // 32px
}
```

### Border Radius
```tsx
theme.radius = {
  sm: 6,    // Small radius
  md: 12,   // Medium radius
  lg: 20,   // Large radius
  pill: 999 // Pill shape
}
```

## 🧩 Components

### Button
```tsx
<Button 
  title="Primary Button"
  onPress={() => {}}
  variant="primary" // primary | secondary | outline
  size="md"        // sm | md | lg
  disabled={false}
/>
```

### Card
```tsx
<Card 
  variant="elevated" // default | elevated | outlined
>
  <Text>Card content</Text>
</Card>
```

### Text
```tsx
<Text 
  variant="h1"     // h1 | h2 | h3 | body | caption | label
  color="primary"  // primary | secondary | inverse | success | warning | error
>
  Text content
</Text>
```

## 🧭 React Navigation Integration

The theme automatically syncs with React Navigation:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from './components/ThemeProvider';

function AppNavigator() {
  const { theme } = useTheme();
  
  // Navigation theme is automatically applied
  return (
    <NavigationContainer>
      {/* Your navigation structure */}
    </NavigationContainer>
  );
}
```

### Tab Navigator Styling
```tsx
<Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    },
  }}
>
  {/* Your tabs */}
</Tab.Navigator>
```

## 🌙 Dark Mode

### Automatic System Detection
The theme automatically detects system dark mode preference and switches accordingly.

### Manual Theme Control
```tsx
const { setMode, mode } = useTheme();

// Set specific theme
setMode('light');   // Force light mode
setMode('dark');    // Force dark mode
setMode('system');  // Follow system preference
```

### Theme Toggle Component
```tsx
import { ThemeToggle } from '../components/ThemeToggle';

<ThemeToggle />
```

## 📱 Status Bar

The status bar automatically adapts to the current theme:

```tsx
import { StatusBar } from 'expo-status-bar';

<StatusBar style="auto" />
```

## 🎯 Best Practices

### 1. Use Theme Tokens
Always use theme tokens instead of hardcoded values:

```tsx
// ✅ Good
<View style={{ padding: theme.spacing.lg }}>

// ❌ Bad
<View style={{ padding: 16 }}>
```

### 2. Semantic Color Usage
Use semantic color names for better maintainability:

```tsx
// ✅ Good
<Text color="primary">Main text</Text>
<Text color="secondary">Secondary text</Text>

// ❌ Bad
<Text style={{ color: '#1E90FF' }}>Main text</Text>
```

### 3. Component Variants
Use component variants for different states:

```tsx
// ✅ Good
<Button variant="primary" />
<Button variant="secondary" />
<Card variant="elevated" />
```

### 4. Consistent Spacing
Use the spacing scale for consistent layouts:

```tsx
// ✅ Good
<View style={{ 
  padding: theme.spacing.lg,
  marginBottom: theme.spacing.md 
}}>
```

## 🔧 Customization

### Adding New Colors
1. Update the theme files in `utils/theme.ts`
2. Add the new colors to both light and dark themes
3. Update the Text component if needed

### Adding New Components
1. Create the component in `components/ui/`
2. Use the `useTheme` hook for styling
3. Export from `components/ui/index.ts`

### Custom Theme
```tsx
// Create a custom theme
const CustomTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: '#FF6B6B', // Custom primary color
  },
};
```

## 🚀 Next Steps

- Add more UI components (Input, Modal, etc.)
- Implement theme persistence with AsyncStorage
- Add animation support for theme transitions
- Create theme-aware image placeholders
- Add dark mode map styles

## 📁 File Structure

```
components/
├── ThemeProvider.tsx     # Theme context and provider
├── ThemeToggle.tsx       # Theme toggle component
└── ui/
    ├── Button.tsx        # Themed button component
    ├── Card.tsx          # Themed card component
    ├── Text.tsx          # Themed text component
    └── index.ts          # Component exports

utils/
└── theme.ts              # Theme tokens and definitions

navigation/
└── AppNavigator.tsx      # Navigation with theme integration
```

This theme system provides a solid foundation for building a consistent, accessible, and beautiful StayEasy app! 🎨
