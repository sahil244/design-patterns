// Chart factory
function ChartFactory(type, data, options) {
  class BarChart { /* … */ }
  class LineChart { /* … */ }
  class PieChart { /* … */ }
  switch(type) {
    case 'bar':   return new BarChart(data, options);
    case 'line':  return new LineChart(data, options);
    case 'pie':   return new PieChart(data, options);
    default:      throw new Error('Unsupported chart type');
  }
}
// Usage
const chart = ChartFactory('line', dataset, { color: 'blue' });
chart.render('#chartContainer');
