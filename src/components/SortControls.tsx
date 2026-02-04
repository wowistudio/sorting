import { Button } from "@/components/ui/button";
import {
    ArrowClockwise,
    CaretLeft,
    CaretRight,
    Pause,
    Play
} from "@phosphor-icons/react";

interface SortControlsProps {
    isSorting: boolean;
    isComplete: boolean;
    listLength: number;
    canStepBack: boolean;
    onStartSort: () => void;
    onStop: () => void;
    onStep: () => void;
    onStepBack: () => void;
    onReset: () => void;
}

export default function SortControls({
    isSorting,
    isComplete,
    listLength,
    canStepBack,
    onStartSort,
    onStop,
    onStep,
    onStepBack,
    onReset,
}: SortControlsProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-end gap-2 pb-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-sm border rounded-full shadow-lg">
                {/* Previous Step Button */}
                <Button
                    onClick={onStepBack}
                    disabled={!canStepBack || isSorting}
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Previous step"
                >
                    <CaretLeft className="size-5" />
                </Button>

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
            </div>
        </div>
    );
}
