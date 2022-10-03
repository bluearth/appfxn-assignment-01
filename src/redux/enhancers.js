const logActionOnDispatch =
  (createStore) => (rootReducer, preloadState, enhancers) => {
    const store = createStore(rootReducer, preloadState, enhancers);

    return {
      ...store,
      dispatch: (action) => {
        console.debug(">>", action);
        return store.dispatch(action);
      },
    };
  };

export { logActionOnDispatch };
