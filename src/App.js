import "./styles.css";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useSelector } from "react-redux";
import Map from "./components/Map";
import AutoCompleteControl from "./components/AutoCompleteControl";
import PlaceHistoryControl from "./components/PlaceHistoryControl";

import config from "./config";

export default function App() {
  const historyPanelVisible = useSelector((state) => state.historyPanelVisible);

  return (
    <div id="app">
      <Wrapper
        render={(status) => <h1>{status}</h1>}
        apiKey={config.maps.apiKey}
        libraries={config.maps.libraries}
      >
        <Map
          id="map"
          style={{ flexGrow: "1", height: "100%" }}
          {...config.maps.options}
        >
          <AutoCompleteControl />
          <PlaceHistoryControl
            style={{ display: historyPanelVisible ? "block" : "none" }}
          />
        </Map>
      </Wrapper>
    </div>
  );
}
