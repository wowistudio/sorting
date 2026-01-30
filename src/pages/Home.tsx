import SortControls from "@/components/SortControls";
import SortLegend from "@/components/SortLegend";
import SortProgress from "@/components/SortProgress";
import SortVisualization from "@/components/SortVisualization";
import { useTheme } from "@/components/theme-provider";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import type { SortingAlgorithm } from "@/lib/sorting";
import useSorting from "@/lib/useSorting";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");

    // Map URL param to algorithm: "quick" -> "quicksort", "bubble" -> "bubble"
    const getAlgorithmFromParam = (param: string | null): SortingAlgorithm => {
        if (param === "quick" || param === "quicksort") return "quicksort";
        return "bubble";
    };

    const [algorithm, setAlgorithm] = useState<SortingAlgorithm>(() =>
        getAlgorithmFromParam(tabParam)
    );

    const { theme, setTheme } = useTheme();
    const [isFast, setIsFast] = useState(true); // true = 500ms, false = 1000ms

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
        startSort,
        stop,
        step,
        reset,
        setThrottleMs,
    } = useSorting(algorithm);

    const prevAlgorithmRef = useRef<SortingAlgorithm>(algorithm);

    // Sync algorithm with URL param on mount and when param changes
    useEffect(() => {
        const paramAlgorithm = getAlgorithmFromParam(tabParam);
        setAlgorithm(paramAlgorithm);
    }, [tabParam]);

    // Reset sorting when algorithm changes (but not on initial mount)
    useEffect(() => {
        if (prevAlgorithmRef.current !== algorithm) {
            reset();
            prevAlgorithmRef.current = algorithm;
        }
    }, [algorithm, reset]);

    const handleTabChange = (value: string) => {
        const newAlgorithm = value as SortingAlgorithm;
        setAlgorithm(newAlgorithm);
        // Update URL: "quicksort" -> "quick", "bubble" -> "bubble"
        const urlTab = newAlgorithm === "quicksort" ? "quick" : "bubble";
        setSearchParams({ tab: urlTab });
    };

    const toggleSpeed = () => {
        const newSpeed = isFast ? 1000 : 500;
        setIsFast(!isFast);
        setThrottleMs(newSpeed);
    };

    const toggleTheme = () => {
        const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setTheme(isDark ? "light" : "dark");
    };

    const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <div className="min-h-screen w-full bg-background p-8">
            <div className="max-w-[600px] mx-auto space-y-8">
                <Tabs value={algorithm} onValueChange={handleTabChange}>
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="bubble">Bubble</TabsTrigger>
                        <TabsTrigger value="quicksort">Quicksort</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bubble" className="space-y-8 mt-6">
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
                        />
                        <SortProgress progress={progress} stepMessages={stepMessages} />
                    </TabsContent>

                    <TabsContent value="quicksort" className="space-y-8 mt-6">
                        <SortVisualization
                            list={list}
                            currentIndex={currentIndex}
                            comparingIndex={comparingIndex}
                            partitionLow={partitionLow}
                            partitionHigh={partitionHigh}
                            pivotIndex={pivotIndex}
                            partitionI={partitionI}
                        />
                        <SortLegend
                            algorithm={algorithm}
                        />
                        <SortProgress progress={progress} stepMessages={stepMessages} />
                    </TabsContent>
                </Tabs>
            </div>

            <SortControls
                isSorting={isSorting}
                isComplete={isComplete}
                listLength={list.length}
                isDarkMode={isDarkMode}
                isFast={isFast}
                onStartSort={startSort}
                onStop={stop}
                onStep={step}
                onReset={reset}
                onToggleTheme={toggleTheme}
                onToggleSpeed={toggleSpeed}
            />
        </div>
    );
}