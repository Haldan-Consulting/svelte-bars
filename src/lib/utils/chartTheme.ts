export const chartThresholdTokens = {
	good: 'var(--chart-threshold-good)',
	warn: 'var(--chart-threshold-warn)',
	bad: 'var(--chart-threshold-bad)'
} as const;

export function getThresholdColor(value: number) {
	if (value > 75) return chartThresholdTokens.good;
	if (value < 70) return chartThresholdTokens.bad;
	return chartThresholdTokens.warn;
}
