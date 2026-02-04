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
                className="flex gap-3 items-end justify-center w-full md:max-w-4xl lg:max-w-6xl xl:max-w-7xl"
                duration={300}
                easing="ease-out"
            >
                {list.map((value, index) => {
                    const isCurrent = index === currentIndex;
                    const isComparing = index === comparingIndex;
                    const isHighlighted = isCurrent || isComparing;
                    const isPivot = pivotIndex !== undefined && index === pivotIndex;
                    const isBoundaryI = partitionI !== undefined && index === partitionI;
                    const isSorted = sortedFromIndex !== undefined && index >= sortedFromIndex;
                    const isInActivePartition = partitionLow !== undefined && partitionHigh !== undefined
                        ? index >= partitionLow && index <= partitionHigh
                        : true; // If no partition info, show all items normally

                    return (
                        <li
                            key={value}
                            className="flex flex-col items-center justify-end flex-1 max-w-[60px]"
                        >
                            <motion.div
                                className={`rounded-2xl flex items-end justify-center font-bold text-sm w-full h-10 relative ${isSorted
                                    ? "bg-green-500 text-white"
                                    : isBoundaryI
                                        ? "bg-violet-500 text-white"
                                        : isHighlighted
                                            ? isCurrent
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-red-500 text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                style={{
                                    ...(isBoundaryI && { boxShadow: "0 0 0 3px rgb(139, 92, 246)" }),
                                }}
                            >
                                {!isInActivePartition && (
                                    <div
                                        className="absolute inset-0 rounded-2xl bg-background/80"
                                    />
                                )}
                                <span
                                    className={`relative z-10 mb-2 inline-flex items-center justify-center min-w-6 ${isPivot ? "rounded-full bg-red-500 text-white px-1.5 py-0.5" : ""
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
