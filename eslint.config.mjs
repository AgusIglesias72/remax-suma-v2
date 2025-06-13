import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Permitir 'any' como warning en lugar de error
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Permitir variables no usadas (útil durante desarrollo)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      
      // Permitir imports no usados
      "no-unused-vars": "off",
      
      // Reglas de React más permisivas
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      
      // Permitir console.log en desarrollo
      "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
      
      // Otras reglas útiles pero no estrictas
      "prefer-const": "warn",
      "no-var": "warn",
      
      // Reglas de Next.js más permisivas
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      
      // Reglas adicionales para desarrollo
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "react-hooks/exhaustive-deps": "warn"
    }
  },
  {
    // Configuración específica para archivos de configuración
    files: ["*.config.js", "*.config.ts", "tailwind.config.js", "next.config.js"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  {
    // Configuración específica para scripts
    files: ["scripts/**/*"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];

export default eslintConfig;