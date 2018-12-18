import {
  SHOW_CHART_ITEM_DETAIL,
  CLOSE_CHART_ITEM_DETAIL,
  CLEAR_CHART_ITEM_DETAIL_DISPLAY
} from '../constants/actions.js';

export const showChartItemDetail = () => {
    return {
        type: SHOW_CHART_ITEM_DETAIL
    }
}

export const closeChartItemDetail = () => {
    return {
        type: CLOSE_CHART_ITEM_DETAIL
    }
}

export const clearChartItemDetailDisplay = () => {
  return {
      type: CLEAR_CHART_ITEM_DETAIL_DISPLAY
  }
}