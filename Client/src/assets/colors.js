// theme/colors.js - Complete AI Medical Website Color System
export const colors = {
  // === PRIMARY BRAND IDENTITY ===
  primary: {
    50: "#F0F9F3", // Lightest mint - hero backgrounds, subtle highlights
    100: "#DCEFDF", // Very light green - card hover states
    200: "#BBE1C0", // Light green - secondary buttons, badges
    300: "#8BD096", // Medium light - active states, progress bars
    400: "#5ABF6C", // Standard green - primary buttons, links
    500: "#3BA55D", // Main brand color - CTAs, navigation
    600: "#2D8549", // Darker green - button hover, active nav
    700: "#236B3A", // Deep green - text on light backgrounds
    800: "#1A5129", // Very dark - headings, emphasis
    900: "#0F3B1B", // Darkest - high contrast text
  },

  // === MEDICAL TRUST BLUE (Secondary Brand) ===
  medical: {
    50: "#EFF6FF", // Light blue backgrounds - medical sections
    100: "#DBEAFE", // Info panels, medical cards
    200: "#BFDBFE", // Lighter accents
    300: "#93C5FD", // Medium blue - info badges
    400: "#60A5FA", // Standard blue - info buttons
    500: "#3B82F6", // Main medical blue - trust elements
    600: "#2563EB", // Darker blue - medical CTAs
    700: "#1D4ED8", // Deep blue - medical headers
    800: "#1E40AF", // Very dark blue
    900: "#1E3A8A", // Darkest medical blue
  },

  // === NEUTRAL GRAYS (UI Foundation) ===
  neutral: {
    0: "#FFFFFF", // Pure white - main backgrounds
    50: "#FAFAFA", // Off-white - alternate backgrounds
    100: "#F5F5F5", // Very light gray - input backgrounds
    200: "#E5E5E5", // Light gray - borders, dividers
    300: "#D4D4D4", // Medium light - inactive elements
    400: "#A3A3A3", // Medium gray - placeholders
    500: "#737373", // Standard gray - secondary text
    600: "#525252", // Dark gray - body text
    700: "#404040", // Darker gray - headings
    800: "#262626", // Very dark - primary headings
    900: "#171717", // Near black - high contrast text
    950: "#0A0A0A", // Pure black - maximum contrast
  },

  // === SEMANTIC COLORS (Alerts & Status) ===
  success: {
    50: "#F0FDF4", // Success background - appointment confirmations
    100: "#DCFCE7", // Light success - positive feedback
    200: "#BBF7D0", // Success borders
    300: "#86EFAC", // Success icons
    400: "#4ADE80", // Success buttons
    500: "#22C55E", // Main success color
    600: "#16A34A", // Success hover states
    700: "#15803D", // Dark success
    800: "#166534", // Very dark success
    900: "#14532D", // Darkest success
  },

  warning: {
    50: "#FFFBEB", // Warning backgrounds - caution messages
    100: "#FEF3C7", // Light warning panels
    200: "#FDE68A", // Warning borders
    300: "#FCD34D", // Warning icons
    400: "#FBBF24", // Warning buttons
    500: "#F59E0B", // Main warning color
    600: "#D97706", // Warning hover states
    700: "#B45309", // Dark warning
    800: "#92400E", // Very dark warning
    900: "#78350F", // Darkest warning
  },

  danger: {
    50: "#FEF2F2", // Error backgrounds - critical alerts
    100: "#FEE2E2", // Light error panels
    200: "#FECACA", // Error borders
    300: "#FCA5A5", // Error icons
    400: "#F87171", // Error buttons
    500: "#EF4444", // Main error color
    600: "#DC2626", // Error hover states
    700: "#B91C1C", // Dark error
    800: "#991B1B", // Very dark error
    900: "#7F1D1D", // Darkest error
  },

  info: {
    50: "#F0F9FF", // Info backgrounds - helpful tips
    100: "#E0F2FE", // Light info panels
    200: "#BAE6FD", // Info borders
    300: "#7DD3FC", // Info icons
    400: "#38BDF8", // Info buttons
    500: "#0EA5E9", // Main info color
    600: "#0284C7", // Info hover states
    700: "#0369A1", // Dark info
    800: "#075985", // Very dark info
    900: "#0C4A6E", // Darkest info
  },

  // === SPECIALIZED MEDICAL COLORS ===
  health: {
    // Vital signs and health metrics
    heart: "#E91E63", // Heart rate, cardiology
    pulse: "#FF5722", // Pulse indicators
    blood: "#C62828", // Blood pressure, hematology
    oxygen: "#2196F3", // Oxygen levels, respiratory
    temperature: "#FF9800", // Body temperature
    glucose: "#9C27B0", // Blood sugar, endocrinology
    weight: "#795548", // Weight, BMI indicators
    mental: "#673AB7", // Mental health, neurology
  },

  specialty: {
    // Medical specialty color coding
    cardiology: "#E91E63", // Heart-related
    neurology: "#673AB7", // Brain/nervous system
    oncology: "#9C27B0", // Cancer treatment
    pediatrics: "#FF9800", // Children's medicine
    geriatrics: "#795548", // Elderly care
    emergency: "#F44336", // Emergency medicine
    radiology: "#607D8B", // Imaging/scans
    pharmacy: "#4CAF50", // Medications
  },

  // === UI COMPONENT COLORS ===
  background: {
    primary: "#FFFFFF", // Main page background
    secondary: "#FAFAFA", // Alternate sections
    tertiary: "#F5F5F5", // Cards, panels
    overlay: "#F9FAFB", // Modal overlays
    gradient: "linear-gradient(135deg, #3BA55D 0%, #2D8549 100%)",
    medicalGradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    heroGradient: "linear-gradient(135deg, #F0F9F3 0%, #EFF6FF 100%)",
  },

  surface: {
    default: "#FFFFFF", // Default card background
    elevated: "#FFFFFF", // Elevated cards (with shadow)
    pressed: "#F5F5F5", // Pressed/active state
    disabled: "#FAFAFA", // Disabled elements
    hover: "#F9FAFB", // Hover states
    selected: "#F0F9F3", // Selected items
    focus: "#EFF6FF", // Focus states
  },

  border: {
    default: "#E5E5E5", // Standard borders
    light: "#F0F0F0", // Subtle borders
    medium: "#D4D4D4", // Medium borders
    dark: "#A3A3A3", // Strong borders
    focus: "#3BA55D", // Focus ring
    error: "#EF4444", // Error borders
    success: "#22C55E", // Success borders
  },

  text: {
    // Primary text colors
    primary: "#171717", // Main headings
    secondary: "#404040", // Subheadings
    body: "#525252", // Body text
    muted: "#737373", // Secondary text
    disabled: "#A3A3A3", // Disabled text
    placeholder: "#A3A3A3", // Input placeholders

    // Text on colored backgrounds
    onPrimary: "#FFFFFF", // Text on primary green
    onSecondary: "#171717", // Text on light backgrounds
    onDark: "#FFFFFF", // Text on dark backgrounds
    onSuccess: "#FFFFFF", // Text on success background
    onWarning: "#92400E", // Text on warning background
    onError: "#FFFFFF", // Text on error background
    onInfo: "#FFFFFF", // Text on info background
  },

  // === INTERACTIVE ELEMENTS ===
  interactive: {
    primary: "#3BA55D", // Primary buttons, links
    primaryHover: "#2D8549", // Primary hover state
    primaryActive: "#236B3A", // Primary active state
    primaryDisabled: "#BBE1C0", // Primary disabled state

    secondary: "#FFFFFF", // Secondary buttons
    secondaryHover: "#F5F5F5", // Secondary hover
    secondaryActive: "#E5E5E5", // Secondary active

    tertiary: "transparent", // Tertiary/ghost buttons
    tertiaryHover: "#F5F5F5", // Tertiary hover

    link: "#3BA55D", // Links
    linkHover: "#2D8549", // Link hover
    linkVisited: "#236B3A", // Visited links
  },

  // === FORM ELEMENTS ===
  form: {
    background: "#FFFFFF", // Input backgrounds
    border: "#D4D4D4", // Input borders
    borderFocus: "#3BA55D", // Focused input borders
    borderError: "#EF4444", // Error input borders
    borderSuccess: "#22C55E", // Success input borders
    placeholder: "#A3A3A3", // Placeholder text
    label: "#404040", // Form labels
    help: "#737373", // Help text
    required: "#EF4444", // Required field indicators
  },

  // === NAVIGATION ===
  navigation: {
    background: "#FFFFFF", // Nav background
    border: "#E5E5E5", // Nav borders
    link: "#525252", // Nav links
    linkHover: "#3BA55D", // Nav link hover
    linkActive: "#3BA55D", // Active nav link
    badge: "#EF4444", // Notification badges
    dropdown: "#FFFFFF", // Dropdown backgrounds
  },

  // === CHAT/MESSAGING INTERFACE ===
  chat: {
    userBubble: "#3BA55D", // User message background
    userText: "#FFFFFF", // User message text
    aiBubble: "#F5F5F5", // AI message background
    aiText: "#525252", // AI message text
    systemBubble: "#EFF6FF", // System message background
    systemText: "#1D4ED8", // System message text
    timestamp: "#737373", // Message timestamps
    typing: "#A3A3A3", // Typing indicators
    inputBackground: "#FFFFFF", // Chat input background
    inputBorder: "#D4D4D4", // Chat input border
  },

  // === DATA VISUALIZATION ===
  chart: {
    primary: "#3BA55D", // Primary data series
    secondary: "#3B82F6", // Secondary data series
    tertiary: "#F59E0B", // Tertiary data series
    quaternary: "#EF4444", // Fourth data series
    grid: "#E5E5E5", // Chart grid lines
    axis: "#737373", // Chart axis labels
    tooltip: "#262626", // Chart tooltips
    highlight: "#FFE4B5", // Data point highlights
  },

  // === SHADOWS & EFFECTS ===
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

    // Colored shadows for emphasis
    primaryShadow: "0 4px 14px rgba(59, 165, 93, 0.25)",
    successShadow: "0 4px 14px rgba(34, 197, 94, 0.25)",
    errorShadow: "0 4px 14px rgba(239, 68, 68, 0.25)",
    warningShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
  },

  // === OPACITY VALUES ===
  opacity: {
    disabled: 0.4, // Disabled elements
    muted: 0.6, // Muted content
    overlay: 0.8, // Modal overlays
    loading: 0.7, // Loading states
    hover: 0.9, // Hover effects
    pressed: 0.95, // Pressed states
  },

  // === MEDICAL APPOINTMENT SYSTEM ===
  appointment: {
    available: "#22C55E", // Available time slots
    booked: "#EF4444", // Booked time slots
    pending: "#F59E0B", // Pending appointments
    confirmed: "#3BA55D", // Confirmed appointments
    cancelled: "#737373", // Cancelled appointments
    completed: "#3B82F6", // Completed appointments
    noShow: "#DC2626", // No-show appointments
    rescheduled: "#7C3AED", // Rescheduled appointments
  },

  // === MEDICAL PRIORITY LEVELS ===
  priority: {
    critical: "#DC2626", // Critical/emergency
    high: "#EA580C", // High priority
    medium: "#D97706", // Medium priority
    low: "#65A30D", // Low priority
    routine: "#6B7280", // Routine/normal
  },

  // === ACCESSIBILITY FOCUS COLORS ===
  accessibility: {
    focusRing: "#3BA55D", // Focus ring color
    focusRingOffset: "#FFFFFF", // Focus ring offset
    skipLink: "#1F2937", // Skip link background
    highContrast: "#000000", // High contrast mode
    screenReaderOnly: "transparent", // Screen reader only elements
  },

  // === BRAND VARIATIONS ===
  brand: {
    gradient: {
      primary: "linear-gradient(135deg, #3BA55D 0%, #22C55E 100%)",
      medical: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
      success: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
      hero: "linear-gradient(135deg, #F0F9F3 0%, #EFF6FF 50%, #FAFAFA 100%)",
    },

    // Logo and branding colors
    logo: {
      primary: "#3BA55D", // Main logo color
      secondary: "#3B82F6", // Secondary logo element
      text: "#171717", // Logo text
      background: "#FFFFFF", // Logo background
    },
  },

  // === UTILITY CLASSES ===
  utility: {
    transparent: "transparent",
    current: "currentColor",
    black: "#000000",
    white: "#FFFFFF",

    // Common overlay colors
    overlay: {
      light: "rgba(255, 255, 255, 0.9)",
      medium: "rgba(255, 255, 255, 0.95)",
      dark: "rgba(0, 0, 0, 0.5)",
      darkMedium: "rgba(0, 0, 0, 0.7)",
      darkStrong: "rgba(0, 0, 0, 0.8)",
    },
  },
};

