"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Clock } from 'lucide-react';
import { SettingsType } from '@/types/user';
import usePrayerTimes from '@/hooks/usePrayerTimes';

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = typeof PRAYER_NAMES[number];

const prayerNameMap: Record<PrayerName, string> = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
};

interface PrayerReminderSectionProps {
    prayerReminder: SettingsType['prayerReminder'];
    onUpdate: (data: { settings: { prayerReminder: Partial<SettingsType['prayerReminder']> } }) => Promise<void>;
    loading?: boolean;
}

export default function PrayerReminderSection({ prayerReminder, onUpdate, loading }: PrayerReminderSectionProps) {
    const { rawPrayerTimes } = usePrayerTimes();
    const [enabled, setEnabled] = useState(prayerReminder.enabled);
    const [preReminderMinutes, setPreReminderMinutes] = useState(prayerReminder.preReminderMinutes);
    const [preReminderEnabled, setPreReminderEnabled] = useState(prayerReminder.preReminderEnabled);
    const [atTimeReminderEnabled, setAtTimeReminderEnabled] = useState(prayerReminder.atTimeReminderEnabled);
    const [perPrayer, setPerPrayer] = useState(prayerReminder.perPrayer);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        const updates: any = {};

        if (enabled !== prayerReminder.enabled) updates.enabled = enabled;
        if (preReminderMinutes !== prayerReminder.preReminderMinutes) updates.preReminderMinutes = preReminderMinutes;
        if (preReminderEnabled !== prayerReminder.preReminderEnabled) updates.preReminderEnabled = preReminderEnabled;
        if (atTimeReminderEnabled !== prayerReminder.atTimeReminderEnabled) updates.atTimeReminderEnabled = atTimeReminderEnabled;
        if (JSON.stringify(perPrayer) !== JSON.stringify(prayerReminder.perPrayer)) updates.perPrayer = perPrayer;

        if (Object.keys(updates).length > 0) {
            await onUpdate({ settings: { prayerReminder: updates } });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEnabled(prayerReminder.enabled);
        setPreReminderMinutes(prayerReminder.preReminderMinutes);
        setPreReminderEnabled(prayerReminder.preReminderEnabled);
        setAtTimeReminderEnabled(prayerReminder.atTimeReminderEnabled);
        setPerPrayer(prayerReminder.perPrayer);
        setIsEditing(false);
    };

    const updatePrayerSetting = (prayer: PrayerName, field: 'pre' | 'atTime', value: boolean) => {
        setPerPrayer(prev => ({
            ...prev,
            [prayer]: {
                ...prev[prayer],
                [field]: value
            }
        }));
        setIsEditing(true);
    };

    return (
        <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Bell className="w-5 h-5 text-primary" />
                    تذكير الصلاة
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Global Toggle */}
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                    <Label htmlFor="prayerReminderEnabled" className="font-bold text-lg">
                        تفعيل تذكير الصلاة
                    </Label>
                    <Switch
                        dir="ltr"
                        id="prayerReminderEnabled"
                        checked={enabled}
                        onCheckedChange={(checked) => {
                            setEnabled(checked);
                            setIsEditing(true);
                        }}
                        disabled={loading}
                    />
                </div>

                {enabled && (
                    <>
                        {/* Pre-reminder Time */}
                        <div className="space-y-2">
                            <Label className="font-bold flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                وقت التذكير المسبق
                            </Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="number"
                                    min={1}
                                    max={60}
                                    value={preReminderMinutes}
                                    onChange={(e) => {
                                        setPreReminderMinutes(Number(e.target.value));
                                        setIsEditing(true);
                                    }}
                                    disabled={loading}
                                    className="text-center max-w-[120px]"
                                />
                                <Label>دقيقة قبل الصلاة</Label>
                            </div>
                        </div>

                        {/* Global Reminder Types */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                                <Label htmlFor="preReminderEnabled" className="font-medium">
                                    تذكير مسبق
                                </Label>
                                <Switch
                                    dir="ltr"
                                    id="preReminderEnabled"
                                    checked={preReminderEnabled}
                                    onCheckedChange={(checked) => {
                                        setPreReminderEnabled(checked);
                                        setIsEditing(true);
                                    }}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                                <Label htmlFor="atTimeReminderEnabled" className="font-medium">
                                    تذكير عند الوقت
                                </Label>
                                <Switch
                                    dir="ltr"
                                    id="atTimeReminderEnabled"
                                    checked={atTimeReminderEnabled}
                                    onCheckedChange={(checked) => {
                                        setAtTimeReminderEnabled(checked);
                                        setIsEditing(true);
                                    }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Individual Prayer Controls */}
                        <div className="space-y-3">
                            <Label className="font-bold text-base">تخصيص كل صلاة</Label>
                            <div className="grid grid-cols-1 gap-3">
                                {PRAYER_NAMES.map((prayer) => {
                                    const prayerTime = rawPrayerTimes.find(p => p.name === prayer);
                                    return (
                                        <Card key={prayer} className="border-border/30 bg-card/50 backdrop-blur-sm">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <p className="font-bold text-lg">{prayerNameMap[prayer]}</p>
                                                        {prayerTime && (
                                                            <p className="text-sm text-muted-foreground">{prayerTime.time}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <div className="flex items-center justify-between p-2 bg-secondary/40 rounded">
                                                        <Label className="text-sm">تذكير مسبق</Label>
                                                        <Switch
                                                            dir="ltr"
                                                            checked={perPrayer[prayer]?.pre ?? true}
                                                            onCheckedChange={(checked) => updatePrayerSetting(prayer, 'pre', checked)}
                                                            disabled={!preReminderEnabled || loading}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between p-2 bg-secondary/40 rounded">
                                                        <Label className="text-sm">عند الوقت</Label>
                                                        <Switch
                                                            dir="ltr"
                                                            checked={perPrayer[prayer]?.atTime ?? true}
                                                            onCheckedChange={(checked) => updatePrayerSetting(prayer, 'atTime', checked)}
                                                            disabled={!atTimeReminderEnabled || loading}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex gap-2 pt-4">
                        <Button onClick={handleSave} disabled={loading} className="flex-1">
                            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={loading}>
                            إلغاء
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
