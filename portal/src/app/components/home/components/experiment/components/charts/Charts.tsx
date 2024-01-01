/* eslint-disable no-null/no-null */
import { BarChart } from '../../../../../dashboard/components/charts/BarChart';
import { LineChart } from '../../../../../dashboard/components/charts/LineChart';
import { IExperimentData } from '../../Experiment';
import styles from './Charts.module.scss';
import { useChartsData } from './hooks/useChartsData';
import { tooltipKeys, tooltipLabels } from './models/bar-chart.const';
import { CHARTS_EN } from './translate/en';
import { getChartTitleByType } from './utils/chart.utils';

export const Charts: React.FC<IExperimentData> = (props: IExperimentData) => {
    const { barChartData, barChartLabels, barChartKeysOfData, lineChartData } = useChartsData(props);

    return (
        <div className={styles.charts_wrapper}>
          <div className={styles.title}>{CHARTS_EN.TITLE}</div>
          <>
            <div className={styles.row}>
                {barChartKeysOfData.map((key, index) => (
                    <div className={styles.chart_item}>
                        <BarChart key={index} title={getChartTitleByType(key)} labels={barChartLabels} data={barChartData} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} keyOfData={key} />
                    </div>
                ))}
            </div>
            <div className={styles.row}>
                {barChartKeysOfData.map((key, index) => {
                        const datasets = lineChartData.datasets
                        .filter(dataset => dataset.data[key])
                        .map(dataset => ({
                            ...dataset,
                            data: dataset.data[key]
                        }));

                        if (datasets.length === 0) return null;

                        const data = {
                        labels: lineChartData.labels,
                        datasets: datasets
                        };

                        return (
                            <div className={styles.chart_item}>
                                <LineChart key={index} data={data} title={getChartTitleByType(key)} tooltipLabel={getChartTitleByType(key)} />
                            </div>
                        );
                    })}
              </div>
          </>
        </div>
    );
}