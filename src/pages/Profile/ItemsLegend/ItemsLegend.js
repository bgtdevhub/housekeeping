import React, { Component } from 'react';
import Ydnlu from '../../../utils/ydnlu';
import { getTreemapData } from '../../../utils/chart';

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
          {chartData.children[0].children.map(item => {
            return <li key={item.name}>
                <button onClick={(event) => callbacks.onClick(item, event)}
                  className="btn btn-small"
                  style={{backgroundColor: item.typeColor, border: '2px solid #595959'}}>
                  {item.name}
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
