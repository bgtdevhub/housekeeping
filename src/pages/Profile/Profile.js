import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import profileStyles from './Profile.css';
import * as calcite from 'calcite-web';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import { Chart, Doughnut } from 'react-chartjs-2';
import { getNodesInfo, getFilterData, getTypes } from '../../utils/profile';
import Ydnlu from '../../utils/ydnlu';
import { getDonutChartData, getDonutChartOptions } from '../../utils/chart';
import { authSuccess } from '../../actions/auth';
import {
  getUserInfo,
  toggleIconClick,
  addRemoveButtonToggle,
  permanentRemoveItem,
  legendItemClick,
  filterItems,
  reviewRemoveSelection,
  filterBySize,
  filterByDate,
  filterByType,
  getUserInfoSuccess
} from '../../actions/profile';
import MainComponent from './MainComponent/MainComponent';
import DHLayout from '../../components/Layout/Layout';
import { FirstTryModal, SecondTryModal, NotificationModal } from './Modals/Modals';
import Loader from './Loader/Loader';
import ItemsLegend from './ItemsLegend/ItemsLegend';
import Filter from './Filter/Filter';
import Button from 'calcite-react/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  profileContainer: {
    marginTop: '24px'
  },
  toggleContainer: {
    marginTop: '24px'
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
  mainComponentContainer: {
    marginTop: '24px'
  }
});

class Profile extends Component {
  tableConfig = {
    rows: [
      { id: 'type', numeric: false, disablePadding: true, label: '' },
      { id: 'access', numeric: false, disablePadding: true, label: '' },
      { id: 'title', numeric: false, disablePadding: true, label: 'Item Title' },
      { id: 'modified', numeric: true, disablePadding: false, label: 'Last Accessed' },
      { id: 'size', numeric: true, disablePadding: false, label: 'File Size' },
      { id: 'numViews', numeric: true, disablePadding: false, label: 'Views' },
    ],
    order: 'desc',
    orderBy: 'size',
    selected: [],
    page: 0,
    rowsPerPage: 10,
  };

  state = {
    mainComponent: {
      component: 'table',
      data: [],
      callbacks: {},
      config: Ydnlu.clone(this.tableConfig),
      creditSetData: [0, 0],
      sizeSetData: [0, 0],
      itemsSetData: [0, 0],
    }
  }

  removeItem(node, triggerFor) {
    this.props.addRemoveButtonToggle(node, triggerFor);
    setTimeout(() => {
      this.setState({
        creditSetData: [0, 0],
        sizeSetData: [0, 0],
        itemsSetData: [0, 0]
      });

      // if (triggerFor === 'add') {
      //   this.displayReviewSelection();
      // }
    }, 0)
  };

  updateChartState(data) {
    if (data === undefined) data = this.state.chart;
    this.setState({
      mainComponent: {
        component: 'chart',
        data: data
      }
    });
  }

  updateTableState(data) {
    const { itemTypes } = this.state;
    this.setState({
      mainComponent: {
        component: 'table',
        data: data,
        config: Object.assign(Ydnlu.clone(this.tableConfig), {itemTypes:itemTypes}),
        callbacks: {
          removeItem: this.removeItem.bind(this)
        }
      }
    });
  }

  displayChart() {
    this.props.toggleIconClick('chart');
    setTimeout(() => {
      this.updateChartState();
    }, 0);
  }

  displayTable() {
    const { content } = this.state;
    this.props.toggleIconClick('table');
    this.updateTableState(content.items);
  }

  displayReviewSelection() {
    const { isReviewing } = this.state;

    if (isReviewing) {
      this.handleFirstTryDelete();
    } else {
      this.props.reviewRemoveSelection();
    }

  }

  handleFirstTryDelete = () => {
    calcite.bus.emit('modal:open', {id: 'firstDeleteConfirmation'});
  };

  handleCloseFirstTryModal = () => {
    calcite.bus.emit('modal:close', {id: 'firstDeleteConfirmation'});
  };

  handleSecondTryModal = () => {
    this.handleCloseFirstTryModal();
    calcite.bus.emit('modal:open', {id: 'secondDeleteConfirmation'});
  };

  handleCloseSecondTryModal = () => {
    calcite.bus.emit('modal:close', {id: 'secondDeleteConfirmation'});
  };

  handleCloseNotification = () => {
    this.props.getUserInfoSuccess(this.state.info);
    calcite.bus.emit('modal:close', {id: 'notification'});
    this.props.toggleIconClick('table');
    this.refreshMainComponent();
    this.updateTableState(this.state.content.items);
  };

  handlePermanentDelete = () => {
    const { nodes } = this.state;
    const hash = this.props.location.hash;
    this.handleCloseSecondTryModal();
    this.props.permanentRemoveItem(nodes, hash);
  };

  handleLegendItemClick(node){
    this.refreshMainComponent();
    this.props.legendItemClick(node);
    setTimeout(() => {
      this.updateChartState();
    }, 0)
  };

