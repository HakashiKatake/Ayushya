"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-primary">
                    <Activity className="w-6 h-6" />
                    <span className="text-xl font-bold">Ayushya</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Testimonials
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Log In
                    </Link>
                    <Link href="/sign-up">
                        <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
