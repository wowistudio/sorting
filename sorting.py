def partition(arr, low, high):
    print('============== PARTITIONING ==============')
    print(f"{arr[low:high+1]}", "low:",low, "high:", high)
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        print(f"i={i}, j={j}, {arr[j]}{' ' if arr[j] <= 9 else ''} <= {pivot}")
        if arr[j] <= pivot:
            i += 1
            print(f"Swapping: {arr[i]} and {arr[j]}")
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)

arr = [8, 2, 4, 7, 1, 3, 9, 6, 5]
quick_sort(arr, 0, len(arr) - 1)
print(arr)