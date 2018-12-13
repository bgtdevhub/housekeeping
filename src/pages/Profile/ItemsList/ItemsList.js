import React from 'react';
// import tableStyles from './Table.css';
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
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
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
    return { icon: "datafilesGray" };
  }
  return itemTypes.find(item => item.type == type);
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
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

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

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
    let action = 'add';
    if (node.icon === 'add_circle') {
      node.icon = 'remove_circle';
      action = 'remove';
    } else {
      node.icon = 'add_circle';
    }
    cb(node, action);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({data:this.props.data})
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
      selected: this.props.config.selected,
    });
  }

  render() {
    const { classes, config, callbacks } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, anchorEl, hoverDataCell } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const open = Boolean(anchorEl);

    console.log('data', this);

    return (
      <Paper className={classes.root} onMouseLeave={(event) => this.handlePopoverClose(event)}>
        <PopupDetail data={hoverDataCell} config={{anchorEl:anchorEl, open:open}} callbacks={{close:this.handlePopoverClose.bind(this)}} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
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
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Icon onClick={(event)=>this.handleToggleClick(event, n, callbacks.removeItem)}>{n.icon}</Icon>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <img alt={n.type} src={("../../assets/img/"+getIconByType(config.itemTypes, n.type).icon+"16.png")}></img>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <span className={("esri-icon-"+n.access+"16")} aria-label={n.access}></span>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Typography
                         aria-owns={open ? "mouse-over-popover" : undefined}
                         aria-haspopup="true"
                         onMouseOver={(event) => this.handlePopoverOpen(event, n)}
                        >
                         {n.title}
                        </Typography>
                      </TableCell>
                      <TableCell numeric>{n.modified}</TableCell>
                      <TableCell numeric>{Math.round((n.size/1e+6))} MB</TableCell>
                      <TableCell numeric>{n.numViews}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

ItemsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemsList);
