import {
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_CONTENT,
  TOGGLE_ICON_CLICK,
  TOGGLE_ICON_CLICK_DONE,
  ADD_REMOVE_BUTTON_TOGGLE,
  SELECT_TO_REMOVE_ITEM,
  REVIEW_REMOVE_SELECTION,
  ADD_BACK_ITEM,
  PERMANENT_REMOVE_ITEM,
  LEGEND_ITEM_CLICK_DONE,
  FILTER_ITEMS,
  FILTER_ITEMS_DONE,
  FILTER_BY_SIZE_DONE,
  FILTER_BY_DATE_DONE,
  FILTER_BY_TYPE_DONE,
  ITEM_DELETED,
  ALL_ITEMS_DELETED
} from '../constants/actions';

const profileReducer = (state = {}, action) => {

  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...state,
        info: action.info,
        unchangedContent: {},
        nodes: [],
        historyNodes: [],
        isReviewing: false,
        allItemsDeleted: false,
        itemDeleteStart: false,
        itemsForTypes: [],
        selectedItem: {},
        filterBySize: false,
        filterByDate: false,
        filterByType: false,
        selectedSize: {},
        selectedDate: {},
        selectedType: {}
      };

    case GET_USER_INFO_SUCCESS:
      return {
        ...state,
        info: action.info,
        mode: action.mode || 'table'
      };

    case GET_USER_CONTENT:
      return {
        ...state,
        unchangedContent: {...action.content},
        content: action.content,
        thumbnail: action.thumbnail,
        itemTypes: action.itemTypes,
        chart: action.chart,
        itemsForTypes: action.itemsForTypes,
      };

    case TOGGLE_ICON_CLICK:
      return {
        ...state,
        mode: action.mode,
        isReviewing: false
      };

    case TOGGLE_ICON_CLICK_DONE:
      return {
        ...state,
        mode: action.mode,
        chart: action.chart,
        itemTypes: action.itemTypes
      };

    case ADD_REMOVE_BUTTON_TOGGLE:
      return {
        ...state,
        node: action.node,
        triggerFor: action.triggerFor
      }

    case SELECT_TO_REMOVE_ITEM:
      return {
        ...state,
        nodes: [...state.nodes, action.node]
      }

    case REVIEW_REMOVE_SELECTION:
      return {
        ...state,
        isReviewing: true
      }

    case ADD_BACK_ITEM:
      let newNodes = state.nodes.filter(node=>node.id !== action.node.id)
      return {
        ...state,
        nodes: newNodes
      }

    case PERMANENT_REMOVE_ITEM:
      return {
        ...state,
        itemsToBeRemoved: action.itemsToBeRemoved
      }

    case LEGEND_ITEM_CLICK_DONE:
      return {
        ...state,
        chart: action.chart
      }

    case FILTER_BY_SIZE_DONE:
      return {
        ...state,
        filterBySize: true,
        selectedSize: action.selectedSize,
        chart: action.chart
      }

    case FILTER_BY_DATE_DONE:
      return {
        ...state,
        filterByDate: true,
        selectedDate: action.selectedDate,
        chart: action.chart
      }

    case FILTER_BY_TYPE_DONE:
      return {
        ...state,
        filterByType: true,
        selectedType: action.selectedType,
        chart: action.chart
      }

    case ALL_ITEMS_DELETED:
      return {
        ...state,
        allItemsDeleted: true,
        nodes: action.nodes,
        historyNodes: action.historyNodes,
        mode: action.mode
      }

    case ITEM_DELETED:
      return {
        ...state,
        itemDeleted: true,
        mode: action.mode
      }

    default:
      return state;
  }
};

export default profileReducer;
