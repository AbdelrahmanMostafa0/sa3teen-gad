"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePrayerTimesPosition } from "@/store/features/settingsSlice";
import { AlignHorizontalSpaceAround, PanelLeft, PanelRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/useUser";

const PositionSwitcher = () => {
    const dispatch = useDispatch();
    const currentPosition = useSelector(
        (state: RootState) => state.Settings.prayerTimesPosition
    );
    const { user, updateProfile, isAuthenticated } = useUser();
    const position = user?.settings?.ui?.prayerTimesPosition || currentPosition
    const positions = [
        { value: "right", icon: PanelRight, label: "يمين" },
        { value: "top", icon: AlignHorizontalSpaceAround, label: "أعلى" },
        { value: "left", icon: PanelLeft, label: "يسار" },
    ] as const;

    const handlePositionChange = (position: "top" | "left" | "right") => {
        const settings = localStorage.getItem("settings") || "{}";
        const parsedSettings = JSON.parse(settings);
        parsedSettings.prayerTimesPosition = position;
        if (isAuthenticated) {
            updateProfile({
                settings: {
                    ui: {
                        prayerTimesPosition: position,
                    },
                },
            });
        }
        localStorage.setItem("settings", JSON.stringify(parsedSettings));
        dispatch(updatePrayerTimesPosition(position));
    };

    // Show dropdown menu when position is "top"
    if (position === "top") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="default"
                        size="sm"
                        className="h-8 w-8 p-0 -my-2 rounded-full  transition-all duration-200 mx-10 z-2"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    {positions.map(({ value, icon: Icon, label }) => (
                        <DropdownMenuItem
                            key={value}
                            onClick={() => handlePositionChange(value)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Show inline buttons when position is "left" or "right"
    return (
        <TooltipProvider>
            <div className="flex items-center justify-center gap-1 p-1 bg-muted/30 rounded-lg backdrop-blur-sm border border-border/40">
                {positions.map(({ value, icon: Icon, label }) => (
                    <Tooltip key={value}>
                        <TooltipTrigger asChild>
                            <Button
                                variant={position === value ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handlePositionChange(value)}
                                className={`h-8 w-8 p-0 transition-all duration-200 ${position === value
                                    ? "shadow-md scale-105"
                                    : "hover:scale-105 opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
};

export default PositionSwitcher;
