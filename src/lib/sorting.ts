export interface SortState {
    array: number[];
    currentIndex: number;
    comparingIndex: number | null;
    isComplete: boolean;
    progress: number; // 0-100
}

export type SortingAlgorithm = "bubble";

function* bubbleSortGenerator(arr: number[]): Generator<SortState, void, unknown> {
    const array = [...arr]; // Create a copy to avoid mutating the original
    const totalItems = array.length;
    let sortedItems = 0; // Track number of items in their final sorted position

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            // Calculate progress based on sorted items
            const progress = totalItems > 0 ? Math.round((sortedItems / totalItems) * 100) : 0;
            
            // Yield state before comparison
            yield {
                array: [...array],
                currentIndex: j,
                comparingIndex: j + 1,
                isComplete: false,
                progress
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
                    progress
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
        progress: 100
    };
}

export {
    bubbleSortGenerator
};

// Algorithm registry - add new algorithms here
export const sortingAlgorithms: Record<SortingAlgorithm, (arr: number[]) => Generator<SortState, void, unknown>> = {
    bubble: bubbleSortGenerator,
};
