import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartRenderer = ({ chartData }) => {
  if (!chartData) {
    return null;
  }

  const { chartType, title, labels, series, data, config, xaxisLabel, yaxisLabel } = chartData;

  let chartDataArray = [];
  let useDataArray = false;
  
  if (data && Array.isArray(data) && data.length > 0) {
    chartDataArray = data.map(item => ({
      name: item.label,
      value: item.value
    }));
    useDataArray = true;
  } else if (labels && series && series.length > 0 && series[0].data) {
    chartDataArray = labels.map((label, index) => {
      const dataPoint = { name: label };
      series.forEach((serie, serieIndex) => {
        dataPoint[serie.name || `Series ${serieIndex + 1}`] = serie.data[index];
      });
      return dataPoint;
    });
    useDataArray = false;
  }

  if (chartDataArray.length === 0) {
    return null;
  }

  // Get colors for series
  const getSeriesColor = (serie, index) => {
    if (serie.color) return serie.color;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };

  // Render chart based on chartType
  const renderChart = () => {
    switch (chartType?.toLowerCase()) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartDataArray}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                label={{ value: xaxisLabel || 'Category', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: yaxisLabel || 'Value', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              {config?.showLegend !== false && <Legend />}
              {useDataArray ? (
                <Bar
                  dataKey="value"
                  fill={series && series[0] ? getSeriesColor(series[0], 0) : '#3b82f6'}
                  name={series && series[0] ? series[0].name : 'Value'}
                />
              ) : (
                series.map((serie, index) => (
                  <Bar
                    key={index}
                    dataKey={serie.name || `Series ${index + 1}`}
                    fill={getSeriesColor(serie, index)}
                  />
                ))
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartDataArray}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                label={{ value: xaxisLabel || 'Category', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: yaxisLabel || 'Value', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              {config?.showLegend !== false && <Legend />}
              {useDataArray ? (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={series && series[0] ? getSeriesColor(series[0], 0) : '#3b82f6'}
                  strokeWidth={2}
                  name={series && series[0] ? series[0].name : 'Value'}
                />
              ) : (
                series.map((serie, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={serie.name || `Series ${index + 1}`}
                    stroke={getSeriesColor(serie, index)}
                    strokeWidth={2}
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = chartDataArray.map(item => ({
          name: item.name,
          value: item.value
        }));
        const COLORS = series.map((serie, index) => getSeriesColor(serie, index));
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              {config?.showLegend !== false && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartDataArray}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                label={{ value: xaxisLabel || 'Category', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: yaxisLabel || 'Value', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              {config?.showLegend !== false && <Legend />}
              {useDataArray ? (
                <Bar
                  dataKey="value"
                  fill={series && series[0] ? getSeriesColor(series[0], 0) : '#3b82f6'}
                  name={series && series[0] ? series[0].name : 'Value'}
                />
              ) : (
                series.map((serie, index) => (
                  <Bar
                    key={index}
                    dataKey={serie.name || `Series ${index + 1}`}
                    fill={getSeriesColor(serie, index)}
                  />
                ))
              )}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="chart-renderer-container">
      {title && (
        <h4 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '16px', 
          fontWeight: 600,
          color: '#333',
          textAlign: 'center'
        }}>
          {title}
        </h4>
      )}
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;

