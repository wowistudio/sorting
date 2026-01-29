import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import type { SortingAlgorithm } from "@/lib/sorting";
import useSorting from "@/lib/useSorting";
import { ArrowClockwise, Moon, Sun, Play, Pause, CaretRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";
import FlipMove from "react-flip-move";

export default function Home() {
    const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble");
    const { theme, setTheme } = useTheme();
    const [isFast, setIsFast] = useState(true); // true = 500ms, false = 1000ms

    const {
        list,
        currentIndex,
        comparingIndex,
        progress,
        isComplete,
        isSorting,
        startSort,
        stop,
        step,
        reset,
        setThrottleMs,
    } = useSorting(algorithm);

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
                <Tabs value={algorithm} onValueChange={(value) => setAlgorithm(value as SortingAlgorithm)}>
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="bubble">Bubble</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bubble" className="space-y-8 mt-6">
                        {/* Visualized List */}
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

                                    return (
                                        <li
                                            key={value}
                                            className="flex flex-col items-center justify-end flex-1 max-w-[60px]"
                                        >
                                                <motion.div
                                                    className={`rounded-2xl flex items-end justify-center font-bold text-sm w-full relative overflow-hidden shadow-lg ${
                                                        isHighlighted
                                                            ? isCurrent
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-secondary text-secondary-foreground"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}
                                                    style={{
                                                        height: `${value * 3}px`,
                                                        minHeight: "40px",
                                                    }}
                                                    animate={{
                                                        boxShadow: isHighlighted
                                                            ? "0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)"
                                                            : "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                    transition={{ 
                                                        height: { duration: 0.3, ease: "easeOut" }
                                                    }}
                                                >
                                                    <span className="relative z-10 mb-2 drop-shadow-lg">
                                                        {value}
                                                    </span>
                                                </motion.div>
                                        </li>
                                        );
                                    })}
                            </FlipMove>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Bottom Menu Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center pb-4">
                <div className="flex items-center gap-3 px-6 py-3 bg-card/95 backdrop-blur-sm border rounded-full shadow-lg">
                    {/* Play/Pause Button */}
                    {!isSorting ? (
                        <Button 
                            onClick={startSort} 
                            disabled={list.length === 0} 
                            variant="outline" 
                            size="icon"
                            className="rounded-full"
                            aria-label="Start sorting"
                        >
                            <Play className="size-5" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={stop} 
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
                        onClick={step}
                        disabled={list.length === 0 || isSorting || isComplete}
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        aria-label="Next step"
                    >
                        <CaretRight className="size-5" />
                    </Button>

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

                    {/* Fast/Slow Toggle */}
                    <Button
                        onClick={toggleSpeed}
                        variant="outline"
                        className="rounded-full px-4"
                        disabled={isSorting}
                    >
                        {isFast ? "Fast (500ms)" : "Slow (1000ms)"}
                    </Button>

                    {/* Reset Icon */}
                    <Button
                        onClick={reset}
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
        </div>
    );
}