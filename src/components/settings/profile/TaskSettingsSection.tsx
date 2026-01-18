"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { SettingsType } from '@/types/user';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskSettingsSectionProps {
    onUpdate: (data: Partial<SettingsType>) => Promise<void>;
    loading?: boolean;
}

export default function TaskSettingsSection({ onUpdate, loading }: TaskSettingsSectionProps) {
    const { homeTaskFilter } = useSelector((state: RootState) => state.Settings);
    const [localFilter, setLocalFilter] = useState(homeTaskFilter);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        if (localFilter !== homeTaskFilter) {
            await onUpdate({ homeTaskFilter: localFilter });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setLocalFilter(homeTaskFilter);
        setIsEditing(false);
    };

    useEffect(() => {
        setLocalFilter(homeTaskFilter);
    }, [homeTaskFilter])

    return (
        <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <ListFilter className="w-5 h-5 text-primary" />
                    فلترة المهام في الصفحة الرئيسية
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    اختر المدة الزمنية التلقائية لعرض المهام في الصفحة الرئيسية
                </p>

                <div className="space-y-2">
                    <Select

                        dir='rtl'
                        value={localFilter}
                        onValueChange={(value: any) => {
                            setLocalFilter(value);
                            setIsEditing(true);
                        }}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full md:w-[280px] bg-white dark:bg-background">
                            <SelectValue placeholder="اختر الفلترة" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">اليوم</SelectItem>
                            <SelectItem value="week">الأسبوع</SelectItem>
                            <SelectItem value="month">الشهر</SelectItem>
                            <SelectItem value="all_time">كل الوقت</SelectItem>
                        </SelectContent>
                    </Select>
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
