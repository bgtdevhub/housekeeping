import React from 'react';
// import styles from './Treemap.css';
import { ResponsiveTreeMapHtml } from '@nivo/treemap';
import argisApi from '../../../services/argis';

class DHTreemap extends React.Component {
  state = {
    chartData: {}
  };

  handleClick = (node) => {
    if (node.data.url) {
      window.open(node.data.url, '_blank');
    }
  };

  handleColorBy = (node) => {
    return node.color;
  };

  // handleBorderColor = (node) => {
  //   return 'red';
  // };

  handleHovering = (node) => {
    const data = node.data;

    if (data.thumbnail === undefined) { //depth 0,1,2
      return (<div>{data.name}</div>);
    }

    return (
      <div className="card card-wide" style={{boxShadow: 'none'}}>
        <figure className="card-wide-image-wrap">
          <img width="250px" src={argisApi.getItemThumbnail(data.esriId, data.thumbnail)} />
        </figure>
        <div className="card-content">
          <h4>{data.title}</h4>
          <p className="font-size--1 trailer-half">{data.snippet}</p>
          <p className="font-size--1 trailer-half">
            {data.type} {data.loc} {data.color}
          </p>
        </div>
      </div>
    );
  };

  handleLabelDisplay(node, event) {
    console.log('noe', node)
    // return `${Math.round((node.value/1e+6))} MB`;
    return `${node.value} MB`;
  }

  componentDidUpdate(prevProps) {
    console.log('prev', prevProps.data);
    console.log('curr', this.props.data);
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({chartData: data});
  }

  render() {
    const { chartData } = this.state;

    return (
      <div style={{width: '100%', height: '500px'}}>
        <ResponsiveTreeMapHtml
          root={chartData}
          tooltip={this.handleHovering}
          onClick={this.handleClick}
          enableLabel={true}
          identity="name"
          value="loc"
          innerPadding={3}
          outerPadding={3}
          margin={{
            "top": 10,
            "right": 10,
            "bottom": 10,
            "left": 10
          }}
          label={this.handleLabelDisplay}
          colorBy={this.handleColorBy}
          animate={true}
          motionStiffness={90}
          motionDamping={11}
        />
      </div>
    );
  }
}

export default DHTreemap;
