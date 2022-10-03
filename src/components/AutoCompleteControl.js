import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MapControl from "./MapControl";
import { jumpToPlace } from "../utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import Box from "@mui/material/Box";

export default function AutoCompleteControl({
  map,
  position = window.google.maps.ControlPosition.TOP_LEFT,
  children,
  ...options
}) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [autoComplete, setAutoComplete] = useState();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (map && inputRef.current && !autoComplete) {
      const ac = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place && (!place.geometry || !place.geometry.location)) return;
        jumpToPlace(map, place);
        dispatch({ type: "history/place_added", payload: { place } });
        inputRef.current.focus();
      });

      // Keep the Autocomplete reference in component's
      // state so that next render wont need to recreate it
      setAutoComplete(ac);
    }
  }, [map, autoComplete, options]);

  const toggleHistoryPanelClicked = (ev) => {
    dispatch({ type: "history_panel_toggled" });
  };

  return (
    <MapControl map={map} position={position} className="map-control">
      <Card sx={{ minWidth: "33vw", maxWidth: "33vw" }}>
        <CardContent>
          {/* TODO replace <input> with MUI component */}
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <TextField
              sx={{ flexGrow: 1 }}
              variant="outlined"
              label="Search places..."
              inputRef={inputRef}
            />
            <IconButton
              sx={{ flexGrow: 0 }}
              onClick={toggleHistoryPanelClicked}
            >
              <YoutubeSearchedForIcon />
            </IconButton>
          </Box>
          {children}
        </CardContent>
      </Card>
    </MapControl>
  );
}
