import { combineReducers } from 'redux'
import {
  REQUEST_SEARCH,
  RECEIVE_SEARCH_RESULT,
  REQUEST_CLIP,
  DONE_CLIP,
  REQUEST_UNCLIP,
  DONE_UNCLIP,
  REQUEST_CLIPPED,
  RECEIVED_CLIPPED
} from '../actions'

function article(
  state = {
    isFetching: false,
    items: [], 
    abortController: null
  },
  action
) {
  switch (action.type) {
    case REQUEST_SEARCH:
      return Object.assign({}, state, {
        isFetching: true,
        abortController: action.abort_controller
      })
    case RECEIVE_SEARCH_RESULT:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.articles,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function clip(
  state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_CLIP:
      return Object.assign({}, state, {
        isFetching: true
      })
    case DONE_CLIP:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.items
      })
    case REQUEST_UNCLIP:
      return Object.assign({}, state, {
        isFetching: true
      })
    case DONE_UNCLIP:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.items
      })
    case REQUEST_CLIPPED:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVED_CLIPPED:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.items
      })
    default:
      return state;
  }
}


const rootReducer = combineReducers({
  article,
  clip
})

export default rootReducer