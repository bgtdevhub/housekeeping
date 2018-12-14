import React from 'react';
import './ItemsList.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableHeader from './TableHeader/TableHeader';
import PopupDetail from '../PopupDetail/PopupDetail';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { convertToDate, getDaysBetween } from '../../../utils/profile.js';

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getIconByType(itemTypes, type) {
  let ret = itemTypes.find(item => item.type == type);
  if (ret === undefined) {
    return { icon: 'datafilesGray' };
  }
  return itemTypes.find(item => item.type == type);
}

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
});

class ItemsList extends React.Component {
  state = {
    order: 'asc',
    orderBy: '',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 0,
    anchorEl: null,
    hoverDataCell: {},
    loading: false
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {};

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handlePopoverOpen = (event, data) => {
    this.setState({ anchorEl: event.currentTarget, hoverDataCell: data });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  handleToggleClick = (event, node, cb) => {
    const { id } = node;

    const selected = [
      ...this.state.selected.filter(x => x !== id),
      ...(this.state.selected.includes(id) ? [] : [id])
    ];

    this.setState({ selected });

    const action = selected.includes(id) ? 'remove' : 'add';

    cb(node, action);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      rows: this.props.config.rows,
      rowsPerPage: this.props.config.rowsPerPage,
      page: this.props.config.page,
      order: this.props.config.order,
      orderBy: this.props.config.orderBy,
      selected: this.props.config.selected
    });
  }

  render() {
    const { classes, config, callbacks } = this.props;
    const {
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      anchorEl,
      hoverDataCell
    } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Paper
        className={classes.root}
        onMouseLeave={event => this.handlePopoverClose(event)}
      >
        <PopupDetail
          data={hoverDataCell}
          config={{ anchorEl: anchorEl, open: open }}
          callbacks={{ close: this.handlePopoverClose.bind(this) }}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table + ' item-list-table'}
            aria-labelledby='tableTitle'
          >
            <TableHeader
              rows={config.rows}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {!data.length ? (
                <TableRow>
                  <TableCell colSpan='7'>No item in list.</TableCell>
                </TableRow>
              ) : (
                stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    const lastAccessDayTotal = getDaysBetween(
                      convertToDate(n.created),
                      convertToDate(n.modified)
                    );

                    return (
                      <TableRow
                        role='checkbox'
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                        onClick={event =>
                          this.handleToggleClick(event, n, callbacks.removeItem)
                        }
                      >
                        <TableCell padding='checkbox'>
                          <Icon
                            className={`item-list-icon item-list-toggle${
                              isSelected ? ' item-list-toggle--selected' : ''
                            }`}
                          >
                            {isSelected ? 'remove_circle' : 'add_circle'}
                          </Icon>
                        </TableCell>
                        <TableCell scope='row' padding='none'>
                          <img
                            className='item-list-icon'
                            alt={n.type}
                            src={
                              '../../assets/img/' +
                              getIconByType(config.itemTypes, n.type).icon +
                              '16.png'
                            }
                          />
                        </TableCell>
                        <TableCell scope='row' padding='none'>
                          <span
                            className={
                              'item-list-icon esri-icon-' + n.access + '16'
                            }
                            aria-label={n.access}
                          />
                        </TableCell>
                        <TableCell scope='row' padding='none'>
                          <Typography
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup='true'
                            onMouseOver={event =>
                              this.handlePopoverOpen(event, n)
                            }
                          >
                            {n.title}
                          </Typography>
                        </TableCell>
                        <TableCell numeric>
                          {lastAccessDayTotal > 0
                            ? `${lastAccessDayTotal} days`
                            : lastAccessDayTotal === 1
                            ? `${lastAccessDayTotal} day`
                            : 'Today'}
                        </TableCell>
                        <TableCell numeric>
                          {Math.round(n.size / 1e6)} MB
                        </TableCell>
                        <TableCell numeric>{n.numViews}</TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

ItemsList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ItemsList);
