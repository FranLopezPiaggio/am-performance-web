// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        '/app/src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Migrado desde @theme
            colors: {
                'brutal-black': '#050505',
                'neon-green': '#00FF00',
                'neon-green-hover': '#00CC00',
                'yellow': '#F5DE11',
            },
            fontFamily: {
                // Asumimos que usas las variables de fuente de Next.js
                // definidas en layout.tsx (ej: <body className={`${font.variable} ...} />)
                sans: ['var(--font-sans)'],
                display: ['var(--font-display)'],
            },
        },
    },
    plugins: [],
}