"use client";

import { motion } from "framer-motion";
import {
    Brain,
    ShieldCheck,
    Share2,
    Clock,
    LineChart,
    Users
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI Analysis",
        description: "Advanced algorithms analyze your health data to provide actionable insights and early warning signs."
    },
    {
        icon: ShieldCheck,
        title: "Secure Storage",
        description: "Bank-grade encryption ensures your sensitive medical records are safe and accessible only to you."
    },
    {
        icon: Share2,
        title: "Easy Sharing",
        description: "Seamlessly share your health reports with doctors and family members with just a few clicks."
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description: "Access your health information anytime, anywhere. Your data is always at your fingertips."
    },
    {
        icon: LineChart,
        title: "Smart Insights",
        description: "Visualize trends in your health metrics over time to make informed lifestyle decisions."
    },
    {
        icon: Users,
        title: "Family Health",
        description: "Manage health profiles for your entire family in one unified, easy-to-use dashboard."
    }
];

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group"
        >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
        </motion.div>
    );
};

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-foreground mb-4"
                    >
                        Powerful Features for Your Health
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        Everything you need to take control of your well-being, powered by cutting-edge technology.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
