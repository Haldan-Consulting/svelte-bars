export type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type MachineLayout = {
	component: Rect;
	staticShell: {
		chartShell: Rect & { radius: number; borderWidth: number };
		plotFrame: Rect & { radius: number; borderWidth: number };
		plotSurface: Rect & { radius: number; borderWidth: number };
		labels: {
			frame: Rect;
			machine: { x: number; y: number; width: number; fontSize: number };
			partNo: { x: number; y: number; fontSize: number };
		};
		gridFrame: Rect & { radius: number; borderWidth: number };
		grid: {
			frame: Rect;
			lineYs: number[];
			strokeWidth: number;
		};
		goodPartsFrame: Rect & { radius: number; borderWidth: number };
		scrapPartsFrame: Rect & { radius: number; borderWidth: number };
	};
	dynamicShell: {
		frame: Rect;
		borders: {
			frame: Rect;
			barBorder: Rect & { radius: number; borderWidth: number };
			valueBorder: Rect & { radius: number; borderWidth: number };
		};
		bars: {
			frame: Rect;
			slotHeight: number;
			radius: number;
			items: { key: string; x: number; y: number; width: number; height: number }[];
		};
		values: {
			frame: Rect;
			oeeValue: Rect;
			numberFontSize: number;
			percentFontSize: number;
			percentOffsetX: number;
			percentOffsetY: number;
			goodPartsCount: Rect & { fontSize: number };
			scrapPartsCount: Rect & { fontSize: number };
		};
	};
};

export const machineLayout: MachineLayout = {
	component: {
		x: 0,
		y: 0,
		width: 600,
		height: 380
	},
	staticShell: {
		chartShell: {
			x: 0,
			y: 0,
			width: 600,
			height: 380,
			radius: 14,
			borderWidth: 2
		},
		plotFrame: {
			x: 50,
			y: 50,
			width: 500,
			height: 280,
			radius: 14,
			borderWidth: 0
		},
		plotSurface: {
			x: 0,
			y: 0,
			width: 500,
			height: 280,
			radius: 14,
			borderWidth: 2
		},
		labels: {
			frame: {
				x: 227,
				y: 7,
				width: 145,
				height: 371
			},
			machine: {
				x: 0,
				y: 0,
				width: 600,
				fontSize: 36
			},
			partNo: {
				x: 8,
				y: 330,
				fontSize: 36
			}
		},
		gridFrame: {
			x: 80,
			y: 80,
			width: 290,
			height: 220,
			radius: 16,
			borderWidth: 6
		},
		grid: {
			frame: {
				x: 106,
				y: 104,
				width: 242.01,
				height: 172
			},
			lineYs: [0, 43, 86, 129, 172],
			strokeWidth: 1
		},
		goodPartsFrame: {
			x: 400,
			y: 160,
			width: 120,
			height: 60,
			radius: 12,
			borderWidth: 6
		},
		scrapPartsFrame: {
			x: 400,
			y: 240,
			width: 120,
			height: 60,
			radius: 12,
			borderWidth: 6
		}
	},
	dynamicShell: {
		frame: {
			x: 80,
			y: 7,
			width: 440,
			height: 371
		},
		borders: {
			frame: {
				x: 0,
				y: 73,
				width: 440,
				height: 220
			},
			barBorder: {
				x: 0,
				y: 0,
				width: 290,
				height: 220,
				radius: 16,
				borderWidth: 6
			},
			valueBorder: {
				x: 320,
				y: 0,
				width: 120,
				height: 60,
				radius: 12,
				borderWidth: 6
			}
		},
		bars: {
			frame: {
				x: 38,
				y: 97,
				width: 217,
				height: 172
			},
			slotHeight: 172,
			radius: 3.33,
			items: [
				{ key: 'availability', x: 0, y: 0.67, width: 36.94, height: 171.33 },
				{ key: 'performance', x: 60.02, y: 0, width: 36.94, height: 172 },
				{ key: 'quality', x: 120.04, y: 0, width: 36.94, height: 172 },
				{ key: 'oee', x: 180.06, y: 0, width: 36.94, height: 172 }
			]
		},
		values: {
			frame: {
				x: 350,
				y: 84,
				width: 60,
				height: 199
			},
			oeeValue: {
				x: 0,
				y: 0,
				width: 60,
				height: 39
			},
			numberFontSize: 34,
			percentFontSize: 24,
			percentOffsetX: 38,
			percentOffsetY: 9,
			goodPartsCount: {
				x: 0,
				y: 80,
				width: 60,
				height: 39,
				fontSize: 34
			},
			scrapPartsCount: {
				x: 0,
				y: 160,
				width: 60,
				height: 39,
				fontSize: 34
			}
		}
	}
};
