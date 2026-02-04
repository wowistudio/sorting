import { useCallback, useRef, useState } from "react";
import { sortingAlgorithms, type SortState, type SortingAlgorithm } from "./sorting";

function generateListIds(length: number): string[] {
    return Array.from({ length }, (_, i) => `id-${i}-${Math.random().toString(36).slice(2)}`);
}

function computeListIdsAfterReorder(
    oldList: number[],
    oldListIds: string[],
    newList: number[]
): string[] {
    if (oldList.length !== newList.length) return generateListIds(newList.length);
    const used = new Set<number>();
    const newListIds = new Array<string>(newList.length);
    for (let i = 0; i < newList.length; i++) {
        for (let j = 0; j < oldList.length; j++) {
            if (!used.has(j) && oldList[j] === newList[i]) {
                newListIds[i] = oldListIds[j];
                used.add(j);
                break;
            }
        }
    }
    return newListIds;
}

function useSorting(algorithm: SortingAlgorithm = "bubble") {
    const initialList = [8, 2, 4, 7, 1, 3, 9, 6, 5];
    const initialListIdsRef = useRef<string[] | null>(null);
    const [list, setList] = useState<number[]>(initialList);
    const [listIds, setListIds] = useState<string[]>(() => {
        const ids = generateListIds(initialList.length);
        initialListIdsRef.current = ids;
        return ids;
    });
    const prevListRef = useRef<number[]>(initialList);
    const prevListIdsRef = useRef<string[]>(initialListIdsRef.current ?? []);
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
    const [historyIndex, setHistoryIndex] = useState(-1);

    const STEP_MESSAGE_BUFFER_SIZE = 5;

    const generatorRef = useRef<Generator<SortState, void, unknown> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const historyRef = useRef<SortState[]>([]);

    // Helper to derive step messages from history
    const getStepMessagesFromHistory = (index: number): string[] => {
        const history = historyRef.current;
        const start = Math.max(0, index - STEP_MESSAGE_BUFFER_SIZE + 1);
        return history
            .slice(start, index + 1)
            .map(s => s.stepMessage)
            .filter((msg): msg is string => msg !== undefined);
    };

    // Helper to apply a state from history
    const applyState = (state: SortState, index: number) => {
        const newList = state.array;
        const newListIds = computeListIdsAfterReorder(
            prevListRef.current,
            prevListIdsRef.current,
            newList
        );
        setList(newList);
        setListIds(newListIds);
        prevListRef.current = newList;
        prevListIdsRef.current = newListIds;
        setCurrentIndex(state.currentIndex);
        setComparingIndex(state.comparingIndex);
        setPartitionLow(state.partitionLow);
        setPartitionHigh(state.partitionHigh);
        setPivotIndex(state.pivotIndex);
        setPartitionI(state.partitionI);
        setSortedFromIndex(state.sortedFromIndex);
        setIsComplete(state.isComplete);
        setProgress(state.progress);
        setStepMessages(getStepMessagesFromHistory(index));
        setHistoryIndex(index);
    };

    const setListLength = (length: number) => {
        const newList = Array.from({ length }, () => Math.floor(Math.random() * 100));
        const newListIds = generateListIds(length);
        setList(newList);
        setListIds(newListIds);
        prevListRef.current = newList;
        prevListIdsRef.current = newListIds;
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
        setHistoryIndex(-1);
        historyRef.current = [];

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
            const newListIds = generateListIds(newList.length);
            setList(newList);
            setListIds(newListIds);
            prevListRef.current = newList;
            prevListIdsRef.current = newListIds;
        } else {
            // Shuffle the existing array using Fisher-Yates algorithm
            const shuffled = [...list];
            const shuffledIds = [...listIds];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
            }
            setList(shuffled);
            setListIds(shuffledIds);
            prevListRef.current = shuffled;
            prevListIdsRef.current = shuffledIds;
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
        setHistoryIndex(-1);
        historyRef.current = [];
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
        // Push to history
        historyRef.current.push(state);
        const newIndex = historyRef.current.length - 1;
        applyState(state, newIndex);

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
            const shuffledIds = [...listIds];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
            }
            arrayToSort = shuffled;
            setList(shuffled);
            setListIds(shuffledIds);
            prevListRef.current = shuffled;
            prevListIdsRef.current = shuffledIds;
            setCurrentIndex(-1);
            setComparingIndex(null);
            setPartitionLow(undefined);
            setPartitionHigh(undefined);
            setPivotIndex(undefined);
            setPartitionI(undefined);
            setSortedFromIndex(undefined);
            setProgress(0);
            setStepMessages([]);
            setHistoryIndex(-1);
            historyRef.current = [];
        }

        setIsSorting(true);
        setIsComplete(false);
        const generator = sortingAlgorithms[algorithm];
        generatorRef.current = generator(arrayToSort);
        next();
    }, [list, algorithm, isComplete, next]);

    const step = useCallback(() => {
        // Clear any pending automatic next call
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // If we're behind in history, step forward through history
        if (historyIndex < historyRef.current.length - 1) {
            const newIndex = historyIndex + 1;
            const state = historyRef.current[newIndex];
            applyState(state, newIndex);
            return;
        }

        // Otherwise, pull from generator
        if (!generatorRef.current) {
            // If no generator exists, start one
            if (list.length === 0) return;
            const generator = sortingAlgorithms[algorithm];
            generatorRef.current = generator(list);
        }

        const result = generatorRef.current.next();

        if (result.done) {
            setIsSorting(false);
            setIsComplete(true);
            generatorRef.current = null;
            return;
        }

        const state = result.value;
        // Push to history
        historyRef.current.push(state);
        const newIndex = historyRef.current.length - 1;
        applyState(state, newIndex);
    }, [list, algorithm, historyIndex]);

    const stepBack = useCallback(() => {
        // Clear any pending automatic next call
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Can't step back if no history or already at start
        if (historyIndex <= 0) return;

        const newIndex = historyIndex - 1;
        const state = historyRef.current[newIndex];
        applyState(state, newIndex);
    }, [historyIndex]);

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
        listIds,
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
        historyIndex,
        startSort,
        next,
        step,
        stepBack,
        stop,
        reset,
        setThrottleMs,
        setListLength
    };
}

export default useSorting;