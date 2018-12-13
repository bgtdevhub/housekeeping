import React from 'react';
// import styles from './Treemap.css';
import { ResponsiveTreeMapHtml } from '@nivo/treemap';
import argisApi from '../../../services/argis';
import { convertToGb } from '../../../utils/profile';

class DHTreemap extends React.Component {
  state = {
    chartData: {},
    colors: {}
  };

  handleClick = (node) => {
    if (node.data.url) {
      window.open(node.data.url, '_blank');
    }
  };

  handleColorBy = (node) => {
    return this.state.colors[node.type];
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
    const { config } = this.props;

    if (config.nodes.length > 0) {
      const deletedNode = config.nodes.find(n => n.id == node.esriId);
      if (deletedNode && deletedNode.id && deletedNode.id === node.esriId) {
        if (node.value > 500) {
          return (<strike>{convertToGb(node.size)} GB</strike>);
        } else {
          return (<strike>{node.value} MB</strike>);
        }
      }
    }

    if (node.value > 500) {
      return `${convertToGb(node.size)} GB`; //use size instead of value/loc as size is in bytes
    }

    return `${node.value} MB`;
  }

  handleLabelTextColor() {
    return '#fff';
  }

  componentDidUpdate(prevProps) {
    // console.log('prev', prevProps.data);
    // console.log('curr', this.props.data);
  }

  componentDidMount() {
    const { data, config } = this.props;
    console.log('config', config);
    this.setState({chartData: data, colors: data.colors});
  }

  render() {
    const { chartData } = this.state;

    return (
      <div style={{width: '100%', height: (window.innerHeight - 150)}}>
        <ResponsiveTreeMapHtml
          root={chartData}
          tooltip={this.handleHovering}
          onClick={this.handleClick}
          enableLabel={true}
          identity="name"
          value="loc"
          innerPadding={1}
          outerPadding={1}
          margin={{
            "top": 0,
            "right": 10,
            "bottom": 0,
            "left": 10
          }}
          label={this.handleLabelDisplay.bind(this)}
          colorBy={this.handleColorBy}
          animate={true}
          motionStiffness={90}
          motionDamping={11}
          labelSkipSize={32}
          labelTextColor={this.handleLabelTextColor}
        />
      </div>
    );
  }
}

export default DHTreemap;
