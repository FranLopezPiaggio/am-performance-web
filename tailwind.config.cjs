// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brutal-black': '#050505',
                'neon-green': '#00FF00',
                'neon-green-hover': '#00CC00',
                'yellow': '#F5DE11',
            },
            fontFamily: {
                sans: ['var(--font-sans)'],
                display: ['var(--font-display)'],
            },
        },
    },
    plugins: [],
    // ✅ Importante para evitar warnings en producción
    corePlugins: {
        preflight: true,
    },
}