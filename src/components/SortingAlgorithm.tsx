import SortControls from "@/components/SortControls";
import SortLegend from "@/components/SortLegend";
import SortProgress from "@/components/SortProgress";
import SortVisualization from "@/components/SortVisualization";
import { Badge } from "@/components/ui/badge";
import type { SortingAlgorithm as SortingAlgorithmType } from "@/lib/sorting";
import useSorting from "@/lib/useSorting";
import { ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

interface SortingAlgorithmProps {
    algorithm: SortingAlgorithmType;
    title: string;
    averageComplexity: string;
    worstCaseComplexity: string;
    memoryComplexity: string;
    explanation: string;
}

export default function SortingAlgorithm({
    algorithm,
    title,
    averageComplexity,
    worstCaseComplexity,
    memoryComplexity,
    explanation,
}: SortingAlgorithmProps) {
    const {
        list,
        currentIndex,
        comparingIndex,
        partitionLow,
        partitionHigh,
        pivotIndex,
        partitionI,
        sortedFromIndex,
        progress,
        stepMessages,
        isComplete,
        isSorting,
        historyIndex,
        startSort,
        stop,
        step,
        stepBack,
        reset,
    } = useSorting(algorithm);

    return (
        <>
            <div className="rounded-2xl border bg-card/70 backdrop-blur px-4 py-3 space-y-3">
                <p className="text-sm font-medium text-foreground">
                    {title}
                </p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                        Average: {averageComplexity}
                    </Badge>
                    <Badge variant="outline">
                        Worst: {worstCaseComplexity}
                    </Badge>
                    <Badge variant="outline">
                        Memory: {memoryComplexity}
                    </Badge>
                </div>
                {/* Pros & Cons */}
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <ThumbsUp className="size-4" weight="fill" />
                        <span className="font-semibold">Pro</span>
                        <span className="text-muted-foreground">
                            {algorithm === "mergesort"
                                ? "Guaranteed O(n log n)"
                                : algorithm === "quicksort"
                                    ? "Fast average case"
                                    : "Very simple implementation"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-red-500">
                        <ThumbsDown className="size-4" weight="fill" />
                        <span className="font-semibold">Con</span>
                        <span className="text-muted-foreground">
                            {algorithm === "mergesort"
                                ? "Extra memory usage"
                                : algorithm === "quicksort"
                                    ? "Worst-case O(n²)"
                                    : "Extremely slow performance"}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    {explanation}
                </p>
            </div>

            <SortVisualization
                list={list}
                currentIndex={currentIndex}
                comparingIndex={comparingIndex}
                partitionLow={partitionLow}
                partitionHigh={partitionHigh}
                pivotIndex={pivotIndex}
                partitionI={partitionI}
                sortedFromIndex={sortedFromIndex}
            />

            <SortLegend
                algorithm={algorithm}
                currentValue={currentIndex >= 0 ? list[currentIndex] : null}
                comparingValue={
                    comparingIndex !== null && comparingIndex >= 0
                        ? list[comparingIndex]
                        : null
                }
            />

            <SortProgress progress={progress} stepMessages={stepMessages} />

            <SortControls
                isSorting={isSorting}
                isComplete={isComplete}
                listLength={list.length}
                canStepBack={historyIndex > 0}
                onStartSort={startSort}
                onStop={stop}
                onStep={step}
                onStepBack={stepBack}
                onReset={reset}
            />
        </>
    );
}
