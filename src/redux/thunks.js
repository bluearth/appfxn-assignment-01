import service from "../services";
import config from "../config";

const LOCAL_STORAGE_KEY =
  config.app?.localStorageKey || "TenaciousMuskrat.8b6f32";

async function saveState(dispatch, getState) {
  const state = getState();
  dispatch({ type: "state_synching" });
  try {
    await service.persistState(LOCAL_STORAGE_KEY, state);
    dispatch({ type: "state_synched" });
  } catch (err) {
    console.error(err);
    dispatch({ type: "state_synching_failed", payload: { error: err } });
  }
}

// addPlaceHistory thunk
function addPlaceHistory(place) {
  return async function (dispatch, getState) {
    dispatch({ type: "history/place_added", payload: { place } });
    await saveState(dispatch, getState);
  };
}

// removePlaceHistory thunk
function removePlaceHistory(index, id = undefined) {
  return async function (dispatch, getState) {
    const { placeHistory } = getState();
    if (index < 0 || index >= placeHistory.lenght) return;
    dispatch({ type: "history/place_removed", payload: { index, id } });
    await saveState(dispatch, getState);
  };
}

// removeAllPlaceHistory thunk
function removeAllPlaceHistory() {
  return async function (dispatch, getState) {
    dispatch({ type: "history/all_place_removed" });
    await saveState(dispatch, getState);
  };
}

// peristState thunk
function persistState() {
  return async function (dispatch, getState) {
    await saveState(dispatch, getState);
  };
}

// restoreState thunk
function restoreState() {
  return async function (dispatch, getState) {
    dispatch({ type: "state_synching" });
    try {
      const state = await service.loadState(LOCAL_STORAGE_KEY);
      dispatch({ type: "state_restored", payload: { state } });
    } catch (err) {
      console.error(err);
      dispatch({ type: "state_synching_failed", payload: { error: err } });
    }
  };
}

export {
  addPlaceHistory,
  removePlaceHistory,
  removeAllPlaceHistory,
  persistState,
  restoreState
};