// === COLOR UTILITY FUNCTIONS ===
export const colorUtils = {
  // Function to get color with opacity
  withOpacity: (color, opacity) => {
    // Convert hex to rgba
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // Function to determine text color based on background
  getTextColor: (backgroundColor) => {
    // Simple light/dark detection
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? colors.text.primary : colors.text.onPrimary;
  },

  // Get semantic color based on status
  getStatusColor: (status) => {
    const statusMap = {
      success: colors.success[500],
      error: colors.danger[500],
      warning: colors.warning[500],
      info: colors.info[500],
      pending: colors.warning[400],
      completed: colors.success[500],
      cancelled: colors.neutral[400],
    };
    return statusMap[status] || colors.neutral[400];
  },

  // Get priority color
  getPriorityColor: (priority) => {
    const priorityMap = {
      critical: colors.priority.critical,
      high: colors.priority.high,
      medium: colors.priority.medium,
      low: colors.priority.low,
      routine: colors.priority.routine,
    };
    return priorityMap[priority] || colors.priority.routine;
  },
};

// === THEME CONFIGURATIONS ===
export const themes = {
  light: {
    ...colors,
    mode: "light",
  },

  // High contrast theme for accessibility
  highContrast: {
    ...colors,
    mode: "highContrast",
    background: {
      ...colors.background,
      primary: "#FFFFFF",
      secondary: "#F5F5F5",
    },
    text: {
      ...colors.text,
      primary: "#000000",
      secondary: "#000000",
      body: "#000000",
    },
    border: {
      ...colors.border,
      default: "#000000",
      focus: "#0000FF",
    },
  },
};

export default colors;
