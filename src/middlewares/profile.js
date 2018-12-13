import {
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_CONTENT,
  TOGGLE_ICON_CLICK,
  TOGGLE_ICON_CLICK_DONE,
  ADD_REMOVE_BUTTON_TOGGLE,
  SELECT_TO_REMOVE_ITEM,
  ADD_BACK_ITEM,
  PERMANENT_REMOVE_ITEM,
  // AUTH_SUCCESS,
  LEGEND_ITEM_CLICK,
  LEGEND_ITEM_CLICK_DONE,
  FILTER_BY_SIZE,
  FILTER_BY_SIZE_DONE,
  FILTER_BY_DATE,
  FILTER_BY_DATE_DONE,
  FILTER_BY_TYPE,
  FILTER_BY_TYPE_DONE,
  ITEM_DELETED
} from '../constants/actions';
import { getUsername } from '../utils/auth';
import { getTreemapData } from '../utils/chart';
import { filterItems } from '../utils/profile';
import { types } from '../constants/items';
import argisApi from '../services/argis';
import Ydnlu from '../utils/ydnlu';

export const profileUser = store => {

    return next => action => {
        next(action);
        switch (action.type) {

          case GET_USER_INFO:
            argisApi.getUserInfo(getUsername()).then((info)=> {
              store.dispatch({ type: GET_USER_INFO_SUCCESS, info: info });
            })
            break;

          case GET_USER_INFO_SUCCESS:
            const getUserThumbnail = argisApi.getUserThumbnail;
            const username = getUsername();
            let folderPromises = [];
            argisApi.getUserContent(getUsername()).then((content)=> {
              let thumbnail = getUserThumbnail(username, action.info.thumbnail);

              if (content.folders.length > 0) {
                let folderIds = content.folders.map(folder => folder.id);
                folderIds.forEach(id => folderPromises.push(argisApi.getUserItemsByFolderName(username, id)));
              }

              Promise.all([...folderPromises]).then(res => {
                let allItems = [...content.items];
                res.forEach((item,idx) => {
                  allItems = [...allItems, ...item.items]
                });
                content.items = allItems;
                const chart = getTreemapData(content);
                store.dispatch({
                  type: GET_USER_CONTENT,
                  content: content,
                  itemsForTypes: [...content.items],
                  thumbnail: thumbnail,
                  itemTypes: types,
                  chart,
                  itemDeleted: false
                });
              });
            })
            break;

          default:

        }
    }
}

export const profileItemsRemoval = store => {

    return next => action => {
        next(action);
        const { info } = store.getState().profileReducer;
        switch (action.type) {

          case ADD_REMOVE_BUTTON_TOGGLE:
            const actions = {
              remove: SELECT_TO_REMOVE_ITEM,
              add: ADD_BACK_ITEM
            };
            store.dispatch({ type: actions[action.triggerFor], node: action.node });
            break;

          case PERMANENT_REMOVE_ITEM:
            let removedItemPromises = [];
            action.itemsToBeRemoved.forEach(item => {
              removedItemPromises.push(argisApi.deleteItem(getUsername(), item.id));
            });
            Promise.all([...removedItemPromises]).then(() => {
              store.dispatch({ type: ITEM_DELETED, mode: 'table', itemDeleted: true, nodes: [] });
            });
            break;

          default:

        }
    }
}

export const profileChart = store => {

    return next => action => {
        next(action);
        switch (action.type) {

          case TOGGLE_ICON_CLICK:
            let data = null;
            if (action.mode === 'chart') {
              data = getTreemapData(store.getState().profileReducer.content);
            }
            store.dispatch({ type: TOGGLE_ICON_CLICK_DONE, mode: action.mode, chart: data, itemTypes: types });
            break;

          case LEGEND_ITEM_CLICK:
            const chartData = getTreemapData(store.getState().profileReducer.unchangedContent);
            let chartItems = [...chartData.children[0].children];
            if (!Ydnlu.isEmpty(chartData.children)) {
              chartItems = chartItems.filter(item => (action.selectedType.name === item.name))
            }
            chartData.children[0].children = chartItems;
            store.dispatch({ type: LEGEND_ITEM_CLICK_DONE, chart: chartData, mode: 'chart' });
            break;

          default:

        }
    }
}

export const profileFilter = store => {

    return next => action => {
        next(action);
        const {
          content,
          unchangedContent,
          mode,
          chart,
          filterBySize, selectedSize,
          filterByDate, selectedDate,
          filterByType, selectedType,
        } = store.getState().profileReducer;

        switch (action.type) {

          case FILTER_BY_SIZE:
            const filteredItemsDataForSize = filterItems({
              items: [...content.items],
              unchangedContentItems: unchangedContent.items,
              filterBySize: true,
              selectedSize: action.selectedSize,
              filterByDate,
              selectedDate,
              filterByType,
              selectedType,
            });
            const newContent = Object.assign(content, {
              items: filteredItemsDataForSize
            });
            let dispatchDataSize = {
              type: FILTER_BY_SIZE_DONE,
              content: newContent,
              mode: mode,
              selectedSize: action.selectedSize,
              chart
            };

            if (mode === 'chart') {
              dispatchDataSize['chart'] = getTreemapData(newContent);
            }

            store.dispatch(dispatchDataSize);
            break;

          case FILTER_BY_DATE:
            const filteredItemsDataForDate = filterItems({
              items: [...content.items],
              unchangedContentItems: unchangedContent.items,
              filterByDate: true,
              selectedDate: action.selectedDate,
              filterByType,
              selectedType,
              filterBySize,
              selectedSize,
            });
            const newContentDate = Object.assign(content, {
              items: filteredItemsDataForDate
            });
            let dispatchDataDate = {
              type: FILTER_BY_DATE_DONE,
              content: newContentDate,
              mode: mode,
              selectedDate: action.selectedDate,
              chart
            };

            if (mode === 'chart') {
              dispatchDataDate['chart'] = getTreemapData(newContentDate);
            }

            store.dispatch(dispatchDataDate);

            break;

          case FILTER_BY_TYPE:
            const filteredItemsDataForType = filterItems({
              items: [...content.items],
              unchangedContentItems: unchangedContent.items,
              filterByType: true,
              selectedType: action.selectedType,
              filterBySize,
              selectedSize,
              filterByDate,
              selectedDate,
            });
            const newContentType = Object.assign(content, {
              items: filteredItemsDataForType
            });
            let dispatchDataType = {
              type: FILTER_BY_TYPE_DONE,
              content: newContentType,
              mode: mode,
              selectedType: action.selectedType,
              chart
            };

            if (mode === 'chart') {
              dispatchDataType['chart'] = getTreemapData(newContentType);
            }

            store.dispatch(dispatchDataType);

            break;

          default:

        }
    }
}
