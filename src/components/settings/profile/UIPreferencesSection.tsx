"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Layout } from 'lucide-react';
import { SettingsType } from '@/types/user';

interface UIPreferencesSectionProps {
    ui: SettingsType['ui'];
    onUpdate: (data: { ui: Partial<SettingsType['ui']> }) => Promise<void>;
    loading?: boolean;
}

export default function UIPreferencesSection({ ui, onUpdate, loading }: UIPreferencesSectionProps) {
    const [prayerTimesPosition, setPrayerTimesPosition] = useState(ui.prayerTimesPosition);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        if (prayerTimesPosition !== ui.prayerTimesPosition) {
            await onUpdate({ ui: { prayerTimesPosition } });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setPrayerTimesPosition(ui.prayerTimesPosition);
        setIsEditing(false);
    };

    return (
        <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Layout className="w-5 h-5 text-primary" />
                    موضع مواقيت الصلاة (للشاشات الكبيرة)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    اختر مكان عرض مواقيت الصلاة على الشاشة الكبيرة
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Top Position */}
                    <button
                        type="button"
                        onClick={() => {
                            setPrayerTimesPosition("top");
                            setIsEditing(true);
                        }}
                        disabled={loading}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${prayerTimesPosition === "top"
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-full h-16 border-2 border-dashed border-current rounded flex items-start justify-center p-2">
                                <div className="w-3/4 h-2 bg-current rounded" />
                            </div>
                            <p className="font-bold text-sm">أعلى الصفحة</p>
                            {prayerTimesPosition === "top" && (
                                <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Right Position */}
                    <button
                        type="button"
                        onClick={() => {
                            setPrayerTimesPosition("right");
                            setIsEditing(true);
                        }}
                        disabled={loading}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${prayerTimesPosition === "right"
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-full h-16 border-2 border-dashed border-current rounded flex items-center justify-start p-2">
                                <div className="w-1/4 h-full bg-current rounded" />
                            </div>
                            <p className="font-bold text-sm">الجانب الأيمن</p>
                            {prayerTimesPosition === "right" && (
                                <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Left Position */}
                    <button
                        type="button"
                        onClick={() => {
                            setPrayerTimesPosition("left");
                            setIsEditing(true);
                        }}
                        disabled={loading}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${prayerTimesPosition === "left"
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-full h-16 border-2 border-dashed border-current rounded flex items-center justify-end p-2">
                                <div className="w-1/4 h-full bg-current rounded" />
                            </div>
                            <p className="font-bold text-sm">الجانب الأيسر</p>
                            {prayerTimesPosition === "left" && (
                                <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                                </div>
                            )}
                        </div>
                    </button>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex gap-2 pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            إلغاء
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
