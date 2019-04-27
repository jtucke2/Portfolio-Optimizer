import { amber, blue, blueGrey, brown, cyan, deepOrange, green, grey, orange, pink, purple, red } from 'material-colors';

const theme = {
    PRIMARY: cyan['700'],
    // tslint:disable-next-line: no-string-literal
    ACCENT: pink['a200'],
    WARN: deepOrange['500'],
    SUCCESS: green['500']
};

export const globalVars = {
    BENCHMARK_INDEXES: [
        {
            name: 'S&P 500',
            value: '^GSPC'
        },
        {
            name: 'Dow Jones Industrial Average',
            value: '^DJI'
        },
        {
            name: 'NASDAQ Composite',
            value: '^IXIC'
        }
    ],
    GET_BENCHMARK_NAME(symbol: string) {
        const benchmark = this.BENCHMARK_INDEXES.find((idx) => idx.value.toUpperCase() === symbol.toUpperCase());
        if (benchmark) {
            return benchmark.name;
        } else {
            return symbol;
        }
    },
    FONT_FAMILY: '\'Rubik\', monospace',
    NUMBER_OF_PRICES_TO_GRAPH: 100,
    THEME: theme,
    SNACKBAR_DURATION: 3000,
    COLOR_SCALES: {
        CATEGORICAL: [
            theme.PRIMARY,
            theme.WARN,
            theme.SUCCESS,
            red['500'],
            purple['500'],
            brown['500'],
            theme.ACCENT,
            blueGrey['500'],
            amber['500'],
            blue['300']
        ],
        COMPARISON: [
            theme.ACCENT,
            blueGrey['400'],
            grey['400'],
            amber['900']
        ]
    }
};
