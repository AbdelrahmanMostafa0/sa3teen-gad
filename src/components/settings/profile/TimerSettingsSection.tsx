"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { SettingsType } from '@/types/user';

interface TimerSettingsSectionProps {
    timers: SettingsType['timers'];
    onUpdate: (data: { settings: { timers: Partial<SettingsType['timers']> } }) => Promise<void>;
    loading?: boolean;
}

export default function TimerSettingsSection({ timers, onUpdate, loading }: TimerSettingsSectionProps) {
    const [focusDuration, setFocusDuration] = useState(timers.focusDurationTime);
    const [shortBreak, setShortBreak] = useState(timers.shortBreakDuration);
    const [longBreak, setLongBreak] = useState(timers.longBreakDuration);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        const updates: Partial<SettingsType['timers']> = {};

        if (focusDuration !== timers.focusDurationTime) {
            updates.focusDurationTime = focusDuration;
        }
        if (shortBreak !== timers.shortBreakDuration) {
            updates.shortBreakDuration = shortBreak;
        }
        if (longBreak !== timers.longBreakDuration) {
            updates.longBreakDuration = longBreak;
        }

        if (Object.keys(updates).length > 0) {
            await onUpdate({ settings: { timers: updates } });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setFocusDuration(timers.focusDurationTime);
        setShortBreak(timers.shortBreakDuration);
        setLongBreak(timers.longBreakDuration);
        setIsEditing(false);
    };

    return (
        <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Timer className="w-5 h-5 text-primary" />
                    تظبيط الوقت
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Focus Time */}
                    <div className="space-y-2">
                        <Label htmlFor="focusDuration" className="font-bold">
                            التركيز (دقيقة)
                        </Label>
                        <Input
                            id="focusDuration"
                            type="number"
                            min={1}
                            max={120}
                            value={focusDuration === 0 ? '' : focusDuration}
                            onChange={(e) => {
                                setFocusDuration(Number(e.target.value));
                                setIsEditing(true);
                            }}
                            disabled={loading}
                        />
                    </div>

                    {/* Short Break */}
                    <div className="space-y-2">
                        <Label htmlFor="shortBreak" className="font-bold">
                            البريك القصير (دقيقة)
                        </Label>
                        <Input
                            id="shortBreak"
                            type="number"
                            min={1}
                            max={60}
                            value={shortBreak === 0 ? '' : shortBreak}
                            onChange={(e) => {
                                setShortBreak(Number(e.target.value));
                                setIsEditing(true);
                            }}
                            disabled={loading}
                        />
                    </div>

                    {/* Long Break */}
                    <div className="space-y-2">
                        <Label htmlFor="longBreak" className="font-bold">
                            البريك الطويل (دقيقة)
                        </Label>
                        <Input
                            id="longBreak"
                            type="number"
                            min={1}
                            max={120}
                            value={longBreak === 0 ? '' : longBreak}
                            onChange={(e) => {
                                setLongBreak(Number(e.target.value));
                                setIsEditing(true);
                            }}
                            disabled={loading}
                        />
                    </div>
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
