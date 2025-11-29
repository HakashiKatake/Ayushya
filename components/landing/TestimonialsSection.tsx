"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Fitness Enthusiast",
        content: "Ayushya has completely transformed how I track my health. The AI insights are incredibly accurate and helpful.",
        avatar: "/avatars/sarah.jpg",
        initials: "SJ"
    },
    {
        name: "Michael Chen",
        role: "Diabetic Patient",
        content: "Being able to share my glucose trends with my doctor instantly has been a game changer. Highly recommended!",
        avatar: "/avatars/michael.jpg",
        initials: "MC"
    },
    {
        name: "Dr. Emily Davis",
        role: "Cardiologist",
        content: "I recommend Ayushya to all my patients. The data presentation makes it easy to spot long-term trends.",
        avatar: "/avatars/emily.jpg",
        initials: "ED"
    }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: any, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-card border border-border relative"
        >
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-serif">"</span>
            </div>

            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
            </div>

            <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
            </p>

            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-background/50 relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-foreground mb-4"
                    >
                        Trusted by Thousands
                    </motion.h2>
                    <p className="text-lg text-muted-foreground">
                        See what our users and healthcare professionals are saying about Ayushya.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