  handleFilter(key, selectedItem) {
    const { mode, content } = this.state;
    const actions = {
      size: 'filterBySize',
      date: 'filterByDate',
      type: 'filterByType',
    }
    this.props[actions[key]](selectedItem);
    if (mode === 'chart') {
      this.refreshMainComponent();
      setTimeout(() => {
        this.updateChartState();
      }, 0)
    } else { // for now its table
      this.updateTableState(content.items);
    }
  };

  refreshMainComponent = () => {
    this.setState({
      mainComponent: {
        component: 'noop',
        data: []
      }
    });
  };

  getMainComponentSpecs = (mainComponent) => {
    const { content, itemTypes, nodes, isReviewing } = this.state;
    if (mainComponent.component === 'table') {
      let items = [...content.items].map(item => {
        let newItem = {...item};
        newItem.icon = 'add_circle';
        if (nodes.length > 0) {
          if (nodes.find(node => node.id == newItem.id)) {
            newItem.icon = 'remove_circle';
          }
        }
        return newItem;
      });
      const data = (isReviewing) ? nodes : items;
      const config = Object.assign(mainComponent.config, {itemTypes:itemTypes});
      const callbacks = Object.assign(mainComponent.callbacks, {removeItem: this.removeItem.bind(this)});
      return { data, config, callbacks };
    } else {
      return Object.assign(mainComponent, { config: { nodes: nodes } });
    }
  };

