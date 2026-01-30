import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ArrowClockwise,
    CaretRight,
    Moon,
    Pause,
    Play,
    Sun,
} from "@phosphor-icons/react";

interface SortControlsProps {
    isSorting: boolean;
    isComplete: boolean;
    listLength: number;
    isDarkMode: boolean;
    isFast: boolean;
    onStartSort: () => void;
    onStop: () => void;
    onStep: () => void;
    onReset: () => void;
    onToggleTheme: () => void;
    onToggleSpeed: () => void;
}

export default function SortControls({
    isSorting,
    isComplete,
    listLength,
    isDarkMode,
    isFast,
    onStartSort,
    onStop,
    onStep,
    onReset,
    onToggleTheme,
    onToggleSpeed,
}: SortControlsProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center pb-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-sm border rounded-full shadow-lg">
                {/* Play/Pause Button */}
                {!isSorting ? (
                    <Button
                        onClick={onStartSort}
                        disabled={listLength === 0}
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        aria-label="Start sorting"
                    >
                        <Play className="size-5" />
                    </Button>
                ) : (
                    <Button
                        onClick={onStop}
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        aria-label="Pause sorting"
                    >
                        <Pause className="size-5" />
                    </Button>
                )}

                {/* Next Step Button */}
                <Button
                    onClick={onStep}
                    disabled={listLength === 0 || isSorting || isComplete}
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Next step"
                >
                    <CaretRight className="size-5" />
                </Button>

                {/* Fast/Slow Toggle */}
                <Button
                    onClick={onToggleSpeed}
                    variant="outline"
                    className="rounded-full px-4"
                    disabled={isSorting}
                >
                    {isFast ? "Fast (500ms)" : "Slow (1000ms)"}
                </Button>

                {/* Reset Icon */}
                <Button
                    onClick={onReset}
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    disabled={isSorting}
                    aria-label="Reset"
                >
                    <ArrowClockwise className="size-5" />
                </Button>

                {/* Separator */}
                <Separator orientation="vertical" className="self-stretch" />

                {/* Light/Dark Mode Toggle */}
                <Button
                    onClick={onToggleTheme}
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? (
                        <Sun className="size-5" />
                    ) : (
                        <Moon className="size-5" />
                    )}
                </Button>
            </div>
        </div>
    );
}
