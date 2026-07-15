/**
 * Kanz Bakery design tokens — synced from the sibling web artifact (index.css).
 * Amber/brown palette with cream backgrounds.
 */

const colors = {
  light: {
    // Legacy aliases
    text: '#2E2118',
    tint: '#B87208',

    // Surfaces
    background: '#FAF8F5',
    foreground: '#2E2118',

    // Cards
    card: '#FFFFFF',
    cardForeground: '#2E2118',

    // Primary — warm amber
    primary: '#B87208',
    primaryForeground: '#FFFFFF',

    // Secondary
    secondary: '#EDE9E2',
    secondaryForeground: '#2E2118',

    // Muted
    muted: '#F0ECE6',
    mutedForeground: '#6B5A49',

    // Accent
    accent: '#F0E8DA',
    accentForeground: '#7A4B06',

    // Destructive
    destructive: '#C42424',
    destructiveForeground: '#FFFFFF',

    // Borders / inputs
    border: '#DDD5C9',
    input: '#DDD5C9',

    // Overlay
    overlay: 'rgba(46, 33, 24, 0.5)',
  },

  dark: {
    text: '#F5F2ED',
    tint: '#E09A18',

    background: '#1A1410',
    foreground: '#F5F2ED',

    card: '#1F1813',
    cardForeground: '#F5F2ED',

    primary: '#E09A18',
    primaryForeground: '#1A1410',

    secondary: '#3D3428',
    secondaryForeground: '#F5F2ED',

    muted: '#362D23',
    mutedForeground: '#B5A490',

    accent: '#36230F',
    accentForeground: '#E0A840',

    destructive: '#CC3333',
    destructiveForeground: '#F5F2ED',

    border: '#3D3428',
    input: '#42372A',

    overlay: 'rgba(0, 0, 0, 0.6)',
  },

  // Border radius in px — matches --radius: 0.25rem (4px) from web
  radius: 4,
};

export default colors;
