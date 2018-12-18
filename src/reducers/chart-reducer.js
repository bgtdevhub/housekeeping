import {
  SHOW_CHART_ITEM_DETAIL,
  CLOSE_CHART_ITEM_DETAIL,
  CLEAR_CHART_ITEM_DETAIL_DISPLAY
} from '../constants/actions';

const chartReducer = (state = {}, action) => {

  switch (action.type) {
    case SHOW_CHART_ITEM_DETAIL:
      return {
        displayingChartItemDetail: true
      };

    case CLOSE_CHART_ITEM_DETAIL:
      return {
        displayingChartItemDetail: false,
        closeFromChart: true
      };

    case CLEAR_CHART_ITEM_DETAIL_DISPLAY:
      return {
        displayingChartItemDetail: false,
        closeFromChart: false
      };
    default:
      return state;
  }
};

export default chartReducer;
