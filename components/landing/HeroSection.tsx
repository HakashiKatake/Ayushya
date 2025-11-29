"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

const DNAHelix = () => {
    return (
        <div className="relative w-full h-[400px] flex items-center justify-center opacity-80">
            <svg viewBox="0 0 200 400" className="w-full h-full text-primary">
                <defs>
                    <linearGradient id="dna-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                {[...Array(20)].map((_, i) => (
                    <motion.g
                        key={i}
                        initial={{ x: 0 }}
                        animate={{
                            x: [0, 20, 0, -20, 0],
                            scale: [1, 1.1, 1, 0.9, 1],
                            opacity: [0.5, 1, 0.5, 0.3, 0.5],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.2,
                        }}
                    >
                        <circle cx="60" cy={30 + i * 18} r="4" fill="url(#dna-gradient)" />
                        <circle cx="140" cy={30 + i * 18} r="4" fill="url(#dna-gradient)" />
                        <line
                            x1="60"
                            y1={30 + i * 18}
                            x2="140"
                            y2={30 + i * 18}
                            stroke="url(#dna-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                    </motion.g>
                ))}
            </svg>
        </div>
    );
};

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                        <Activity className="w-4 h-4" />
                        <span>Next Gen Health Monitoring</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                        Your Health, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient">
                            Decoded.
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-lg">
                        Advanced AI-powered health analytics that helps you understand your body better. Secure, intelligent, and personalized for you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/sign-up">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <Link href="#features">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full bg-card text-foreground font-semibold border border-border hover:border-primary/50 transition-all"
                            >
                                Learn More
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl" />
                    <DNAHelix />
                </motion.div>
            </div>
        </section>
    );
}
