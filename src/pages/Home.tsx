import SortingAlgorithm from "@/components/SortingAlgorithm";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent
} from "@/components/ui/tabs";
import type { SortingAlgorithm as SortingAlgorithmName } from "@/lib/sorting";
import { ArrowsDownUp, CaretDown, Lightning, Moon, StackSimple, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");

    // Map URL param to algorithm: "quick" -> "quicksort", "merge" -> "mergesort", "bubble" -> "bubble"
    const getAlgorithmFromParam = (param: string | null): SortingAlgorithmName => {
        if (param === "quick" || param === "quicksort") return "quicksort";
        if (param === "merge" || param === "mergesort") return "mergesort";
        return "bubble";
    };

    const [algorithm, setAlgorithm] = useState<SortingAlgorithmName>(() =>
        getAlgorithmFromParam(tabParam)
    );

    const { theme, setTheme } = useTheme();

    const [showAlgorithmMenu, setShowAlgorithmMenu] = useState(false);

    // Sync algorithm with URL param on mount and when param changes
    useEffect(() => {
        const paramAlgorithm = getAlgorithmFromParam(tabParam);
        setAlgorithm(paramAlgorithm);
    }, [tabParam]);

    const handleTabChange = (value: string) => {
        const newAlgorithm = value as SortingAlgorithmName;
        setAlgorithm(newAlgorithm);
        // Update URL: "quicksort" -> "quick", "mergesort" -> "merge", "bubble" -> "bubble"
        const urlTab = newAlgorithm === "quicksort" ? "quick" : newAlgorithm === "mergesort" ? "merge" : "bubble";
        setSearchParams({ tab: urlTab });
    };

    const toggleTheme = () => {
        const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setTheme(isDark ? "light" : "dark");
    };

    const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const currentAlgorithmLabel =
        algorithm === "quicksort" ? "Quick sort" : algorithm === "mergesort" ? "Merge sort" : "Bubble sort";

    return (
        <>
            {/* Top-right controls: algorithm + theme */}
            <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                {/* Sorting algorithm selector */}
                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full flex items-center gap-2"
                        aria-haspopup="menu"
                        aria-expanded={showAlgorithmMenu}
                        onClick={() => setShowAlgorithmMenu((prev) => !prev)}
                    >
                        {algorithm === "bubble" ? (
                            <ArrowsDownUp className="size-4" />
                        ) : algorithm === "quicksort" ? (
                            <Lightning className="size-4" />
                        ) : (
                            <StackSimple className="size-4" />
                        )}
                        <span className="text-xs font-medium">
                            {currentAlgorithmLabel}
                        </span>
                        <CaretDown className="size-4" />
                    </Button>

                    {showAlgorithmMenu && (
                        <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-card/95 backdrop-blur shadow-lg py-1 z-50">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start px-3 py-2 text-xs gap-2"
                                onClick={() => {
                                    handleTabChange("bubble");
                                    setShowAlgorithmMenu(false);
                                }}
                            >
                                <ArrowsDownUp className="size-4" />
                                <span>Bubble sort</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start px-3 py-2 text-xs gap-2"
                                onClick={() => {
                                    handleTabChange("quicksort");
                                    setShowAlgorithmMenu(false);
                                }}
                            >
                                <Lightning className="size-4" />
                                <span>Quick sort</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start px-3 py-2 text-xs gap-2"
                                onClick={() => {
                                    handleTabChange("mergesort");
                                    setShowAlgorithmMenu(false);
                                }}
                            >
                                <StackSimple className="size-4" />
                                <span>Merge sort</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Light/Dark Mode Toggle */}
                <Button
                    onClick={toggleTheme}
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

            <div className="min-h-screen w-full bg-background p-8">
                <div className="max-w-[600px] mx-auto space-y-8">
                    <Tabs value={algorithm} onValueChange={handleTabChange}>
                        <TabsContent value="bubble" className="space-y-8 mt-6">
                            <SortingAlgorithm
                                algorithm="bubble"
                                title="Bubble sort"
                                averageComplexity="O(n²)"
                                worstCaseComplexity="O(n²)"
                                memoryComplexity="O(1)"
                                explanation="Bubble sort walks through the list, comparing neighbouring values and swapping them when they are out of order, so that bigger values gradually &quot;bubble&quot; to the end and one more item is fixed in place after each pass."
                            />
                        </TabsContent>

                        <TabsContent value="quicksort" className="space-y-8 mt-6">
                            <SortingAlgorithm
                                algorithm="quicksort"
                                title="Quicksort"
                                averageComplexity="O(n log n)"
                                worstCaseComplexity="O(n²)"
                                memoryComplexity="O(log n)"
                                explanation="Quicksort is a divide-and-conquer algorithm that repeatedly picks a pivot value, moves smaller or equal values to its left and larger ones to its right, and then recurses on those sub‑ranges until everything is in order."
                            />
                        </TabsContent>

                        <TabsContent value="mergesort" className="space-y-8 mt-6">
                            <SortingAlgorithm
                                algorithm="mergesort"
                                title="Merge sort"
                                averageComplexity="O(n log n)"
                                worstCaseComplexity="O(n log n)"
                                memoryComplexity="O(n)"
                                explanation="Merge sort is a divide-and-conquer algorithm that splits the array in half recursively until subarrays have one element, then merges pairs of sorted subarrays by comparing elements from each half and placing the smaller one in order."
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}