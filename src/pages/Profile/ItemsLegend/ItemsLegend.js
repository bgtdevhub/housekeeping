import React, { Component } from 'react';
import Ydnlu from '../../../utils/ydnlu';
import './ItemsLegend.css';
import {
  getTreemapData,
  getContrastCalciteColorByIndex
} from '../../../utils/chart';
import Button from 'calcite-react/Button';

class ItemsLegend extends Component {
  state = {
    highlightedItem: {}
  };

  render() {
    const { data, /*config,*/ activeFilter, callbacks } = this.props;
    const chartData = getTreemapData(data);

    if (!Ydnlu.isEmpty(data)) {
      return (
        <ul className='chart-filter-list'>
          {chartData.children[0].children.map((item, idx) => {
            return (
              <li
                key={item.name}
                className={`chart-filter-item${
                  activeFilter.includes(item.name)
                    ? ''
                    : ' chart-filter-item--inactive'
                }`}
              >
                <Button
                  className='chart-filter-btn'
                  aria-label={item.name}
                  onClick={event => callbacks.onClick(item, event)}
                  onBlur={event => callbacks.onBlur(item, event)}
                >
                  <span
                    className='chart-filter-size'
                    style={{
                      backgroundColor: getContrastCalciteColorByIndex(idx)
                    }}
                  >
                    {item.totalSizeDisplay.replace(/\s(MB)/g, '')}
                  </span>
                  <span className='chart-filter-name'>{item.name}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <div />;
    }
  }
}

export default ItemsLegend;