  componentDidMount() {
    const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
    calcite.init();
    if (this.props.location.hash.indexOf("#access_token") !== -1) {
      const hash = this.props.location.hash;
      this.props.authSuccess(hash);
    }
    this.props.getUserInfo();
    Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
      draw: function() {
        originalDoughnutDraw.apply(this, arguments);
        const chart = this.chart;
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;
        const fontSize = (height / 200).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        const num = chart.config.data.total || 0;
        const numX = Math.round((width - ctx.measureText(num).width) / 2);
        const numY = height / 2.2;
        const text = chart.config.data.text || '';
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 1.7;
        ctx.fillText(num, numX, numY);
        ctx.fillText(text, textX, textY);
      }
    });
  }

  componentDidUpdate(prevProps, prevStates) {
    const { content, mode, itemDeleted } = this.state;
    if (content !== prevStates.content) {
      if (mode === 'table' ) {
        this.updateTableState(content.items);
      } else { // for now is chart
        this.refreshMainComponent();
        setTimeout(() => {
          this.updateChartState();
        }, 0)
      }
    }

    if (itemDeleted !== prevStates.itemDeleted && itemDeleted) {
      calcite.bus.emit('modal:open', {id: 'notification'});
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      content: props.content,
      info: props.info,
      thumbnail: props.thumbnail,
      mode: props.mode,
      chart: props.chart,
      itemTypes: props.itemTypes,
      nodes: props.nodes,
      isReviewing: props.isReviewing,
      itemDeleted: props.itemDeleted,
      itemsForTypes: props.itemsForTypes,
      unchangedContent: props.unchangedContent
    };
  }

  render() {
      const { content } = this.state;
      const { classes } = this.props;

      if (content === undefined) {
        return (
          <Loader />
        )
      } else {
        const { info, mode, thumbnail, mainComponent, unchangedContent, nodes, itemsForTypes, isReviewing } = this.state;
        const itemsInfo = getNodesInfo(content.items);
        const nodesInfo = getNodesInfo(nodes);
        const mainComponentSpecs = this.getMainComponentSpecs(mainComponent);
        const totalEstimatedCredit = (itemsInfo.estimatedCredit - nodesInfo.estimatedCredit);
        const totalEstimatedSize = (itemsInfo.size - nodesInfo.size);
        const totalEstimatedItems = (itemsInfo.total - nodesInfo.total);
        /*
        * if total of donut data equal to 0, just for nice displaying, we changed the total to 1
        * By doing this the chart still show the circle
        */
        const creditDonutData = getDonutChartData({data:[nodesInfo.estimatedCredit, (totalEstimatedCredit === 0) ? 1 : totalEstimatedCredit], total: nodesInfo.estimatedCredit, text: 'Credits'});
        const sizeDonutData = getDonutChartData({data:[nodesInfo.size, (totalEstimatedSize === 0) ? 1 : totalEstimatedSize], total: nodesInfo.size, text: 'MB'});
        const itemsDonutData = getDonutChartData({data:[nodesInfo.total, (totalEstimatedItems === 0) ? 1 : totalEstimatedItems], total: nodesInfo.total, text: 'Items'});
        console.log('creditDonutData',creditDonutData);
        console.log('sizeDonutData',sizeDonutData);
        return (
            <div className='profile'>
              <DHLayout className={classes.root}>
                <Container fluid style={{ lineHeight: '32px' }}>
                  <Row>
                    <Col xl={2}>
                      {/*start of card*/}
                      <div className="card card-shaped block trailer-1">
                         <figure className="card-image-wrap">
                           <img src={thumbnail} alt={info.fullName} className="card-image" style={{borderRadius: '50%'}} />
                         </figure>
                         <div className="card-content">
                           <p style={{textAlign: 'center'}}>
                             <b>{info.fullName}</b>
                           </p>
                           <p className="font-size--1 card-last" style={{textAlign: 'center'}}>
                             Estimated <b>{getNodesInfo(content.items).estimatedCredit}</b> credits/month
                           </p>
                           <nav className="leader-1">
                             <mark className="label label-blue" style={{marginRight: '5px'}}><b>{content.total} items</b></mark>
                             <mark className="label label-yellow"><b>{Math.round(info.storageUsage/1e+9)} GB</b></mark>
                          </nav>
                        </div>
                      </div>
                      {/*end of card*/}
                      {/*start of filter*/}
                      {!isReviewing ?
                        <Fragment>
                          <Filter data={getFilterData('filterSize')} callbacks={{onChange: this.handleFilter.bind(this)}}></Filter>
                          <Filter data={getFilterData('filterDate')} callbacks={{onChange: this.handleFilter.bind(this)}}></Filter>
                          <Filter
                            data={getFilterData('filterType', getTypes(itemsForTypes))}
                            callbacks={{onChange: this.handleFilter.bind(this)}}>
                          </Filter>
                        </Fragment> :
                      <Fragment />}
                      {/*end of filter*/}
                    </Col>
                    <Col xl={8}>
                      <MainComponent
                        className={classes.mainComponentContainer}
                        component={mainComponent.component}
                        data={mainComponentSpecs.data}
                        config={mainComponentSpecs.config}
                        callbacks={mainComponentSpecs.callbacks}>
                      </MainComponent>
                    </Col>
                    <Col xl={2}>
                      <nav className="leader-1">
                        <button aria-label="View your items in tabular" className={(mode === 'table') ? 'btn tooltip' : 'btn btn-clear tooltip'} style={{marginRight: '10px'}} onClick={this.displayTable.bind(this)}>
                          <Icon>view_list</Icon>
                        </button>
                        <button aria-label="View your items in treemap" className={(mode === 'chart') ? 'btn tooltip' : 'btn btn-clear tooltip'} style={{marginRight: '10px'}} onClick={this.displayChart.bind(this)}>
                          <Icon>view_quilt</Icon>
                        </button>
                      </nav>
                      {(mainComponent.component === 'chart') ?
                        <ItemsLegend
                          data={unchangedContent}
                          callbacks={{onClick: this.handleLegendItemClick.bind(this)}}>
                        </ItemsLegend> :
                      <Fragment />}
                      <br />
                      <Doughnut data={creditDonutData} width={90} height={40} options={getDonutChartOptions()} />
                      <Doughnut data={sizeDonutData} width={90} height={40} options={getDonutChartOptions()} />
                      <Doughnut data={itemsDonutData} width={90} height={40} options={getDonutChartOptions()} />
                      <br />
                      <Button clear={isReviewing} disabled={nodes.length < 1} onClick={this.displayReviewSelection.bind(this)}>
                        {isReviewing ? (nodes.length > 1 ? 'Delete All' : 'Delete') : 'Review'}
                      </Button>
                    </Col>
                  </Row>
                </Container>

              </DHLayout>
              {/*start of modal*/}
              <FirstTryModal
                data={nodesInfo}
                callbacks={ {close: this.handleCloseFirstTryModal, remove: this.handleSecondTryModal} }>
              </FirstTryModal>
              <SecondTryModal
                data={nodesInfo}
                callbacks={ {close: this.handleCloseSecondTryModal, remove: this.handlePermanentDelete} }>
              </SecondTryModal>
              <NotificationModal
                data={nodesInfo}
                callbacks={ {close: this.handleCloseNotification} }>
              </NotificationModal>
              {/*end of modals*/}
            </div>
        );
      }
  }

}

const profileStateToProps = state => {
  return {
    authenticated: state.authReducer.authenticated,
    info: state.profileReducer.info,
    content: state.profileReducer.content,
    thumbnail: state.profileReducer.thumbnail,
    mode: state.profileReducer.mode,
    chart: state.profileReducer.chart,
    itemTypes: state.profileReducer.itemTypes,
    nodes: state.profileReducer.nodes,
    isReviewing: state.profileReducer.isReviewing,
    itemDeleted: state.profileReducer.itemDeleted,
    allItemsDeleted: state.profileReducer.allItemsDeleted,
    itemsForTypes: state.profileReducer.itemsForTypes,
    unchangedContent: state.profileReducer.unchangedContent
  };
};

const actions = {
  authSuccess,
  getUserInfo,
  toggleIconClick,
  addRemoveButtonToggle,
  permanentRemoveItem,
  legendItemClick,
  filterItems,
  reviewRemoveSelection,
  filterBySize,
  filterByDate,
  filterByType,
  getUserInfoSuccess
};

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(
  profileStateToProps,
  actions
)(withStyles(styles)(Profile));
