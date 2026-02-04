
export interface SortState {
    array: number[];
    currentIndex: number;   // For quicksort: j (current element being compared)
    comparingIndex: number | null;
    isComplete: boolean;
    progress: number; // 0-100
    partitionLow?: number;  // Active partition range [low..high]
    partitionHigh?: number;
    pivotIndex?: number;    // Index of pivot (arr[high] during partition)
    partitionI?: number;    // Lomuto boundary i (last index of elements <= pivot)
    stepMessage?: string;  // Human-readable description of current step
    sortedFromIndex?: number; // For bubble sort: all indices >= this are sorted
}

export type SortingAlgorithm = "bubble" | "quicksort" | "mergesort";


function* bubbleSortGenerator(arr: number[]): Generator<SortState, void, unknown> {
    const array = [...arr]; // Create a copy to avoid mutating the original
    const totalItems = array.length;
    let sortedItems = 0; // Track number of items in their final sorted position

    for (let i = 0; i < array.length; i++) {
        // sortedFromIndex: all indices >= this are sorted (on the right side)
        const sortedFromIndex = totalItems - sortedItems;

        for (let j = 0; j < array.length - i - 1; j++) {
            // Calculate progress based on sorted items
            const progress = totalItems > 0 ? Math.round((sortedItems / totalItems) * 100) : 0;

            // Yield state before comparison
            const a = array[j];
            const b = array[j + 1];
            yield {
                array: [...array],
                currentIndex: j,
                comparingIndex: j + 1,
                isComplete: false,
                progress,
                stepMessage: `Comparing ${a} and ${b}`,
                sortedFromIndex,
            };

            if (array[j] > array[j + 1]) {
                const temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                // Yield state after swap
                yield {
                    array: [...array],
                    currentIndex: j,
                    comparingIndex: j + 1,
                    isComplete: false,
                    progress,
                    stepMessage: `Swapping ${a} and ${b} (${a} < ${b})`,
                    sortedFromIndex,
                };
            }
        }
        // After each outer loop iteration, one more item is in its final position
        sortedItems++;
    }

    // Yield final state
    yield {
        array: [...array],
        currentIndex: -1,
        comparingIndex: null,
        isComplete: true,
        progress: 100,
        stepMessage: "Done",
        sortedFromIndex: 0, // Everything is sorted
    };
}

function* quickSortGenerator(arr: number[]): Generator<SortState, void, unknown> {
    const array = [...arr];
    const totalItems = array.length;
    const sortedPositions = new Set<number>();

    function* partition(low: number, high: number): Generator<SortState, number, unknown> {
        // Lomuto partition (matches sorting.py): pivot = arr[high], i = low - 1
        const pivot = array[high];
        const pivotIdx = high;
        let i = low - 1;

        for (let j = low; j < high; j++) {
            const progress = totalItems > 0 ? Math.round((sortedPositions.size / totalItems) * 100) : 0;

            // Yield before comparison: show range [low..high], pivot at high, i, current j
            const currentVal = array[j];
            yield {
                array: [...array],
                currentIndex: j,
                comparingIndex: null,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                pivotIndex: pivotIdx,
                partitionI: i >= low ? i : undefined,
                stepMessage: `Compare current to pivot (${currentVal} <= ${pivot}) (${currentVal <= pivot})`,
            };

            if (array[j] <= pivot) {
                i += 1;

                // Yield "i incremented" step (separate step before swap)
                yield {
                    array: [...array],
                    currentIndex: j,
                    comparingIndex: null,
                    isComplete: false,
                    progress,
                    partitionLow: low,
                    partitionHigh: high,
                    pivotIndex: pivotIdx,
                    partitionI: i,
                    stepMessage: "Incrementing boundary",
                };

                [array[i], array[j]] = [array[j], array[i]];

                // Yield after swap
                yield {
                    array: [...array],
                    currentIndex: j,
                    comparingIndex: i,
                    isComplete: false,
                    progress,
                    partitionLow: low,
                    partitionHigh: high,
                    pivotIndex: pivotIdx,
                    partitionI: i,
                    stepMessage: "Swap current with boundary",
                };
            }
        }

        // Place pivot in final position: swap arr[i+1] and arr[high]
        [array[i + 1], array[high]] = [array[high], array[i + 1]];

        const progress = totalItems > 0 ? Math.round((sortedPositions.size / totalItems) * 100) : 0;
        yield {
            array: [...array],
            currentIndex: -1,
            comparingIndex: null,
            isComplete: false,
            progress,
            partitionLow: low,
            partitionHigh: high,
            pivotIndex: pivotIdx,
            partitionI: i + 1,
            stepMessage: "Placing pivot at final position",
        };

        sortedPositions.add(i + 1);
        return i + 1;
    }

    function* quickSort(low: number, high: number): Generator<SortState, void, unknown> {
        if (low < high) {
            // Yield at start to indicate we're sorting this range
            const progress = totalItems > 0 ? Math.round((sortedPositions.size / totalItems) * 100) : 0;
            yield {
                array: [...array],
                currentIndex: -1,
                comparingIndex: null,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                pivotIndex: undefined,
                partitionI: undefined,
                stepMessage: `Sorting index ${low} - index ${high}`,
            };

            const pivotIndexGen = partition(low, high);
            let p: number | undefined;

            while (true) {
                const result = pivotIndexGen.next();
                if (result.done) {
                    p = result.value;
                    break;
                }
                yield result.value;
            }

            if (p !== undefined) {
                yield* quickSort(low, p - 1);
                yield* quickSort(p + 1, high);
            }
        } else if (low === high) {
            sortedPositions.add(low);
            const progress = totalItems > 0 ? Math.round((sortedPositions.size / totalItems) * 100) : 0;
            yield {
                array: [...array],
                currentIndex: low,
                comparingIndex: null,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                pivotIndex: high,
                partitionI: undefined,
                stepMessage: "End of tree (sorted)",
            };
        }
    }

    yield* quickSort(0, array.length - 1);

    yield {
        array: [...array],
        currentIndex: -1,
        comparingIndex: null,
        isComplete: true,
        progress: 100,
        stepMessage: "Done",
    };
}

