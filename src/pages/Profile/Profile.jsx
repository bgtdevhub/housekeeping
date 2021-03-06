import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Profile.css';
import * as calcite from 'calcite-web';
import noThumbnail from '../../img/icons/ui/no-user-thumb.jpg';
import { Container } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import { Chart, Doughnut } from 'react-chartjs-2';
import {
  getNodesInfo,
  getFilterData,
  getTypes,
  convertMbToB,
  convertToGb
} from '../../utils/profile';
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
import { logout } from '../../actions/auth';
import { clearChartItemDetailDisplay } from '../../actions/chart';
import { getToken } from '../../utils/auth';
import MainComponent from './MainComponent/MainComponent';
import DHLayout from '../../components/Layout/Layout';
import {
  FirstTryModal,
  SecondTryModal,
  NotificationModal
} from './Modals/Modals';
import ItemsLegend from './ItemsLegend/ItemsLegend';
import Loader from './Loader/Loader';
import Filter from './Filter/Filter';
import Button from 'calcite-react/Button';
import Toaster from 'calcite-react/Toaster';
import Header from '../../components/Layout/Header/Header';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  avatar: {
    margin: 10
  },
  bigAvatar: {
    width: 60,
    height: 60
  }
});

class Profile extends Component {
  static childContextTypes = {
    callbacks: PropTypes.object,
    config: PropTypes.object
  };

