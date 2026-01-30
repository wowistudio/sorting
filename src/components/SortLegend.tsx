import type { SortingAlgorithm } from "@/lib/sorting";

interface SortLegendProps {
    algorithm: SortingAlgorithm;
}

export default function SortLegend({ algorithm }: SortLegendProps) {
    return (
        <div className="flex justify-center gap-6 text-xs text-muted-foreground flex-wrap">
            {/* Current item - shown for both algorithms */}
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <span>Current</span>
            </div>

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
