import React, { Component } from 'react';
import Ydnlu from '../../../utils/ydnlu';
import { getTreemapData, getContrastCalciteColorByIndex } from '../../../utils/chart';
import Button from 'calcite-react/Button';

class ItemsLegend extends Component {
  state = {
    highlightedItem: {}
  };

  render() {
    const { data, /*config,*/ callbacks } = this.props;
    const chartData = getTreemapData(data);

    if (!Ydnlu.isEmpty(data)) {
      return (
        <ul className="list-plain"
          style={{
            height: '200px',
            overflow: 'scroll',
            overflowX: 'hidden'
          }}>
          {chartData.children[0].children.map((item, idx) => {
            return <li key={item.name}>
                <Button aria-label={item.name} onClick={(event) => callbacks.onClick(item, event)}
                  onBlur={(event) => callbacks.onBlur(item, event)}
                  small
                  style={{backgroundColor: getContrastCalciteColorByIndex(idx), border: '1px solid #fff'}}>
                  {item.name} ({item.totalSizeDisplay})
                </Button>
              </li>
          }
        )}
        </ul>
      )
    } else {
      return (<div></div>);
    }

  }

};

export default ItemsLegend;
