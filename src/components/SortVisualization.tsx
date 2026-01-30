import { motion } from "motion/react";
import FlipMove from "react-flip-move";

interface SortVisualizationProps {
    list: number[];
    currentIndex: number;
    comparingIndex: number | null;
    partitionLow?: number;
    partitionHigh?: number;
    pivotIndex?: number;
    partitionI?: number;
    sortedFromIndex?: number;
}

export default function SortVisualization({
    list,
    currentIndex,
    comparingIndex,
    partitionLow,
    partitionHigh,
    pivotIndex,
    partitionI,
    sortedFromIndex,
}: SortVisualizationProps) {
    return (
        <div className="flex justify-center">
            <FlipMove
                typeName="ul"
                className="flex gap-3 items-end justify-center min-h-[300px] w-full md:max-w-4xl lg:max-w-6xl xl:max-w-7xl"
                duration={300}
                easing="ease-out"
            >
                {list.map((value, index) => {
                    const isCurrent = index === currentIndex;
                    const isComparing = index === comparingIndex;
                    const isHighlighted = isCurrent || isComparing;
                    const isPartitionLow = partitionLow !== undefined && index === partitionLow;
                    const isPartitionHigh = partitionHigh !== undefined && index === partitionHigh;
                    const isPivot = pivotIndex !== undefined && index === pivotIndex;
                    const isBoundaryI = partitionI !== undefined && index === partitionI;
                    // Check if this index is in the sorted portion (for bubble sort)
                    const isSorted = sortedFromIndex !== undefined && index >= sortedFromIndex;
                    // Check if this index is within the active partition
                    const isInActivePartition = partitionLow !== undefined && partitionHigh !== undefined
                        ? index >= partitionLow && index <= partitionHigh
                        : true; // If no partition info, show all items normally

                    return (
                        <li
                            key={value}
                            className="flex flex-col items-center justify-end flex-1 max-w-[60px]"
                        >
                            <motion.div
                                className={`rounded-2xl flex items-end justify-center font-bold text-sm w-full relative shadow-lg ${isSorted
                                    ? "bg-green-500 text-white"
                                    : isBoundaryI
                                        ? "bg-violet-500 text-white"
                                        : isHighlighted
                                            ? isCurrent
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-secondary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                style={{
                                    height: `${value * 3}px`,
                                    minHeight: "40px",
                                    ...(isBoundaryI && { boxShadow: "0 0 0 3px rgb(139, 92, 246)" }),
                                }}
                                animate={{
                                    boxShadow: isBoundaryI
                                        ? "0 0 0 3px rgb(139, 92, 246), 0 10px 40px rgba(0, 0, 0, 0.2)"
                                        : isHighlighted
                                            ? "0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)"
                                            : "0 4px 20px rgba(0, 0, 0, 0.1)",
                                }}
                                transition={{
                                    height: { duration: 0.3, ease: "easeOut" },
                                }}
                            >
                                {!isInActivePartition && (
                                    <div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{
                                            backgroundColor: "var(--background)",
                                            opacity: 0.8,
                                        }}
                                    />
                                )}
                                <span
                                    className={`relative z-10 mb-2 drop-shadow-lg inline-flex items-center justify-center min-w-6 ${isPivot ? "rounded-full bg-red-500 text-white px-1.5 py-0.5" : ""
                                        }`}
                                >
                                    {value}
                                </span>
                            </motion.div>
                        </li>
                    );
                })}
            </FlipMove>
        </div>
    );
}