function* mergeSortGenerator(arr: number[]): Generator<SortState, void, unknown> {
    let progress = 0;
    const array = [...arr];
    const totalItems = array.length;
    let stepsDone = 0;
    const totalStepsEstimate = totalItems > 0 ? Math.ceil(totalItems * (Math.log2(totalItems) + 1)) : 1;

    function* merge(low: number, mid: number, high: number): Generator<SortState, void, unknown> {
        // Left and right are the two already-sorted subarrays
        const left = array.slice(low, mid + 1);
        const right = array.slice(mid + 1, high + 1);

        // Temp starts "empty" and is filled as we merge
        const temp: number[] = new Array(high - low + 1);

        let i = 0; // index into left
        let j = 0; // index into right
        let t = 0; // index into temp (and offset from low in array)

        // Yield info on the left and right arrays and highlight the active merge range [low..high]
        yield {
            array: [...array],
            currentIndex: -1,
            comparingIndex: null,
            isComplete: false,
            progress,
            partitionLow: low,
            partitionHigh: high,
            stepMessage: `Merging: [${left.join(", ")}] and [${right.join(", ")}]`,
        };

        while (i < left.length && j < right.length) {
            stepsDone++;

            progress = Math.max(0, Math.min(100, Math.round((stepsDone / totalStepsEstimate) * 100)));

            const leftIdx = low + i;
            const rightIdx = mid + 1 + j;
            const a = left[i];
            const b = right[j];

            // Visualize the comparison between the two pointers
            yield {
                array: [...array],
                currentIndex: leftIdx,
                comparingIndex: rightIdx,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                stepMessage: `Comparing ${a} and ${b}`,
            };

            let chosen: number;
            if (a <= b) {
                chosen = a;
                i++;
            } else {
                chosen = b;
                j++;
            }

            temp[t] = chosen;

            const mergedPrefix = temp.slice(0, t + 1);

            yield {
                array: [...array],
                currentIndex: low + t,
                comparingIndex: null,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                stepMessage: `Placed ${chosen} in merged result: [${mergedPrefix.join(", ")}]`,
            };

            t++;
        }

        // Flush remaining items from left side
        while (i < left.length) {
            stepsDone++;
            const progress = Math.min(100, Math.round((stepsDone / totalStepsEstimate) * 100));

            const chosen = left[i++];
            temp[t] = chosen;

            const mergedPrefix = temp.slice(0, t + 1);

            yield {
                array: [...array],
                currentIndex: low + t,
                comparingIndex: null,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                stepMessage: `Placed ${chosen} in merged result: [${mergedPrefix.join(", ")}]`,
            };

            t++;
        }

        // Flush remaining items from right side
        while (j < right.length) {
            stepsDone++;
            const progress = Math.min(100, Math.round((stepsDone / totalStepsEstimate) * 100));

            const chosen = right[j++];
            temp[t] = chosen;

            const mergedPrefix = temp.slice(0, t + 1);

            yield {
                array: [...array],
                currentIndex: low + t,
                comparingIndex: null,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                stepMessage: `Placed ${chosen} in merged result: [${mergedPrefix.join(", ")}]`,
            };

            t++;
        }

        // After the merge is conceptually complete, copy the merged temp array
        // back into the main array in one shot so the global state only updates
        // once per merge step.
        for (let idx = 0; idx < temp.length; idx++) {
            array[low + idx] = temp[idx];
        }

        // Optional: yield a final state showing the fully merged segment in place
        const finalMerged = temp.slice();
        stepsDone++;
        const finalProgress = Math.min(100, Math.round((stepsDone / totalStepsEstimate) * 100));

        yield {
            array: [...array],
            currentIndex: -1,
            comparingIndex: null,
            isComplete: false,
            progress: finalProgress,
            partitionLow: low,
            partitionHigh: high,
            stepMessage: `Merged segment [${low}..${high}] => [${finalMerged.join(", ")}]`,
        };
    }

    function* mergeSortRange(low: number, high: number): Generator<SortState, void, unknown> {
        if (low < high) {
            const mid = Math.floor((low + high) / 2);

            const progress = Math.min(100, Math.round((stepsDone / totalStepsEstimate) * 100));
            yield {
                array: [...array],
                currentIndex: -1,
                comparingIndex: null,
                isComplete: false,
                progress,
                partitionLow: low,
                partitionHigh: high,
                partitionI: mid,
                stepMessage: `Splitting [${low}..${high}] into left [${low}..${mid}] and right [${mid + 1}..${high}]`,
            };

            yield* mergeSortRange(low, mid);
            yield* mergeSortRange(mid + 1, high);
            yield* merge(low, mid, high);
        }
    }

    yield* mergeSortRange(0, array.length - 1);

    yield {
        array: [...array],
        currentIndex: -1,
        comparingIndex: null,
        isComplete: true,
        progress: 100,
        stepMessage: "Done",
    };
}

export {
    bubbleSortGenerator, mergeSortGenerator, quickSortGenerator
};

// Algorithm registry - add new algorithms here
export const sortingAlgorithms: Record<SortingAlgorithm, (arr: number[]) => Generator<SortState, void, unknown>> = {
    bubble: bubbleSortGenerator,
    quicksort: quickSortGenerator,
    mergesort: mergeSortGenerator,
};