  tableConfig = {
    rows: [
      { id: 'type', numeric: false, disablePadding: true, label: '' },
      { id: 'access', numeric: false, disablePadding: true, label: '' },
      {
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'Item Title'
      },
      {
        id: 'modified',
        numeric: true,
        disablePadding: false,
        label: 'Last Modified'
      },
      { id: 'size', numeric: true, disablePadding: false, label: 'File Size' },
      { id: 'numViews', numeric: true, disablePadding: false, label: 'Views' }
    ],
    order: 'desc',
    orderBy: 'size',
    selected: [],
    page: 0,
    rowsPerPage: 10
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
      toasterOpen: false
    }
  };

  handleLogout = () => {
    this.props.history.push('/');
    this.props.logout();
  };

  getChildContext() {
    return {
      callbacks: { logout: this.handleLogout },
      config: { show: true }
    };
  }

  removeItem(node, triggerFor) {
    this.props.addRemoveButtonToggle(node, triggerFor);
    setTimeout(() => {
      this.setState({
        creditSetData: [0, 0],
        sizeSetData: [0, 0],
        itemsSetData: [0, 0]
      });
    }, 0);
  }

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
    const { nodes } = this.props;
    const selected = nodes.map(x => x.id);
    this.setState({
      mainComponent: {
        component: 'table',
        data: data,
        config: Object.assign(Ydnlu.clone(this.tableConfig), {
          itemTypes,
          selected
        }),
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

  displayReviewFromTableMode() {
    const { isReviewing, mode } = this.state;
    if (isReviewing) {
      this.handleFirstTryDelete();
    } else {
      this.props.reviewRemoveSelection();
    }
  }

  displayReviewFromChartMode() {
    const { nodes, mode } = this.state;
    this.props.toggleIconClick('table');
    this.refreshMainComponent();
    setTimeout(() => {
      this.updateTableState([]);
      this.props.reviewRemoveSelection();
    }, 1000);
  }

  handleFirstTryDelete = () => {
    calcite.bus.emit('modal:open', { id: 'firstDeleteConfirmation' });
  };

  handleCloseFirstTryModal = () => {
    calcite.bus.emit('modal:close', { id: 'firstDeleteConfirmation' });
  };

  handleSecondTryModal = () => {
    this.handleCloseFirstTryModal();
    calcite.bus.emit('modal:open', { id: 'secondDeleteConfirmation' });
  };

  handleCloseSecondTryModal = () => {
    calcite.bus.emit('modal:close', { id: 'secondDeleteConfirmation' });
  };

  handleCloseNotification = () => {
    this.props.getUserInfoSuccess(this.state.info);
    calcite.bus.emit('modal:close', { id: 'notification' });
    this.props.toggleIconClick('table');
    this.showToaster();
    this.refreshMainComponent();
    setTimeout(() => this.updateTableState(this.state.content.items), 1000);
  };

  handlePermanentDelete = () => {
    const { nodes } = this.state;
    const hash = this.props.location.hash;
    this.handleCloseSecondTryModal();
    this.props.permanentRemoveItem(nodes, hash);
  };

  showToaster = () => {
    this.setState({
      toasterOpen: true
    });
  };

  hideToaster = () => {
    this.setState({
      toasterOpen: false
    });
  };

  handleLegendItemClick(node, event) {
    event.preventDefault();
    this.props.clearChartItemDetailDisplay();
    this.refreshMainComponent();
    this.props.legendItemClick(node);
    setTimeout(() => {
      this.updateChartState();
    }, 1000);
  }

  handleFilter(key, selectedItem) {
    const { mode, content } = this.state;
    const actions = {
      size: 'filterBySize',
      date: 'filterByDate',
      type: 'filterByType'
    };
    this.props[actions[key]](selectedItem);
    if (mode === 'chart') {
      this.refreshMainComponent();
      setTimeout(() => {
        this.updateChartState();
      }, 0);
    } else {
      // for now its table
      this.updateTableState(content.items);
    }
  }

  handleResetChartFilter(node, event) {
    event.preventDefault();

    setTimeout(() => {
      if(this.state.mode === 'chart' && !this.props.displayingChartItemDetail) {
        if (!this.props.closeFromChart) {
          this.props.toggleIconClick('chart');
          this.refreshMainComponent();
          setTimeout(() => this.updateChartState(), 200);
        } else {
          this.props.clearChartItemDetailDisplay();
          const selectedElement = document.getElementById(node.name.split(' ').join('') + "Legend");
          selectedElement.focus();
        }
      } else if (this.state.mode === 'chart' && this.props.displayingChartItemDetail) {
        const selectedElement = document.getElementById(node.name.split(' ').join('') + "Legend");
        selectedElement.focus();
      }
    }, 150);
  }

  refreshMainComponent = () => {
    this.setState({
      mainComponent: {
        component: 'noop',
        data: []
      }
    });
  };

  getMainComponentSpecs = mainComponent => {
    const { content, itemTypes, nodes, isReviewing } = this.state;
    if (mainComponent.component === 'table') {
      let items = [...content.items].map(item => {
        let newItem = { ...item };
        newItem.icon = 'add_circle';
        if (nodes.length > 0) {
          if (nodes.find(node => node.id == newItem.id)) {
            newItem.icon = 'remove_circle';
          }
        }
        return newItem;
      });
      const data = isReviewing ? nodes : items;
      const config = Object.assign(mainComponent.config, {
        itemTypes: itemTypes
      });
      const callbacks = Object.assign(mainComponent.callbacks, {
        removeItem: this.removeItem.bind(this)
      });
      return { data, config, callbacks };
    } else {
      return Object.assign(mainComponent, { config: { nodes: nodes } });
    }
  };

  componentDidMount() {
    const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
    calcite.init();
    if (this.props.location.hash.indexOf('#access_token') !== -1) {
      const hash = this.props.location.hash;
      this.props.authSuccess(hash);
    }
    this.props.getUserInfo();
    this.props.history.push('/profile');
    Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
      draw: function() {
        originalDoughnutDraw.apply(this, arguments);
        const chart = this.chart;
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;
        const fontSize = (height / 200).toFixed(2);
        ctx.font = fontSize + 'em sans-serif';
        ctx.textBaseline = 'middle';
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

  componentWillUnmount() {
    //todo: clear timeouts
  }

  componentDidUpdate(prevProps, prevStates) {
    const { content, mode, itemDeleted, allItemsDeleted } = this.state;
    if (content !== prevStates.content) {
      if (mode === 'table') {
        this.updateTableState(content.items);
      } else {
        // for now is chart
        this.refreshMainComponent();
        setTimeout(() => {
          this.updateChartState();
        }, 0);
      }
    }

    if (itemDeleted !== prevStates.itemDeleted && itemDeleted) {
      calcite.bus.emit('modal:open', { id: 'notification' });
    }

    if (allItemsDeleted !== prevStates.allItemsDeleted && allItemsDeleted) {
      this.handleCloseNotification();
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
      unchangedContent: props.unchangedContent,
      allItemsDeleted: props.allItemsDeleted,
      historyNodes: props.historyNodes,
      displayingChartItemDetail: props.displayingChartItemDetail,
      closeFromChart: props.closeFromChart
    };
  }

  render() {
    const { content, chart } = this.state;
    const { classes } = this.props;

    if (content === undefined) {
      return <Loader />;
    } else {
      const {
        info,
        mode,
        thumbnail,
        mainComponent,
        unchangedContent,
        nodes,
        itemsForTypes,
        isReviewing,
        historyNodes
      } = this.state;
      const itemsInfo = getNodesInfo(unchangedContent.items);
      const nodesInfo = getNodesInfo(nodes);
      const mainComponentSpecs = this.getMainComponentSpecs(mainComponent);
      const totalEstimatedCredit =
        itemsInfo.estimatedCredit - nodesInfo.estimatedCredit;
      const totalEstimatedSize = itemsInfo.size - nodesInfo.size;
      const totalEstimatedItems = itemsInfo.total - nodesInfo.total;
      const creditDonutData = getDonutChartData({
        data: [
          nodesInfo.estimatedCredit,
          totalEstimatedCredit === 0 ? 1 : totalEstimatedCredit
        ],
        total: nodesInfo.estimatedCredit,
        text: 'Credits'
      });
      const sizeDonutData = getDonutChartData({
        data: [
          nodesInfo.size,
          totalEstimatedSize === 0 ? 1 : totalEstimatedSize
        ],
        total: nodesInfo.size,
        text: 'MB'
      });
      const itemsDonutData = getDonutChartData({
        data: [
          nodesInfo.total,
          totalEstimatedItems === 0 ? 1 : totalEstimatedItems
        ],
        total: nodesInfo.total,
        text: 'Items'
      });

      return (
        <div className='profile'>
          <DHLayout className={classes.root}>
            <Container fluid className='app-body'>
              <div className='app-container'>
                <div className='app-left'>
                  {/*start of card*/}
                  <div className='profile-card card card-shaped'>
                    <figure className='card-image-wrap'>
                      <img
                        src={thumbnail ? thumbnail : noThumbnail}
                        alt={info.fullName}
                        className='card-image'
                      />
                    </figure>
                    <div className='card-content'>
                      <p>
                        <b>{info.fullName}</b>
                      </p>
                      <p className='font-size--1 card-last'>
                        Estimated{' '}
                        <b>{getNodesInfo(unchangedContent.items).estimatedCredit}</b>{' '}
                        credits/month
                      </p>
                      <div className='info'>
                        <div className='info-item'>
                          <div className='info-value'>
                            {unchangedContent.items.length}
                          </div>
                          <div className='info-unit'>
                            {unchangedContent.total > 1 ? 'Items' : 'Item'}
                          </div>
                        </div>
                        <div className='info-item'>
                          <div className='info-value'>
                            {itemsInfo.size >= 500
                              ? convertToGb(convertMbToB(itemsInfo.size))
                              : itemsInfo.size}
                          </div>
                          <div className='info-unit'>
                            {itemsInfo.size >= 500 ? 'GB' : 'MB'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*end of card*/}
                  {/*start of filter*/}
                  {!isReviewing ? (
                    <Fragment>
                      <Filter
                        data={getFilterData('filterSize')}
                        callbacks={{ onChange: this.handleFilter.bind(this) }}
                      />
                      <Filter
                        data={getFilterData('filterDate')}
                        callbacks={{ onChange: this.handleFilter.bind(this) }}
                      />
                      <Filter
                        data={getFilterData(
                          'filterType',
                          getTypes(itemsForTypes)
                        )}
                        callbacks={{ onChange: this.handleFilter.bind(this) }}
                      />
                    </Fragment>
                  ) : (
                    <Fragment />
                  )}
                  {/*end of filter*/}
                </div>
                <div className='app-center'>
                  {isReviewing ? (
                    <div className='app-status'>REVIEW</div>
                  ) : null}
                  <MainComponent
                    className={classes.mainComponentContainer}
                    component={mainComponent.component}
                    data={mainComponentSpecs.data}
                    config={mainComponentSpecs.config}
                    callbacks={mainComponentSpecs.callbacks}
                  />
                </div>
                <div className='app-right'>
                  <nav className='toggle-list'>
                    <button
                      aria-label='View your items in tabular'
                      className={
                        mode === 'table'
                          ? 'btn btn-with-icon'
                          : 'btn btn-clear btn-with-icon'
                      }
                      onClick={this.displayTable.bind(this)}
                    >
                      <Icon>view_list</Icon>
                    </button>
                    <button
                      aria-label='View your items in treemap'
                      className={
                        mode === 'chart'
                          ? 'btn btn-with-icon'
                          : 'btn btn-clear btn-with-icon'
                      }
                      onClick={this.displayChart.bind(this)}
                    >
                      <Icon>view_quilt</Icon>
                    </button>
                  </nav>
                  <div className='chart-filter-list-container'>
                    {mainComponent.component !== 'table' ? (
                      <ItemsLegend
                        data={unchangedContent}
                        activeFilter={
                          !!chart
                            ? chart.children[0].children.map(x => x.name)
                            : []
                        }
                        callbacks={{
                          onClick: this.handleLegendItemClick.bind(this),
                          onBlur: this.handleResetChartFilter.bind(this)
                        }}
                      />
                    ) : (
                      <Fragment />
                    )}
                  </div>
                  <div className='doughnut-list'>
                    <Doughnut
                      data={creditDonutData}
                      width={1}
                      height={1}
                      options={getDonutChartOptions()}
                    />
                    <Doughnut
                      data={sizeDonutData}
                      width={1}
                      height={1}
                      options={getDonutChartOptions()}
                    />
                    <Doughnut
                      data={itemsDonutData}
                      width={1}
                      height={1}
                      options={getDonutChartOptions()}
                    />
                  </div>
                  {this.props.isReviewing ? (
                    <div className='control-list'>
                      <button
                        onClick={this.handleFirstTryDelete.bind(this)}
                        className={
                          nodes.length === 0
                            ? 'btn btn-fill btn-red btn-disabled'
                            : 'btn btn-fill btn-red'
                        }
                        disabled={nodes.length === 0}
                      >
                        {nodes.length > 1 ? 'Delete All' : 'Delete'}
                      </button>
                      <button
                        onClick={this.displayTable.bind(this)}
                        className='btn btn-clear btn-fill btn-green'
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className='control-list'>
                      <button
                        disabled={nodes.length < 1}
                        onClick={this[
                          mode === 'table'
                            ? 'displayReviewFromTableMode'
                            : 'displayReviewFromChartMode'
                        ].bind(this)}
                        className='btn btn-fill btn-green'
                      >
                        Review{' '}
                        {nodes.length > 0 ? (
                          <span class='control-list-btn-indicator'>
                            {nodes.length}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </DHLayout>
          {/*start of modal*/}
          <FirstTryModal
            data={nodesInfo}
            callbacks={{
              close: this.handleCloseFirstTryModal,
              remove: this.handleSecondTryModal
            }}
          />
          <SecondTryModal
            data={nodesInfo}
            callbacks={{
              close: this.handleCloseSecondTryModal,
              remove: this.handlePermanentDelete
            }}
          />
          <NotificationModal
            data={nodesInfo}
            callbacks={{ close: this.handleCloseNotification }}
          />
          {/*end of filter*/}
          <Toaster open={this.state.toasterOpen} onClose={this.hideToaster}>
            {historyNodes.length} {historyNodes.length > 0 ? 'items' : 'item'}{' '}
            successful deleted
          </Toaster>
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
    unchangedContent: state.profileReducer.unchangedContent,
    historyNodes: state.profileReducer.historyNodes,
    displayingChartItemDetail: state.chartReducer.displayingChartItemDetail || false,
    closeFromChart: state.chartReducer.closeFromChart || false
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
  getUserInfoSuccess,
  logout,
  clearChartItemDetailDisplay
};

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  profileStateToProps,
  actions
)(withStyles(styles)(Profile));
