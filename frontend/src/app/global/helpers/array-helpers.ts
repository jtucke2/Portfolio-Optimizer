export default class ArrayHelpers {

    /**
     * @description Reduces an array to *roughly* n number of *roughly* evenly spaced elements
     */
    public static spaceOutArrayElements<T = any>(arr: T[], n: number): T[] {
        // If array is <= n, return array
        if (arr.length <= n) {
            return arr;
        }

        const retVal: T[] = [];
        const last = arr[arr.length - 1];

        // The distant between each element in the array
        const rawSpacer = arr.length / n;
        const spacer = rawSpacer % 1 >= 0.5 ? Math.ceil(rawSpacer) : Math.floor(rawSpacer);

        for (let i = 0; i < arr.length; i = i + spacer) {
            retVal.push(arr[i]);
        }

        // Always include last element of the original array
        if (retVal.length < n) {
            retVal.push(last);
        } else {
            retVal[retVal.length - 1] = last;
        }

        return retVal;
    }
}
