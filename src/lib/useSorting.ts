import { useCallback, useRef, useState } from "react";
import { sortingAlgorithms, type SortState, type SortingAlgorithm } from "./sorting";

function useSorting(algorithm: SortingAlgorithm = "bubble") {
    const [list, setList] = useState<number[]>(() =>
        [8, 2, 4, 7, 1, 3, 9, 6, 5]
        // Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    );
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [comparingIndex, setComparingIndex] = useState<number | null>(null);
    const [partitionLow, setPartitionLow] = useState<number | undefined>(undefined);
    const [partitionHigh, setPartitionHigh] = useState<number | undefined>(undefined);
    const [pivotIndex, setPivotIndex] = useState<number | undefined>(undefined);
    const [partitionI, setPartitionI] = useState<number | undefined>(undefined);
    const [sortedFromIndex, setSortedFromIndex] = useState<number | undefined>(undefined);
    const [isComplete, setIsComplete] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [stepMessages, setStepMessages] = useState<string[]>([]);
    const [throttleMs, setThrottleMs] = useState(250);
    const [isSorting, setIsSorting] = useState(false);

    const STEP_MESSAGE_BUFFER_SIZE = 5;

    const generatorRef = useRef<Generator<SortState, void, unknown> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setListLength = (length: number) => {
        const newList = Array.from({ length }, () => Math.floor(Math.random() * 100));
        setList(newList);
        setCurrentIndex(-1);
        setComparingIndex(null);
        setPartitionLow(undefined);
        setPartitionHigh(undefined);
        setPivotIndex(undefined);
        setPartitionI(undefined);
        setSortedFromIndex(undefined);
        setIsComplete(false);
        setProgress(0);
        setStepMessages([]);
        setIsSorting(false);

        generatorRef.current = null;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }

    const reset = () => {
        // Shuffle the existing array values, or generate a new one if empty
        if (list.length === 0) {
            const newList = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
            setList(newList);
        } else {
            // Shuffle the existing array using Fisher-Yates algorithm
            const shuffled = [...list];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setList(shuffled);
        }
        setCurrentIndex(-1);
        setComparingIndex(null);
        setPartitionLow(undefined);
        setPartitionHigh(undefined);
        setPivotIndex(undefined);
        setPartitionI(undefined);
        setSortedFromIndex(undefined);
        setIsComplete(false);
        setProgress(0);
        setStepMessages([]);
        setIsSorting(false);
        generatorRef.current = null;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }

    const next = useCallback(() => {
        if (!generatorRef.current) return;

        const result = generatorRef.current.next();

        if (result.done) {
            setIsSorting(false);
            return;
        }

        const state = result.value;
        setList(state.array);
        setCurrentIndex(state.currentIndex);
        setComparingIndex(state.comparingIndex);
        setPartitionLow(state.partitionLow);
        setPartitionHigh(state.partitionHigh);
        setPivotIndex(state.pivotIndex);
        setPartitionI(state.partitionI);
        setSortedFromIndex(state.sortedFromIndex);
        setIsComplete(state.isComplete);
        setProgress(state.progress);
        if (state.stepMessage !== undefined) {
            setStepMessages((prev) => [...prev.slice(-(STEP_MESSAGE_BUFFER_SIZE - 1)), state.stepMessage!]);
        }

        if (!state.isComplete) {
            timeoutRef.current = setTimeout(() => {
                next();
            }, throttleMs);
        } else {
            setIsSorting(false);
        }
    }, [throttleMs]);

    const startSort = useCallback(() => {
        if (list.length === 0) return;

        // If sorting is complete, reset the array first
        let arrayToSort = list;
        if (isComplete) {
            // Shuffle the existing array using Fisher-Yates algorithm
            const shuffled = [...list];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            arrayToSort = shuffled;
            setList(shuffled);
            setCurrentIndex(-1);
            setComparingIndex(null);
            setPartitionLow(undefined);
            setPartitionHigh(undefined);
            setPivotIndex(undefined);
            setPartitionI(undefined);
            setSortedFromIndex(undefined);
            setProgress(0);
            setStepMessages([]);
        }

        setIsSorting(true);
        setIsComplete(false);
        const generator = sortingAlgorithms[algorithm];
        generatorRef.current = generator(arrayToSort);
        next();
    }, [list, algorithm, isComplete, next]);

    const step = useCallback(() => {
        if (!generatorRef.current) {
            // If no generator exists, start one
            if (list.length === 0) return;
            const generator = sortingAlgorithms[algorithm];
            generatorRef.current = generator(list);
        }

        // Clear any pending automatic next call
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const result = generatorRef.current.next();

        if (result.done) {
            setIsSorting(false);
            setIsComplete(true);
            generatorRef.current = null;
            return;
        }

        const state = result.value;
        setList(state.array);
        setCurrentIndex(state.currentIndex);
        setComparingIndex(state.comparingIndex);
        setPartitionLow(state.partitionLow);
        setPartitionHigh(state.partitionHigh);
        setPivotIndex(state.pivotIndex);
        setPartitionI(state.partitionI);
        setSortedFromIndex(state.sortedFromIndex);
        setIsComplete(state.isComplete);
        setProgress(state.progress);
        if (state.stepMessage !== undefined) {
            setStepMessages((prev) => [...prev.slice(-(STEP_MESSAGE_BUFFER_SIZE - 1)), state.stepMessage!]);
        }
    }, [list, algorithm]);

    const stop = useCallback(() => {
        setIsSorting(false);
        generatorRef.current = null;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return {
        list,
        currentIndex,
        comparingIndex,
        partitionLow,
        partitionHigh,
        pivotIndex,
        partitionI,
        sortedFromIndex,
        isComplete,
        progress,
        stepMessages,
        isSorting,
        throttleMs,
        startSort,
        next,
        step,
        stop,
        reset,
        setThrottleMs,
        setListLength
    };
}

export default useSorting;