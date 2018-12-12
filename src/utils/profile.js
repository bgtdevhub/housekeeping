import Ydnlu from './ydnlu';

const reducer = (accumulatorNodeSize, currentNodeSize) => {
  return accumulatorNodeSize + currentNodeSize;
};

const filters = {
  size: (dataItems, selector) => {
    const funcs = {
      GB: convertToGb,
      MB: convertToMb
    };

    if (selector.value > 0) {
      return dataItems.filter(item => {
        return funcs[selector.format](item.size) > selector.value;
      });
    }

    return dataItems;
  },
  date: (dataItems, selector) => {
    if (selector.value > 0) {
      return dataItems.filter(item => {
        const funcs = {
          day: getDaysBetween
        };
        const modifiedDate = convertToDate(item.modified);
        const createdDate = convertToDate(item.created);
        return funcs[selector.format](createdDate, modifiedDate) > selector.value;
      });
    }

    return dataItems;
  },
  type: (dataItems, selector) => {
    if (selector.value !== 'all') {
      return dataItems.filter(item => {
        return item.type == selector.value
      });
    }

    return dataItems;
  },
  refresh: () => {
    return 'refresh';
  }
};

function getDaysBetween( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms/one_day);
}

function convertToMb(value) {
  return Math.round((value/1e+6));
}

function convertToGb(value) {
  return Math.round((value/1e+9));
}

function convertToDate(value) {
  if (typeof value !== 'number') return 'Invalid Date';
  return new Date(value);
}

export function getTypes(items) {
  //get only types (uniq)
  const types = [...new Set(items.map(item => {
    return item.type
  }))];

  //change back to object
  return types.map(type => {
    return { label: type, value: type };
  });
}

export function getNodesInfo(nodes) {
  if (nodes === undefined || nodes.length === 0) return {total:0,size:0,estimatedCredit:0};

  const reducer = (accumulatorNodeSize, currentNodeSize) => {
    return accumulatorNodeSize + currentNodeSize;
  };

  const size = (() => {
    if (nodes.length > 1) {
      const nodeSizes = nodes.map(node => node.size);
      return nodeSizes.reduce(reducer)
    }
    return nodes[0].size;
  })();

  const estimatedCredit = (() => {
    const hosted = 'Hosted Feature Service';
    let totalEstimatedCredit = 0;

    if (nodes.length > 1) {

      let hostedNodes = nodes.filter(node => node.type === hosted);
      let nonHostedNodes = nodes.filter(node => node.type !== hosted);
      let hostedNodesEstimatedCredit = 0;
      let nonHostedNodesEstimatedCredit = 0;

      if (hostedNodes.length > 1) {
        const hostedNodeSizes = hostedNodes.map(node => node.size).reduce(reducer);
        //byte to mb
        hostedNodesEstimatedCredit = ( (convertToMb(hostedNodeSizes) / 10 ) * 2.4 );
      }

      if (nonHostedNodes.length > 1) {
        const nonHostedNodeSizes = nonHostedNodes.map(node => node.size).reduce(reducer);
        //byte to gb
        nonHostedNodesEstimatedCredit = ( convertToGb(nonHostedNodeSizes) * 1.2 );
      }

      totalEstimatedCredit = (hostedNodesEstimatedCredit + nonHostedNodesEstimatedCredit);

    } else {

      if (nodes.length === 1) {
        let _node = nodes[0];
        if (nodes[0].type === hosted) {
          totalEstimatedCredit = ( ( convertToMb(_node.size) / 10 ) * 2.4 );
        } else {
          totalEstimatedCredit = ( convertToGb(_node.size) * 1.2 );
        }
      }

    }

    return totalEstimatedCredit;
  })();

  return {
    total: nodes.length,
    size: Math.round((size/1e+6)),
    estimatedCredit: Math.round(estimatedCredit)
  }
}

export function getFilterData(key, items) {
  const filters = {
    filterSize: () => {
      return {
        label: 'Items larger than:',
        type: 'size',
        items: [
          { label: 'Please select...', value: 0, format: 'MB', type: 'size' },
          { label: '1 MB', value: 1, format: 'MB', type: 'size' },
          { label: '10 MB', value: 10, format: 'MB', type: 'size' },
          { label: '100 MB', value: 100, format: 'MB', type: 'size' },
          { label: '1 GB', value: 1, format: 'GB', type: 'size' },
        ]
      }
    },
    filterDate: () => {
      return {
        label: 'Last Modified:',
        type: 'date',
        items: [
          { label: 'Please select...', value: 0, format: 'day', type: 'date' },
          { label: 'Over 60 days', value: 60, format: 'day', type: 'date' },
          { label: 'Over 1 day', value: 1, format: 'day', type: 'date' },
        ]
      }
    },
    filterType: () => {
      items.unshift({ label: 'Please select...', value: 'all' });
      return {
        label: 'Following Item Types:',
        type: 'type',
        items: (() => {
          return items ? items : [];
        })()
      }
  }
  };

  return filters[key]();
}

export function filterItems(config) {
  const {
    items,
    unchangedContentItems,
    filterBySize, filterByDate, filterByType,
    selectedSize, selectedDate, selectedType
  } = config;
  let dataItems = [...unchangedContentItems];


  if (filterBySize) {
    dataItems = filters['size'](dataItems, selectedSize);
  }

  if (filterByDate) {
    dataItems = filters['date'](dataItems, selectedDate);
  }

  if (filterByType) {
    dataItems = filters['type'](dataItems, selectedType);
  }

  return dataItems;

}
