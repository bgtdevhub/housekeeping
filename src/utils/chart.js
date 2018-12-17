import Ydnlu from './ydnlu';
import { types } from '../constants/items';
import typeColors from '../constants/typeColors';
import { convertToGb, convertMbToB, convertToMb } from '../utils/profile';

const getTotalSize = data => {
  if (!Ydnlu.isEmpty(data)) {
    let sizes = data.map(item => item.value);
    return sizes.reduce((acc, curr) => acc + curr);
  }
};

const getTotalSizeDisplay = data => {
  if (!Ydnlu.isEmpty(data)) {
    let sizes = data.map(item => item.value);
    const totalSize = sizes.reduce((acc, curr) => acc + curr);
    if (totalSize > 500) {
      return `${(convertToGb(convertMbToB(totalSize), false)).toFixed(1)} GB`;
    }

    return `${totalSize} MB`;
  }
};

//todo: unused this
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getContrastCalciteColorByIndex(index) {
  const colors = {
    '0': '#de2900',
    '1': '#338033',
    '2': '#e4d154',
    '3': '#0079c1',
    '4': '#e8912e'
  };

  if (!colors[index]) {
    return '#595959';
  }

  return colors[`${index}`];
}

export function getTreemapData(data) {
  let _types = Ydnlu.pickByProp(data.items, 'type');

  let items = {};
  let treemapData = [];
  let colorsMapWithParentNode = {};

  _types.forEach(type => {
    // const color = typeColors[type];
    items[type] = {
      name: type,
      children: [],
      color: '#595959'
    };
  });

  data.items.forEach(item => {
    if (items[item.type]) {
      if (item.size > 0) {
        items[item.type].children.push({
          name: item.id,
          title: item.title,
          color: 'white',
          size: item.size,
          value: Math.round(convertToMb(item.size)),
          loc: Math.round(convertToMb(item.size)),
          esriId: item.id, //can't use id as nivo-chart override it
          thumbnail: item.thumbnail,
          snippet: item.snippet,
          url: item.url,
          type: item.type
        });
      }
    }
  });

  Object.keys(items).forEach((key, idx) => {
    const totalSize = getTotalSize(items[key].children);
    const totalSizeDisplay = getTotalSizeDisplay(items[key].children);
    if (totalSize > 0) {
      treemapData.push({
        name: key,
        color: '#fff',
        children: items[key].children,
        totalSize,
        totalSizeDisplay
      });
    }
  });

  treemapData = treemapData.sort((a, b) => b.totalSize - a.totalSize);

  if (treemapData.length > 5) {
    let newChildrenArray = [];
    const otherCategoryArray = treemapData.slice(5);
    otherCategoryArray.forEach(item => {
      newChildrenArray.push(item.children);
    })

    newChildrenArray = newChildrenArray.flat();

    newChildrenArray.forEach(child => {
      child.type = "Other";
    })

    const otherCategory = {
      name: "Other",
      color: "#fff",
      children: newChildrenArray,
      totalSize: getTotalSize(newChildrenArray),
      totalSizeDisplay: getTotalSizeDisplay(newChildrenArray)
    }

    treemapData = treemapData.slice(0, 5);
    treemapData.push(otherCategory);
  }

  treemapData.forEach((data, idx) => {
    data.color = getContrastCalciteColorByIndex(idx);
    colorsMapWithParentNode[data.name] = data.color;
  });

  return {
    name: `${data.username} chart`,
    colors: colorsMapWithParentNode,
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
    labels: configs.labels || ['#333', '#e2e2e2'],
    datasets: [
      {
        data: configs.data || [],
        backgroundColor: configs.backgroundColor || ['#0079c1', '#d2d2d2'],
        hoverBackgroundColor: configs.hoverBackgroundColor || [
          '#005e95',
          '#6e6e6e'
        ]
      }
    ],
    text: configs.text || '',
    total: configs.total || 0
  };

  return chartData;
}

export function getDonutChartOptions(configs = {}) {
  let chartOptions = Object.assign(
    {
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      cutoutPercentage: 85
    },
    configs
  );

  return chartOptions;
}
