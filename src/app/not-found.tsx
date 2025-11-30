"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-secondary/30 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl rotate-clockwise" />
            </div>

            {/* Main Content */}
            <div
                className={`relative z-10 max-w-2xl w-full text-center space-y-8 transform transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
            >
                {/* 404 Number */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 text-[150px] md:text-[200px] font-bold leading-none text-primary/5 blur-2xl select-none">
                        404
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        الصفحة غير موجودة
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <Link
                        href="/"
                        className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 active:scale-95 flex items-center gap-3"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Home className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-12" />
                        <span className="relative z-10">العودة للرئيسية</span>
                        <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1" />
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group px-8 py-4 bg-card border-2 border-border text-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg active:scale-95 flex items-center gap-3"
                    >
                        <span>الرجوع للخلف</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    </button>
                </div>


            </div>
        </div>
    );
}
