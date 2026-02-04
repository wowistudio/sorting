import type { SortingAlgorithm } from "@/lib/sorting";

interface SortLegendProps {
    algorithm: SortingAlgorithm;
    currentValue?: number | null;
    comparingValue?: number | null;
}

export default function SortLegend({ algorithm, currentValue, comparingValue }: SortLegendProps) {
    return (
        <div className="flex justify-center gap-6 text-xs text-muted-foreground flex-wrap">
            {/* Current item - shown for all algorithms */}
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <span>
                    Current
                </span>
            </div>

            {/* Compared item - only for bubble sort */}
            {algorithm === "bubble" || algorithm === "mergesort" && (
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>Compared</span>
                </div>
            )}

            {/* Sorted items - shown for all algorithms */}
            {algorithm === "bubble" && (
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Sorted</span>
                </div>
            )}

            {/* Partition boundaries - only for quicksort */}
            {algorithm === "quicksort" && (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-violet-500"></div>
                        <span>Boundary</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Pivot</span>
                    </div>
                </>
            )}

        </div>
    );
}
