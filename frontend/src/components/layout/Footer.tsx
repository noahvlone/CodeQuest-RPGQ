import { Terminal } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 container mx-auto px-6 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 opacity-50">
                    <Terminal className="w-5 h-5 text-primary" />
                    <span className="text-sm font-black italic uppercase tracking-widest">
                        CodeQuest RPG System
                    </span>
                </div>
                <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <a href="#" className="hover:text-white transition-colors">Status</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">API Docs</a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        GitHub
                    </a>
                </div>
                <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">
                    © 2077 Neotech Industries
                </p>
            </div>
        </footer>
    );
}
