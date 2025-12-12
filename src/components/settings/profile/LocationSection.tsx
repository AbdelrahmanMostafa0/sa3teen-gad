"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { SettingsType } from '@/types/user';
import countries from '@/data/countries.json';

interface LocationSectionProps {
    location: SettingsType['location'];
    onUpdate: (data: { location: Partial<SettingsType['location']> }) => Promise<void>;
    loading?: boolean;
}

export default function LocationSection({ location, onUpdate, loading }: LocationSectionProps) {
    const [country, setCountry] = useState(location.country);
    const [city, setCity] = useState(location.city);
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        setCountry(location.country);
        setCity(location.city);
    }, [location.city, location.country]);

    const countryCities = useMemo(() => {
        return countries.find((c) => c.iso3 === country)?.cities || [];
    }, [country]);

    const handleSave = async () => {
        const updates: Partial<SettingsType['location']> = {
            country,
            city,
        };

        await onUpdate({ location: updates });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCountry(location.country);
        setCity(location.city);
        setIsEditing(false);
    };

    return (
        <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="w-5 h-5 text-primary" />
                    الموقع لمواقيت الصلاة
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Country */}
                    <div className="space-y-2">
                        <Label className="font-bold">الدولة</Label>
                        <Select
                            value={country}
                            onValueChange={(value) => {
                                setCountry(value);
                                setCity(''); // Reset city when country changes
                                setIsEditing(true);
                            }}
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((c) => (
                                    <SelectItem key={c.country} value={c.iso3}>
                                        {c.country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <Label className="font-bold">المدينة</Label>
                        <Select

                            value={city}
                            onValueChange={(value) => {
                                setCity(value);
                                setIsEditing(true);
                            }}
                            disabled={loading || !country}
                        >
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                            <SelectContent>
                                {countryCities.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
