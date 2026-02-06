import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-solid border-[#dbdbe6] dark:border-[#2d2d3b] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="layout-container flex justify-center w-full">
                    <div className="flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-10">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-[28px]">psychology_alt</span>
                            </div>
                            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] font-display">QuizAI</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Features</a>
                            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Pricing</a>
                            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
                        </nav>
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="hidden sm:flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/signup" className="flex h-10 items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white px-5 text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>


            <main className="flex flex-col items-center w-full">
                {/* Hero Section */}
                <section className="w-full px-4 py-12 md:px-10 lg:py-20 flex justify-center">
                    <div className="w-full max-w-[1280px] @container">
                        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
                            <div className="flex flex-1 flex-col gap-6 lg:max-w-[600px]">
                                <div className="flex flex-col gap-4">
                                    <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                        New AI Engine v2.0
                                    </span>
                                    <h1 className="text-4xl font-black leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl font-display text-[#111118] dark:text-white">
                                        Learn Smarter with <span className="text-primary">AI-Powered</span> Quizzes
                                    </h1>
                                    <p className="text-lg text-[#616189] dark:text-[#a0a0b0] md:text-xl font-body leading-relaxed">
                                        Instantly generate interactive quizzes from any text or URL. Perfect for teachers saving time and students mastering subjects.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <Link to="/signup" className="flex h-12 items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white px-8 text-base font-bold shadow-xl shadow-primary/25 transition-all hover:scale-105">
                                        Get Started for Free
                                    </Link>
                                    <button className="flex h-12 items-center gap-2 justify-center rounded-lg border border-[#dbdbe6] dark:border-[#333] bg-white dark:bg-white/5 px-6 text-base font-bold text-[#111118] dark:text-white hover:bg-[#f0f0f4] dark:hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">play_circle</span>
                                        Watch Demo
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#616189] dark:text-[#888]">
                                    <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                                    No credit card required
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                                    14-day free trial
                                </div>
                            </div>
                            <div className="flex-1 w-full lg:h-auto">
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#e0e0fc] to-[#f0f0f4] dark:from-[#1a1a2e] dark:to-[#111118] border border-[#dbdbe6] dark:border-[#2d2d3b]">
                                    <div className="absolute inset-0 flex items-center justify-center p-8">
                                        <div className="w-full h-full bg-center bg-cover rounded-xl shadow-inner" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBuSv3fly0_ZlnSYVvPDqyFz2824bBP0TDylcRQoEshnwdCbxrqWjNOHUnsEsVr4aH6AR61FNT4koKdqdboNqjF8YrHISnANHZJuoSa0nQR6pEfJEvbUkNVlM4oUY4yzX2tQyH5ItIu7SNhjOwtCu0-lhNbgXjKKG5bInCzDHFtjIKNpSO9MQx7a1-xbRU2ntj_a9MhEMwUktYuWN7x-fu5MiqryhFepvjvrCGYzUlEUX6QlDDAQtpvskp-BwKtR8PDgoiDPT71lCk')" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="w-full border-y border-[#f0f0f4] dark:border-[#2d2d3b] bg-white dark:bg-[#151525]">
                    <div className="layout-container flex justify-center py-10 px-4">
                        <div className="w-full max-w-[1280px] flex flex-col items-center gap-8">
                            <p className="text-sm font-medium text-[#616189] dark:text-[#888] text-center">TRUSTED BY EDUCATORS AT TOP INSTITUTIONS</p>
                            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="text-xl font-display font-bold text-[#111118] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined">school</span>Stanford
                                </div>
                                <div className="text-xl font-display font-bold text-[#111118] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined">history_edu</span>MIT
                                </div>
                                <div className="text-xl font-display font-bold text-[#111118] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined">menu_book</span>Oxford
                                </div>
                                <div className="text-xl font-display font-bold text-[#111118] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined">lightbulb</span>Harvard
                                </div>
                                <div className="text-xl font-display font-bold text-[#111118] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined">verified</span>Cambridge
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="w-full px-4 py-20 md:px-10 flex justify-center bg-background-light dark:bg-background-dark">
                    <div className="w-full max-w-[1280px] flex flex-col gap-12">
                        <div className="flex flex-col gap-4 text-center items-center max-w-[800px] mx-auto">
                            <h2 className="text-[#111118] dark:text-white text-3xl md:text-4xl font-bold leading-tight font-display">
                                Three Simple Steps
                            </h2>
                            <p className="text-[#616189] dark:text-[#a0a0b0] text-lg font-normal leading-normal">
                                Turn your study material into an interactive learning experience in seconds.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            <div className="flex flex-col gap-6 rounded-2xl border border-[#dbdbe6] dark:border-[#2d2d3b] bg-white dark:bg-[#1a1a2e] p-8 transition-transform hover:-translate-y-1 duration-300">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-[32px]">content_paste</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#111118] dark:text-white text-xl font-bold">1. Paste Content</h3>
                                    <p className="text-[#616189] dark:text-[#a0a0b0] leading-relaxed">
                                        Copy and paste text, upload a PDF, or provide a URL to any educational article or video.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 rounded-2xl border border-[#dbdbe6] dark:border-[#2d2d3b] bg-white dark:bg-[#1a1a2e] p-8 transition-transform hover:-translate-y-1 duration-300">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#111118] dark:text-white text-xl font-bold">2. AI Generates</h3>
                                    <p className="text-[#616189] dark:text-[#a0a0b0] leading-relaxed">
                                        Our advanced AI analyzes the content and instantly creates high-quality multiple choice questions.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 rounded-2xl border border-[#dbdbe6] dark:border-[#2d2d3b] bg-white dark:bg-[#1a1a2e] p-8 transition-transform hover:-translate-y-1 duration-300">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-[32px]">trending_up</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#111118] dark:text-white text-xl font-bold">3. Track Progress</h3>
                                    <p className="text-[#616189] dark:text-[#a0a0b0] leading-relaxed">
                                        Take the quiz, get instant feedback, and track your mastery of the subject over time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full px-4 py-20 flex justify-center bg-primary text-white">
                    <div className="w-full max-w-[960px] text-center flex flex-col items-center gap-8">
                        <h2 className="text-3xl md:text-5xl font-black font-display leading-tight">
                            Ready to Transform Your Learning?
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 max-w-[600px]">
                            Join thousands of educators and students using AI to learn faster and smarter today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Link to="/signup" className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg transition-colors text-lg">
                                Get Started for Free
                            </Link>
                            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg transition-colors text-lg">
                                View Pricing
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full border-t border-[#dbdbe6] dark:border-[#2d2d3b] bg-white dark:bg-[#101022] py-12 px-4 md:px-10">
                    <div className="layout-container flex justify-center">
                        <div className="w-full max-w-[1280px]">
                            <p className="text-sm text-[#616189] dark:text-[#a0a0b0] text-center">© 2024 QuizAI Platform. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
