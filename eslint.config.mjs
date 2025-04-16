// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import imports from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier";
import { env } from "process";

export default [
    js.configs.recommended,
    {
        // Only check files inside src/
        files: ["src/**/*.ts", "src/**/*.tsx"],

        // Explicitly ignore everything outside src/
        ignores: [
            "**/*", // Ignore everything
            "!src/**", // But allow src/ folder
        ],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: ["./tsconfig.json"],
            },
            globals: {
                "window": true,
                "document": true,
                "localStorage": true,
                "fetch": true,
                "console": true,
                "process": true,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            import: imports,
            "unused-imports": unusedImports,
            prettier,
        },
        rules: {
            // TypeScript Rules            
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

            // React Rules
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Import Rules
            "import/order": ["warn", { alphabetize: { order: "asc" } }],
            // "import/no-unresolved": "error",
            "unused-imports/no-unused-imports": "warn",
            'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],

            // Accessibility (JSX A11y)
            "jsx-a11y/anchor-is-valid": "warn",
            "jsx-a11y/no-autofocus": "warn",
            "quotes": ["error", "single"],
            "semi": ["error", "never"]
        },
        
    },
];
