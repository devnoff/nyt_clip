import fetch from 'cross-fetch'
import 'abortcontroller-polyfill';
import {AsyncStorage} from 'react-native';

export const REQUEST_SEARCH = 'REQUEST_SEARCH'
function requestSearch(query, abort_controller) {
  return {
    type: REQUEST_SEARCH,
    query,
    abort_controller
  }
}

export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_RESULT'
function receiveSearchResult(query, json) {
  return {
    type: RECEIVE_SEARCH_RESULT,
    query,
    articles: json.response ? json.response.docs : [],
    receivedAt: Date.now()
  }
}


const API_KEY = '5OUsvkZOjzGk99yDSfgTYE1Hug6B9CLJ';
const API_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';


export function searchArticle(query) {

  return function(dispatch) {

    const AbortController = window.AbortController;
    const controller = new AbortController();
    const signal = controller.signal;
    console.log(controller, 'controller');
    dispatch(requestSearch(query, controller));

    return fetch(`${API_URL}?api-key=${API_KEY}&q=${query}`, { signal })
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => {
        if (!signal.aborted) {
          console.log(query);
          return dispatch(receiveSearchResult(query, json));
        }
      });
  }
}


export const REQUEST_CLIP = 'REQUEST_CLIP';
function requestClip(item) {
  return {
    type: REQUEST_CLIP,
    item: item
  }
}

export const DONE_CLIP = 'DONE_CLIP';
function doneClip(items) {
  return {
    type: DONE_CLIP,
    items: items
  }
}


export function clipArticle(item) {
  return function(dispatch) {
    dispatch(requestClip(item));
    console.log('clpped');
    return new Promise(async (resolve, reject) => {
      let k = item._id;
      try {
        await AsyncStorage.setItem(k, JSON.stringify(Object.assign({}, item, {clipped: true})));
        const keys = await AsyncStorage.getAllKeys();
        let result = await AsyncStorage.multiGet(keys);
        result = result.map(item => JSON.parse(item[1]))
        dispatch(doneClip(result));
        resolve()
      } catch (e) {
        reject(e)
      }
    });
  }
}


export const REQUEST_UNCLIP = 'REQUEST_UNCLIP';
function requestUnclip(item) {
  return {
    type: REQUEST_UNCLIP,
    item: item
  }
}

export const DONE_UNCLIP = 'DONE_UNCLIP';
function doneUnclip(items) {
  return {
    type: DONE_UNCLIP,
    items
  }
}


export function unclipArticle(item) {
  return function(dispatch) {
    dispatch(requestUnclip(item));
    return new Promise(async (resolve, reject) => {
      let k = item._id;
      try {
        await AsyncStorage.removeItem(k);
        const keys = await AsyncStorage.getAllKeys();
        let result = await AsyncStorage.multiGet(keys);
        result = result.map(item => JSON.parse(item[1]))
        dispatch(doneUnclip(result));
        resolve()
      } catch (e) {
        reject(e)
      }
    });
  }
}


export const REQUEST_CLIPPED = 'REQUEST_CLIPPED';
function requestClipped() {
  return {
    type: REQUEST_CLIPPED
  }
}

export const RECEIVED_CLIPPED = 'RECEIVED_CLIPPED';
function receivedClipped(items) {
  return {
    type: RECEIVED_CLIPPED,
    items
  }
}

export function fetchClipped() {
  return function(dispatch) {
    dispatch(requestClipped());
    return new Promise(async (resolve, reject) => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        let result = await AsyncStorage.multiGet(keys);
        result = result.map(item => JSON.parse(item[1]));
        dispatch(receivedClipped(result));
        resolve()
      } catch (e) {
        reject(e)
      }
    });
  }
}
