
export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}

export function resample(t: number, min: number, max: number) {
    let num1 = 6;
    let num2 = 0.002472623;
    return ((-Math.log((1.0 / (t * (1.0 -  num2 * 2.0) + num2) - 1.0)) + num1) / (num1 * 2.0) * (max - min)) + min;
}
