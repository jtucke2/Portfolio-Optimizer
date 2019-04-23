import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more.src';
import stock from 'highcharts/modules/stock.src';
import indicators from 'highcharts/indicators/indicators.src';
import bb from 'highcharts/indicators/bollinger-bands.src';
import theme from 'highcharts/themes/dark-unica.src';
import { grey } from 'material-colors';

import { globalVars } from '../global-vars';
import { PortfolioReturns } from 'src/app/models/portfolio';

function highChartsCustom(highchartsParam) {
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
    public static highchartsProviders = [stock, more, theme, indicators, bb, highChartsCustom];

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
}
