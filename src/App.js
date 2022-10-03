import "./styles.css";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Map from "./components/Map";
import MapControl from "./components/MapControl";
import AutoCompleteControl from "./components/AutoCompleteControl";
import PlaceHistoryControl from "./components/PlaceHistoryControl";
import config from "./config";
import { restoreState } from "./redux/thunks";
import { styled } from "@mui/material/styles";

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          return resolve(location);
        },
        (error) => {
          return reject(error);
        }
      );
    }
  });
}

const MapControlStyled = styled(MapControl)`
  ${({ theme }) => ({
    padding: "5px",
    [theme.breakpoints.down("sm")]: {
      width: "98vw"
    },
    [theme.breakpoints.up("sm")]: {
      width: "33vw",
      maxWidth: "33vw"
    }
  })}
`;

export default function App() {
  const dispatch = useDispatch();
  const historyPanelVisible = useSelector((state) => state.historyPanelVisible);
  const [center, setCenter] = useState(config.maps?.options?.center);

  useEffect(() => {
    dispatch(restoreState());
  }, []);

  useEffect(() => {
    getCurrentLocation()
      .then((pos) => {
        console.log(pos);
        setCenter({
          lat: pos?.coords?.latitude,
          lng: pos?.coords?.longitude
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
          center={center}
        >
          <MapControlStyled>
            <AutoCompleteControl sx={{ mb: "3px" }} />
            {historyPanelVisible ? <PlaceHistoryControl /> : <></>}
          </MapControlStyled>
        </Map>
      </Wrapper>
    </div>
  );
}
