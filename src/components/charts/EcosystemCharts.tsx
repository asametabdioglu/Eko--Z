import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Measurement } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SingleMetricChartProps {
  measurements: Measurement[];
  metricKey: 'soilMoisture' | 'temperature' | 'airHumidity' | 'lightLevel';
  title: string;
  unit: string;
  lineColor: string;
  fillColor: string;
  height?: number;
  yMin?: number;
  yMax?: number;
}

export const SingleMetricChart: React.FC<SingleMetricChartProps> = ({
  measurements,
  metricKey,
  title,
  unit,
  lineColor,
  fillColor,
  yMin,
  yMax
}) => {
  // Sort measurements chronologically (oldest to newest)
  const sorted = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sorted.map(m => {
    const d = new Date(m.date);
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  const dataValues = sorted.map(m => m[metricKey]);

  const data = {
    labels,
    datasets: [
      {
        label: `${title} (${unit})`,
        data: dataValues,
        borderColor: lineColor,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: lineColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.parsed.y} ${unit}`,
          title: (items) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const item = sorted[idx];
            return `${item.region} - ${item.locationName}`;
          }
        },
        backgroundColor: '#14532D',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        displayColors: false,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          color: '#78716c'
        }
      },
      y: {
        min: yMin,
        max: yMax,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: { size: 10 },
          color: '#78716c',
          callback: (value) => `${value} ${unit}`
        }
      }
    }
  };

  if (measurements.length === 0) {
    return (
      <div className="h-52 flex flex-col items-center justify-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200 p-4">
        <p className="text-sm font-medium">Bu ölçüt için henüz veri kaydedilmedi.</p>
        <p className="text-xs text-stone-400 mt-1">Arduino UNO ile ölçüm yapıp ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <Line data={data} options={options} />
    </div>
  );
};
