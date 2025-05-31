import type { Config } from "tailwindcss";
import daisyTheme from "daisyui/src/theming/themes";
import daisy from "daisyui";
import typography from "@tailwindcss/typography";
import { type DefaultColors } from "tailwindcss/types/generated/colors";

export interface CustomColors extends DefaultColors {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    dark: string;
    warning: string;
}

const config: Config = {
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderColor: {
                DEFAULT: "var(--border-color)",
            },
            backgroundColor: {
                navbar: "var(--custom-bg-navbar)",
            },
            screens: {
                print: { raw: "print" },
                screen: { raw: "screen" },
            },
            animation: {
                border: "border 4s linear infinite",
            },
            keyframes: {
                border: {
                    to: { "--border-angle": "360deg" },
                },
            },
        },
    },
    plugins: [typography, daisy],
    daisyui: {
        themes: [
            {
                // Special theme for printing
                print: {
                    ...daisyTheme.light,
                },
            },
            {
                SVELight: {
                    ...daisyTheme.light,
                    primary: "#037776",
                    secondary: "#037776",
                    accent: "#2FB8AC",
                    tertiary: "#93A42A",
                    dark: "#2E2E2E",
                    warning: "#ECDE13",
                    "--custom-bg-navbar": "#ffffff",
                    body: {
                        background:
                            "linear-gradient(to top, rgb(250, 250, 250), rgb(245, 245, 245))",
                    },
                    "--border-color": "rgb(220, 220, 220)",
                },
            },
            {
                SVEDark: {
                    ...daisyTheme.dark,
                    primary: "#37C48E",
                    secondary: "#2B91A5",
                    neutral: "#1E1E2F",
                    accent: "#2DD4BF",
                    tertiary: "#A3E635",
                    dark: "#1A1A27",
                    warning: "#F97316",
                    "--custom-bg-navbar": "#0C0F13",
                    body: {
                        background: "#15191F",
                    },
                    "--border-color": "#2A2D37",
                    "base-300": "#121217",
                    "error-content": "#FFFFFF",
                    "warning-content": "#FFFFFF",
                },
            },
        ],
    },
    darkMode: ["class"],
};
export default config;
