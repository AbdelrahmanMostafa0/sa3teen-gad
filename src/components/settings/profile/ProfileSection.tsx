"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { IUser } from '@/types/user';

interface ProfileSectionProps {
    user: IUser;
    onUpdate: (data: { fullName?: string; profilePicture?: string | null }) => Promise<void>;
    loading?: boolean;
}

export default function ProfileSection({ user, onUpdate, loading }: ProfileSectionProps) {
    const [fullName, setFullName] = useState(user.fullName);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        const updates: any = {
            fullName,
            profilePicture,
        };

        await onUpdate(updates);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFullName(user.fullName);
        setProfilePicture(user.profilePicture || '');
        setIsEditing(false);
    };

    return (
        <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="w-5 h-5 text-primary" />
                    الملف الشخصي
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-bold ">
                        الاسم الكامل
                    </Label>
                    <Input
                        className='mt-2'
                        id="fullName"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            setIsEditing(true);
                        }}
                        disabled={loading}
                        placeholder="أدخل اسمك الكامل"
                    />
                </div>

                {/* Read-only fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            البريد الإلكتروني
                        </Label>
                        <p className="text-sm font-medium mt-2">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                            <Shield className="w-4 h-4" />
                            طريقة التسجيل
                        </Label>
                        <p className="text-sm font-medium mt-2">
                            {user.provider === 'email' ? 'البريد الإلكتروني' : 'Google'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            تاريخ الإنشاء
                        </Label>
                        <p className="text-sm font-medium mt-2">
                            {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            آخر تحديث
                        </Label>
                        <p className="text-sm font-medium mt-2">
                            {new Date(user.updatedAt).toLocaleDateString('ar-EG')}
                        </p>
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
