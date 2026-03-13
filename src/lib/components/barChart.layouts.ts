export type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type BarChartLayout = {
	component: Rect;
	staticShell: {
		chartShell: Rect & { radius: number; borderWidth: number };
		title: { x: number; y: number; fontSize: number };
		plotFrame: Rect & { radius: number; borderWidth: number };
		valueRowFrame: Rect & { radius: number; borderWidth: number };
		grid: {
			frame: Rect;
			labelPositions: { value: number; x: number; y: number }[];
			lineFrame: Rect;
			lineYs: number[];
		};
		labels: {
			frame: Rect;
			items: { key: string; label: string; x: number; y: number; width: number; height: number }[];
		};
	};
	dynamicShell: {
		frame: Rect;
		border: Rect & { radius: number; borderWidth: number };
		bars: {
			frame: Rect;
			slotHeight: number;
			radius: number;
			items: { key: string; x: number; y: number; width: number; height: number }[];
		};
		values: {
			frame: Rect;
			items: { key: string; x: number; y: number; width: number; height: number }[];
			numberFontSize: number;
			percentFontSize: number;
			percentOffsetX: number;
			percentOffsetY: number;
		};
	};
};

export const barChartLayout: BarChartLayout = {
	component: {
		x: 0,
		y: 0,
		width: 500,
		height: 500
	},
	staticShell: {
		chartShell: {
			x: 0,
			y: 0,
			width: 500,
			height: 500,
			radius: 14,
			borderWidth: 2
		},
		title: {
			x: 40,
			y: 20,
			fontSize: 36
		},
		plotFrame: {
			x: 40,
			y: 100,
			width: 420,
			height: 300,
			radius: 14,
			borderWidth: 2
		},
		valueRowFrame: {
			x: 98,
			y: 424,
			width: 351,
			height: 48,
			radius: 10,
			borderWidth: 4
		},
		grid: {
			frame: {
				x: 45,
				y: 105,
				width: 410,
				height: 290
			},
			labelPositions: [
				{ value: 0, x: 14.21, y: 275.07 },
				{ value: 25, x: 6.56, y: 206.84 },
				{ value: 50, x: 6.56, y: 137.54 },
				{ value: 75, x: 6.56, y: 68.24 },
				{ value: 100, x: 0, y: 0 }
			],
			lineFrame: {
				x: 42.64,
				y: 8.53,
				width: 367.36,
				height: 275.07
			},
			lineYs: [0, 68.77, 137.54, 206.31, 275.07]
		},
		labels: {
			frame: {
				x: 98,
				y: 400,
				width: 351,
				height: 24
			},
			items: [
				{ key: 'availability', label: 'Availability', x: 0, y: 0, width: 80, height: 24 },
				{ key: 'performance', label: 'Performance', x: 90, y: 0, width: 81, height: 24 },
				{ key: 'quality', label: 'Quality', x: 180, y: 0, width: 80, height: 24 },
				{ key: 'oee', label: 'OEE', x: 271, y: 0, width: 80, height: 24 }
			]
		}
	},
	dynamicShell: {
		frame: {
			x: 98,
			y: 150,
			width: 351,
			height: 322
		},
		border: {
			x: 0,
			y: 274,
			width: 351,
			height: 48,
			radius: 10,
			borderWidth: 4
		},
		bars: {
			frame: {
				x: 8,
				y: 0,
				width: 329,
				height: 239
			},
			slotHeight: 239,
			radius: 5,
			items: [
				{ key: 'availability', x: 0, y: 0.93, width: 56, height: 238.07 },
				{ key: 'performance', x: 91, y: 0, width: 56, height: 239 },
				{ key: 'quality', x: 182, y: 0, width: 56, height: 239 },
				{ key: 'oee', x: 273, y: 0, width: 56, height: 239 }
			]
		},
		values: {
			frame: {
				x: 10,
				y: 278,
				width: 333,
				height: 40
			},
			items: [
				{ key: 'availability', x: 0, y: 0, width: 60, height: 39 },
				{ key: 'performance', x: 91, y: 0, width: 60, height: 39 },
				{ key: 'quality', x: 182, y: 0, width: 60, height: 39 },
				{ key: 'oee', x: 273, y: 0, width: 60, height: 39 }
			],
			numberFontSize: 34,
			percentFontSize: 24,
			percentOffsetX: 38,
			percentOffsetY: 9
		}
	}
};
