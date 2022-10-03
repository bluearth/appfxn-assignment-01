import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunkMiddleware from "redux-thunk";

const initialState = {
  synched: false,
  synching: false,
  lastError: null,
  searchPanelVisible: true,
  historyPanelVisible: true,
  placeHistory: []
};

const reducer = (state = initialState, action) => {
  // Clone the current state
  const newState = {
    ...state,
    // Don't forget to deep-clone members too
    placeHistory: [...state.placeHistory]
  };

  switch (action.type) {
    case "history/place_added":
      if (action.payload && action.payload.place) {
        newState.placeHistory = [
          action.payload.place,
          ...newState.placeHistory
        ];
        newState.synched = false;
      }
      break;

    case "history/place_removed":
      if (action.payload && action.payload.index >= 0) {
        newState.placeHistory.splice(action.payload.index, 1);
      }
      break;

    case "history/all_place_removed":
      newState.placeHistory = [];
      break;

    case "history_panel_toggled":
      newState.historyPanelVisible = !state.historyPanelVisible;
      break;

    case "state_synching":
      newState.synching = true;
      break;

    case "state_synching_failed":
      newState.synching = false;
      newState.lastError = action.payload.error;
      break;

    case "state_synched":
      newState.synched = true;
      newState.lastError = null;
      newState.synching = false;
      break;

    case "state_restored":
      if (action.payload && action.payload.state) {
        newState.placeHistory = action.payload.state.placeHistory;
        newState.synching = false;
        newState.synched = true;
        newState.lastError = null;
      }
      break;

    default:
      break;
  }
  return newState;
};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export default store;
