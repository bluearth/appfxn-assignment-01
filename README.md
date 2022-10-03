# AppFuxion Assignment 01

## Requirements

You are to design one simple single page and use Google Place Autocomplete to find places and show at map. the following requirements are compulsory.

1. The textbox must be an autocomplete action and get result from this API (https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete)
2. You must use redux to store result and display all searches that user tries.
3. You need to use one of following method in combination with Redux

   a. Redux Thunk

   b. Redux Promise

   c. Redux Saga

   d. Redux-Observable Epics

4. For UI you need to use Material Design Kit (https://github.com/mui-org/material-ui), make it simple and user friendly, use your creativity as Front-end developer
5. Code structure is compulsory, use the best approach to manage folders,codes, naming and make sure it would be scalable.

## Solution Summary

Here we demonstrate a simple React app to demonstrate:

- The use of Google Map's Place Autocomplete API to obtain place search suggestion.
- The use of Redux and Redux Thunk to manage React application state.
- The use of Material UI's component and styling framework as Google Map Controls

The following is the component hierarchy for the app. For simplicity, some utility components like Google Map Wrapper component aren't shown here.

```

 App
 |- Map
    |- MapControl
       |- AutoCompleteControl
       |- PlaceHistoryControl

```

The Map component holds a react ref to an instance of [`google.maps.Map`](https://developers.google.com/maps/documentation/javascript/reference/map). It passes down the map instance to it's children. `Map` component is designed to have zero or more `MapControl` as it's children. A `MapControl` is react component that holds reference to a DOM node that is to be treated as Custom Map Control. A `MapControl` is not required to have visual UI. It's something for it's children to consider.

The AutoCompleteControl uses Google Map's [Place Autocomplete service](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete) to obtain search suggestions. Once user selects one of the suggested places, the map will be panned to that place and the place will be added to user's search history. The UI for this map controls uses Material UI.

Everytime there are changes to user search history, the app will attempt to persist it's own state using a simulated API. The simulated API is asynchronous and backed by localStorage but introduced small random delay to simulate network latency. The simulated API also has small chance of failing to simulate network failure.

App state is managed as Redux store. The store's reducer is defined in `redux/store.js`. Redux thunks, defined in `redux/thunks.js`, are provided to interact with the store. Since we consider the app state to be quite simple we decided to use single a monolithic reducer and a single set of thunks.

## Building and running

View and run the code using CodeSandbox.

[![Edit gracious-orla-od7kji](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/gracious-orla-od7kji?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=light)

...or clone this repository and run locally.

> **NOTE** Google Map API and [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) requires your app to be served over HTTPS and from domain other than `localhost`.

```
# git clone <this_repo_url> appfxn-exercise-01
# cd appfxn-exercise-01
# npm install
# npm start

```

Be sure to view and edit `config.js` to adjust things like Google Map's API key, local storage prefix, etc.
