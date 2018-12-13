import React, { Component } from 'react';
import Ydnlu from '../../../utils/ydnlu';
import { getTreemapData, getContrastCalciteColorByIndex } from '../../../utils/chart';

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
                <button onClick={(event) => callbacks.onClick(item, event)}
                  className="btn btn-small"
                  style={{backgroundColor: getContrastCalciteColorByIndex(idx), border: '2px solid #595959'}}>
                  {item.name} ({item.totalSizeDisplay})
                </button>
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
