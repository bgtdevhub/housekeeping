import Ydnlu from './ydnlu';
import { types } from '../constants/items';
import typeColors from '../constants/typeColors';

const getTotalSize = (data) => {
  if (!Ydnlu.isEmpty(data)) {
    let sizes = data.map(item => item.value);
    return sizes.reduce((acc, curr) => acc+curr)
  }
};

//todo: https://github.com/davidmerfield/randomColor
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getTreemapData(data) {
  let _types = Ydnlu.pickByProp(data.items, 'type');

  let items = {};
  let treemapData = [];

  _types.forEach(type => {
    // const color = typeColors[type];
    items[type] = {
      name: type,
      children: [],
      color: '#595959',
      childColor: typeColors[type] || '#595959'
    };
  });

  data.items.forEach(item => {
    if (items[item.type]) {
      if (item.size > 0) {
        items[item.type].children.push({
          name: item.id,
          title: item.title,
          color: items[item.type].childColor,
          value: Math.round((item.size/1e+6)),
          loc: Math.round((item.size/1e+6)),
          esriId: item.id, //can't use id as nivo-chart override it
          thumbnail: item.thumbnail,
          snippet: item.snippet,
          url: item.url,
          type: item.type
        });
      }
    }
  });

  Object.keys(items).forEach(key => {
    const totalSize = getTotalSize(items[key].children);
    if (totalSize > 0) {
      treemapData.push({
        name: key,
        color: items[key].color,
        typeColor: items[key].childColor,
        children: items[key].children,
        totalSize: totalSize
      })
    }
  });

  return  {
    name: `${data.username} chart`,
    color: '#a9a9a9',
    children: [
      {
        name: `${data.username} data`,
        children: treemapData,
        color: '#959595'
      }
    ]
  };

}


export function getDonutChartData(configs) {
  let chartData = {
    labels: configs.labels || [],
    datasets: [{
      data: configs.data || [],
      backgroundColor: configs.backgroundColor || ['#9081bc', '#ccc'],
      hoverBackgroundColor: configs.hoverBackgroundColor || ['#7461a8', '#6e6e6e']
    }],
    text: configs.text || '',
    total: configs.total || 0
  };

  return chartData;
}

export function getDonutChartOptions(configs = {}) {
  let chartOptions = Object.assign({
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    }
  }, configs);

  return chartOptions;
}
