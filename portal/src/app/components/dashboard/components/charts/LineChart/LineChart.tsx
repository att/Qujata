import { Line } from 'react-chartjs-2';
import { ChartOptions, TooltipItem } from 'chart.js';
import { defaultOptions } from './LineChart.const';
import styles from './LineChart.module.scss';

export interface LineChartProps {
    data: any;
    tooltipLabel?: string;
    title?: string;
}

export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
    const { data, title, tooltipLabel } = props;

    const options: ChartOptions<any> = {
        ...defaultOptions,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: '500',
          },
        },
        legend: {
          position: 'top',
          labels: {
              padding: 60,
              font: {
                size: 16,
              },
          },
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: function (context: TooltipItem<'line'>[]) {
              return generateTooltipTitle(context[0]);
            },
            label: function (context: TooltipItem<'line'>) {
              return renderTooltipLabel(context, tooltipLabel || '');
            },
          },
        },
      }
    };

    return  <Line data={data} options={options} style={{ height: '450px' }} className={styles.line_chart} />;
}

export function generateTooltipTitle(tooltipItem: TooltipItem<'line'>) {
  return tooltipItem?.dataset?.label;
}

export function renderTooltipLabel(context: TooltipItem<'line'>, tooltipLabel: string): string {  
  return `${tooltipLabel} ${context?.raw?.toString()}` || '';
}
