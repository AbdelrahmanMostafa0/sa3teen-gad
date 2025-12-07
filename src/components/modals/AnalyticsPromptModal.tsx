"use client";

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, Clock, TrendingUp, Calendar, Sparkles, X } from "lucide-react";
import { dismissAnalyticsPrompt } from "@/utils/analytics-prompt";

interface AnalyticsPromptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AnalyticsPromptModal({
    open,
    onOpenChange,
}: AnalyticsPromptModalProps) {
    const router = useRouter();

    const handleLogin = () => {
        onOpenChange(false);
        router.push("/login");
    };

    const handleRegister = () => {
        onOpenChange(false);
        router.push("/register");
    };

    const handleRemindLater = () => {
        dismissAnalyticsPrompt();
        onOpenChange(false);
    };

    const benefits = [
        {
            icon: Clock,
            title: "تتبع الوقت",
            description: "احسب إجمالي ساعات العمل والجلسات",
        },
        {
            icon: Calendar,
            title: "تحليل يومي وأسبوعي",
            description: "شاهد تقدمك عبر الأيام والأسابيع",
        },
        {
            icon: BarChart3,
            title: "سجل الجلسات",
            description: "راجع جميع جلساتك",
        },
        {
            icon: TrendingUp,
            title: "إحصائيات الإنتاجية",
            description: "تحليلات متقدمة لتحسين أدائك",
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className=" border-0 p-0 gap-0 overflow-hidden">


                <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-6 pt-12 pb-8">
                    {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/10">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div> */}
                    <DialogTitle className="text-center text-2xl font-bold mb-2">
                        مرحباً بك في ساعتين جد! 🎯
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-muted-foreground max-w-[340px] mx-auto">
                        سجّل دخولك أو أنشئ حساباً مجانياً للاستفادة من ميزات التحليلات والإحصائيات المتقدمة
                    </DialogDescription>
                </div>

                <div className="px-6 py-6 space-y-2.5">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:border-primary border  border-transparent bg-white"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 space-y-0.5 pt-0.5">
                                    <h4 className="text-sm font-medium leading-none">
                                        {benefit.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="px-6 pb-6 space-y-2.5">
                    <Button
                        onClick={handleRegister}
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 shadow-sm"
                    >
                        إنشاء حساب مجاني
                    </Button>
                    <Button
                        onClick={handleLogin}
                        variant="outline"
                        size="lg"
                        className="w-full"
                    >
                        تسجيل الدخول
                    </Button>
                    <button
                        onClick={handleRemindLater}
                        className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                        ربما لاحقاً
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}