export type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type WeeklyTrendLayout = {
	component: Rect & { radius: number };
	staticShell: {
		labels: {
			frame: Rect;
			logo: Rect;
			machine: { x: number; y: number; width: number; fontSize: number };
			metric: { x: number; y: number; width: number; fontSize: number };
			weekLabel: { x: number; y: number; width: number; fontSize: number };
			weekNumber: { x: number; y: number; width: number; fontSize: number };
		};
		plotArea: Rect;
		xAxis: {
			frame: Rect;
			lineY: number;
			days: { key: string; label: string; x: number; y: number }[];
		};
		yAxis: Rect & { lineX: number; lineY: number; lineLength: number };
		gridLines: { y: number }[];
	};
	dynamicShell: {
		frame: Rect;
		yAxisValues: {
			frame: Rect;
			items: { value: number; x: number; y: number }[];
		};
		bars: {
			frame: Rect & { baselineY: number; maxBarHeight: number; radius: number };
			items: { key: string; x: number; width: number }[];
		};
		trendLine: {
			x: number;
			y: number;
			width: number;
		};
	};
};

export const weeklyTrendLayout: WeeklyTrendLayout = {
	component: {
		x: 0,
		y: 0,
		width: 710,
		height: 465,
		radius: 5
	},
	staticShell: {
		labels: {
			frame: {
				x: 30,
				y: 4,
				width: 414,
				height: 56
			},
			logo: {
				x: 0,
				y: 14,
				width: 141,
				height: 28
			},
			machine: {
				x: 279,
				y: 0,
				width: 135,
				fontSize: 24
			},
			metric: {
				x: 205,
				y: 28,
				width: 120,
				fontSize: 24
			},
			weekLabel: {
				x: 332,
				y: 28,
				width: 60,
				fontSize: 24
			},
			weekNumber: {
				x: 400,
				y: 28,
				width: 58,
				fontSize: 24
			}
		},
		plotArea: {
			x: 30,
			y: 62,
			width: 650,
			height: 370
		},
		xAxis: {
			frame: {
				x: 29,
				y: 432,
				width: 650,
				height: 19
			},
			lineY: 0,
			days: [
				{ key: 'monday', label: 'Monday', x: 18, y: 3 },
				{ key: 'tuesday', label: 'Tuesday', x: 110, y: 3 },
				{ key: 'wednesday', label: 'Wednesday', x: 197, y: 3 },
				{ key: 'thursday', label: 'Thursday', x: 303, y: 3 },
				{ key: 'friday', label: 'Friday', x: 405, y: 3 },
				{ key: 'saturday', label: 'Saturday', x: 494, y: 3 },
				{ key: 'sunday', label: 'Sunday', x: 591, y: 3 }
			]
		},
		yAxis: {
			x: 10,
			y: 54,
			width: 20,
			height: 378,
			lineX: 20,
			lineY: 0,
			lineLength: 378
		},
		gridLines: [
			{ y: 0 },
			{ y: 37 },
			{ y: 74 },
			{ y: 111 },
			{ y: 148 },
			{ y: 185 },
			{ y: 222 },
			{ y: 259 },
			{ y: 296 },
			{ y: 333 }
		]
	},
	dynamicShell: {
		frame: {
			x: 49,
			y: 135,
			width: 587,
			height: 295
		},
		yAxisValues: {
			frame: {
				x: -48,
				y: -79,
				width: 16,
				height: 349
			},
			items: [
				{ value: 10, x: 0, y: 0 },
				{ value: 9, x: 7, y: 37 },
				{ value: 8, x: 7, y: 74 },
				{ value: 7, x: 7, y: 111 },
				{ value: 6, x: 7, y: 148 },
				{ value: 5, x: 7, y: 185 },
				{ value: 4, x: 7, y: 222 },
				{ value: 3, x: 7, y: 259 },
				{ value: 2, x: 7, y: 296 },
				{ value: 1, x: 7, y: 333 }
			]
		},
		bars: {
			frame: {
				x: 0,
				y: 0,
				width: 599,
				height: 297,
				baselineY: 297,
				maxBarHeight: 295,
				radius: 5
			},
			items: [
				{ key: 'monday', x: -1, width: 30 },
				{ key: 'tuesday', x: 94, width: 30 },
				{ key: 'wednesday', x: 189, width: 30 },
				{ key: 'thursday', x: 284, width: 30 },
				{ key: 'friday', x: 379, width: 30 },
				{ key: 'saturday', x: 474, width: 30 },
				{ key: 'sunday', x: 569, width: 30 }
			]
		},
		trendLine: {
			x: 13,
			y: 62,
			width: 574
		}
	}
};
