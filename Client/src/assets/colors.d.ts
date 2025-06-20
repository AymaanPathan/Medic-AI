declare module "../assets/colors" {
  const colors: {
    colorUtils: Record<string, (color: string, opacity: number) => string>;
    primary: Record<number, string>;
    secondary: Record<number, string>;
    success: Record<number, string>;
    danger: Record<number, string>;
    info: Record<number, string>;
    neutral: Record<number, string>;
    text: {
      heading: string;
      body: string;
      muted: string;
      onPrimary: string;
      onDark: string;
      primary: string;
    };
    background: {
      primary: string;
      muted: string;
    };
    border: {
      light: string;
      dark: string;
    };
    shadow: {
      sm: string;
      lg: string;
      "2xl": string;
      primaryShadow: string;
    };
    brand: {
      gradient: {
        primary: string;
      };
    };
  };

  export const colorUtils: {
    withOpacity: (color: string, opacity: number) => string;
  };

  export default colors;
}

export declare const colors: unknown; // You can replace 'any' with a more specific type if desired
export declare const colorUtils: unknown;
export declare const themes: unknown;
