import React from 'react';
import './Treemap.css';
import { ResponsiveTreeMapHtml } from '@nivo/treemap';
import argisApi from '../../../services/argis';
import { convertToGb } from '../../../utils/profile';
import PopupDetail from './PopupDetail/PopupDetail';
import { showChartItemDetail, closeChartItemDetail } from '../../../actions/chart';
import { connect } from 'react-redux';

class DHTreemap extends React.Component {
  state = {
    chartData: {},
    colors: {},
    anchorEl: null,
    hoverDataCell: {},
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
    this.props.closeChartItemDetail();
  };

  handleClick = (node, event) => {
    this.setState({ anchorEl: event.currentTarget, hoverDataCell: node.data });
    this.props.showChartItemDetail();

  };

  handleColorBy = node => {
    if (this.state.colors[node.type]) {
      return this.state.colors[node.type];
    }
    return '#fff'; //fallback option to remove warning node.color required
  };

  // handleBorderColor = (node) => {
  //   return 'red';
  // };

  handleHovering = node => {
    const data = node.data;

    if (data.thumbnail === undefined) {
      //depth 0,1,2
      return <div>{data.name}</div>;
    }

    return (
      <div className='treemap-card card'>
        <figure className='treemap-image-container'>
          <img src={argisApi.getItemThumbnail(data.esriId, data.thumbnail)} />
        </figure>
        <div className='card-content'>
          <h4>{data.title}</h4>
          <p className='treemap-card-size'>{Math.round(data.size / 1e6)} MB</p>
        </div>
      </div>
    );
  };

  handleLabelDisplay(node, event) {
    if (!node) return;
    const { config } = this.props;

    if (config.nodes.length > 0) {
      const deletedNode = config.nodes.find(n => n.id == node.esriId);
      if (deletedNode && deletedNode.id && deletedNode.id === node.esriId) {
        if (node.value > 500) {
          return <strike>{convertToGb(node.size)} GB</strike>;
        } else {
          return <strike>{node.value} MB</strike>;
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
    const colors = data && data.colors;
    this.setState({ chartData: data, colors });
  }

  render() {
    const { chartData, anchorEl, hoverDataCell } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div
        className='treemap'
        style={{ width: '100%', height: window.innerHeight - 150 }}
      >
        <PopupDetail
          data={hoverDataCell}
          config={{ anchorEl: anchorEl, open: open }}
          callbacks={{ close: this.handlePopoverClose.bind(this) }}
        />
        {/*<ResponsiveTreeMapHtml
          root={chartData}
          tooltip={this.handleHovering}
          onClick={this.handleClick}
          enableLabel={true}
          identity='name'
          value='loc'
          innerPadding={1}
          outerPadding={1}
          margin={{
            top: 0,
            right: 10,
            bottom: 0,
            left: 10
          }}
          label={this.handleLabelDisplay.bind(this)}
          colorBy={this.handleColorBy}
          animate={true}
          motionStiffness={90}
          motionDamping={11}
          labelSkipSize={32}
          labelTextColor={this.handleLabelTextColor}
        />*/}

        <ResponsiveTreeMapHtml
          root={chartData}
          onClick={this.handleClick}
          enableLabel={true}
          identity='name'
          value='loc'
          innerPadding={1}
          outerPadding={1}
          margin={{
            top: 0,
            right: 10,
            bottom: 0,
            left: 10
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

const stateToProps = state => {
  return {
  };
};

const actions = {
  showChartItemDetail,
  closeChartItemDetail
};

export default connect(
  stateToProps,
  actions
)(DHTreemap);
