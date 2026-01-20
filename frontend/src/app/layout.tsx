import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'CodeQuest RPG | Learn Coding Through Adventure',
    description: 'The only RPG where your code is your sword. Conquer bugs, build systems, and become a legend in Neo-Jakarta 2077.',
    keywords: ['coding', 'rpg', 'game', 'programming', 'learn to code', 'javascript', 'python'],
    authors: [{ name: 'CodeQuest Team' }],
    openGraph: {
        title: 'CodeQuest RPG',
        description: 'Learn coding through an immersive cyberpunk RPG experience',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-primary selection:text-black overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}
