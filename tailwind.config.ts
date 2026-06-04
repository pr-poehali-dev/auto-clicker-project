import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./1780579666702359153.html"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				rajdhani: ['Rajdhani', 'sans-serif'],
				mono: ['IBM Plex Mono', 'monospace'],
				rubik: ['Rubik', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				neon: {
					green: '#00ff88',
					cyan: '#00e5ff',
					purple: '#bf00ff',
					orange: '#ff6600',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(30px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'border-pulse': {
					'0%, 100%': { boxShadow: '0 0 8px rgba(0,255,136,0.3)' },
					'50%': { boxShadow: '0 0 24px rgba(0,255,136,0.8), 0 0 48px rgba(0,255,136,0.3)' }
				},
				'scan': {
					'0%': { top: '-2px' },
					'100%': { top: '102%' }
				},
				'glitch': {
					'0%, 90%, 100%': { transform: 'translate(0)', opacity: '0' },
					'92%': { transform: 'translate(-2px, 1px)', opacity: '0.6' },
					'94%': { transform: 'translate(2px, -1px)', opacity: '0' },
					'96%': { transform: 'translate(-1px, 2px)', opacity: '0.6' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.6s ease-out forwards',
				'float': 'float 3s ease-in-out infinite',
				'border-pulse': 'border-pulse 2s ease-in-out infinite',
				'scan': 'scan 4s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
