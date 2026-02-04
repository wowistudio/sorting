import SortControls from "@/components/SortControls";
import SortLegend from "@/components/SortLegend";
import SortProgress from "@/components/SortProgress";
import SortVisualization from "@/components/SortVisualization";
import { Badge } from "@/components/ui/badge";
import type { SortingAlgorithm as SortingAlgorithmType } from "@/lib/sorting";
import useSorting from "@/lib/useSorting";

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
            <div className="rounded-2xl border bg-card/70 backdrop-blur px-4 py-3 space-y-2">
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

            <SortLegend algorithm={algorithm} />

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
