import {
  GET_USER_INFO,
  GET_USER_CONTENT,
  TOGGLE_ICON_CLICK,
  TOGGLE_ICON_CLICK_DONE,
  ADD_REMOVE_BUTTON_TOGGLE,
  PERMANENT_REMOVE_ITEM,
  LEGEND_ITEM_CLICK,
  FILTER_ITEMS,
  REVIEW_REMOVE_SELECTION,
  FILTER_BY_SIZE,
  FILTER_BY_DATE,
  FILTER_BY_TYPE,
} from '../constants/actions.js';

export const getUserInfo = (info) => {
    return {
        type: GET_USER_INFO,
        info
    }
}

export const getUserContent = (content) => {
    return {
        type: GET_USER_CONTENT,
        content
    }
}

export const toggleIconClick = (mode) => {
    return {
        type: TOGGLE_ICON_CLICK,
        mode
    }
}

export const toggleIconClickDone = (mode) => {
    return {
        type: TOGGLE_ICON_CLICK_DONE,
        mode
    }
}

export const addRemoveButtonToggle = (node, triggerFor) => {
    return {
        type: ADD_REMOVE_BUTTON_TOGGLE,
        node,
        triggerFor
    }
}

export const permanentRemoveItem = (itemsToBeRemoved) => {
    return {
        type: PERMANENT_REMOVE_ITEM,
        itemsToBeRemoved
    }
}

export const reviewRemoveSelection = () => {
    return {
        type: REVIEW_REMOVE_SELECTION,
        isReviewing: true
    }
}

export const legendItemClick = (selectedType) => {
    return {
        type: LEGEND_ITEM_CLICK,
        selectedType
    }
}

export const filterItems = (key, selectedItem) => {
    return {
        type: FILTER_ITEMS,
        filterKey: key,
        selectedItem
    }
}

export const filterBySize = (selectedSize) => {
    return {
        type: FILTER_BY_SIZE,
        filterBySize: true,
        selectedSize
    }
}

export const filterByDate = (selectedDate) => {
    return {
        type: FILTER_BY_DATE,
        filterByDate: true,
        selectedDate
    }
}

export const filterByType = (selectedType) => {
    return {
        type: FILTER_BY_TYPE,
        filterByType: true,
        selectedType
    }
}
