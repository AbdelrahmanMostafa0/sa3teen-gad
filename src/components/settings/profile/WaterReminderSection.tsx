"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Droplets } from 'lucide-react';
import { SettingsType } from '@/types/user';

interface WaterReminderSectionProps {
    waterReminder: SettingsType['waterReminder'];
    onUpdate: (data: { waterReminder: Partial<SettingsType['waterReminder']> }) => Promise<void>;
    loading?: boolean;
}

export default function WaterReminderSection({ waterReminder, onUpdate, loading }: WaterReminderSectionProps) {
    const [enabled, setEnabled] = useState(waterReminder.enabled);
    const [interval, setInterval] = useState(waterReminder.interval);
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        setInterval(waterReminder.interval);
    }, [waterReminder.interval]);
    const handleSave = async () => {
        const updates: Partial<SettingsType['waterReminder']> = {
            enabled,
            interval,
        };

        await onUpdate({ waterReminder: updates });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEnabled(waterReminder.enabled);
        setInterval(waterReminder.interval);
        setIsEditing(false);
    };

    return (
        <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Droplets className="w-5 h-5 text-primary" />
                    تذكير شرب الماء
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Enable Toggle */}
                <div className="flex items-center justify-between">
                    <Label htmlFor="waterReminderEnabled" className="font-bold">
                        تفعيل التذكير
                    </Label>
                    <Switch
                        dir="ltr"
                        id="waterReminderEnabled"
                        checked={enabled}
                        onCheckedChange={(checked) => {
                            setEnabled(checked);
                            setIsEditing(true);
                        }}
                        disabled={loading}
                    />
                </div>

                {/* Interval */}
                {enabled && (
                    <div className="flex items-center gap-4">
                        <Label className="whitespace-nowrap">تذكير كل</Label>
                        <Input
                            type="number"
                            min={5}
                            max={180}
                            value={interval || ""}
                            onChange={(e) => {
                                setInterval(Number(e.target.value));
                                setIsEditing(true);
                            }}
                            disabled={loading}
                            className="w-24"
                        />
                        <Label>دقيقة</Label>
                    </div>
                )}

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
