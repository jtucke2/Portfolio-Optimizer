import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more.src';
import stock from 'highcharts/modules/stock.src';
import indicators from 'highcharts/indicators/indicators.src';
import bb from 'highcharts/indicators/bollinger-bands.src';
import { StockChart } from 'angular-highcharts';
import theme from 'highcharts/themes/dark-unica.src';
import { grey } from 'material-colors';

import { globalVars } from '../global-vars';
import { PortfolioReturns } from 'src/app/models/portfolio';
import { Price } from 'src/app/models/price';

function highChartsCustomTheming(highchartsParam) {
    const extendedTheme: Highcharts.Options = {
        ...highchartsParam.theme,
        chart: {
            ...highchartsParam.theme.chart,
            backgroundColor: 'rgba(0,0,0,0)',
            style: {
                fontFamily: globalVars.FONT_FAMILY
            }
        },
        colors: globalVars.COLOR_SCALES.CATEGORICAL,
        navigator: {
            series: {
                lineColor: grey['600']
            }
        },
        rangeSelector: {
            selected: 5
        },
    };
    highchartsParam.setOptions(extendedTheme);
    return highchartsParam;
}

export default class ChartHelpers {

    /**
     * @description Tooltip for percentage based values
     */
    public static percentTooltip: Highcharts.TooltipOptions = {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.change}%</b><br>',
        valueDecimals: 2,
        split: true
    };

    /**
     * @description This is to be imported into a shared module's providers section
     */
    public static highchartsProviders = [stock, more, theme, indicators, bb, highChartsCustomTheming];

    /**
     * @description This assumes YYYY-MM-DD date strings
     */
    public static stringToUnix(dateString: string): number {
        const date = new Date(dateString);
        return date.getTime();
    }

    /**
     * @description Converts PortfolioReturns to Highcharts series
     */
    public static portfolioReturnsToSeries(
        name: string, priceDates: string[], portfolioReturns: PortfolioReturns
    ): Highcharts.SeriesOptionsType {
        return {
            tooltip: {
                valueDecimals: 2
            },
            type: null,
            name,
            id: name,
            data: portfolioReturns.portfolio_values.map((ret, i) => [ChartHelpers.stringToUnix(priceDates[i]), ret]).reverse()
        };
    }

    /**
     * @description Converts price array to Highcharts Stockchart.  This is meant to be a minimal chart
     */
    public static pricesToStockChart(prices: Price[], name: string, height: string = '250px'): StockChart {
        const priceValues = prices.map(p => parseFloat(parseFloat(p.close as any).toFixed(2)));
        const priceDates = prices.map(p => p.date);
        const seriesData = priceValues
            .map((ret, i) => [ChartHelpers.stringToUnix(priceDates[i]), ret])
            .reverse();

        return new StockChart({
            chart: {
                height
            },
            tooltip: {
                pointFormat: '${point.y}<br>',
                valueDecimals: 2,
                split: true
            },
            colors: [globalVars.THEME.ACCENT],
            navigator: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            series: [
                {
                    type: 'line',
                    data: seriesData,
                    name
                }
            ],
            scrollbar: {
                enabled: false
            }
        });
    }
}
