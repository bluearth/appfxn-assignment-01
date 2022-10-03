import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jumpToPlace } from "../utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import SyncIcon from "@mui/icons-material/Sync";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { persistState, addPlaceHistory } from "../redux/thunks";

export default function AutoCompleteControl({
  sx,
  map,
  position = window.google.maps.ControlPosition.TOP_LEFT,
  children,
  ...options
}) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [autoComplete, setAutoComplete] = useState();
  const [synched, synching] = useSelector((state) => [
    state.synched,
    state.synching
  ]);

  useEffect(() => {
    if (map && inputRef.current && !autoComplete) {
      const ac = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place && (!place.geometry || !place.geometry.location)) return;
        jumpToPlace(map, place);
        dispatch(addPlaceHistory(place));
        inputRef.current.focus();
        inputRef.current.value = "";
      });

      // Keep the Autocomplete reference in component's
      // state so that next render wont need to recreate it
      setAutoComplete(ac);
    }
  }, [map, autoComplete, options]);

  const toggleHistoryPanelClicked = (ev) => {
    dispatch({ type: "history_panel_toggled" });
  };

  const resync = (ev) => {
    dispatch(persistState());
  };

  return (
    <Card sx={{ ...sx, minWidth: "33vw" }}>
      <CardContent>
        {/* TODO replace <input> with MUI component */}
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <TextField
            sx={{ flexGrow: 1 }}
            variant="outlined"
            inputRef={inputRef}
          />
          <IconButton onClick={toggleHistoryPanelClicked} sx={{ mx: 0.5 }}>
            <YoutubeSearchedForIcon />
          </IconButton>
          {synching ? (
            <IconButton sx={{ mx: 0.5 }}>
              <SyncIcon
                sx={{
                  animation: "spin 2s linear infinite",
                  "@keyframes spin": {
                    "0%": {
                      transform: "rotate(360deg)"
                    },
                    "100%": {
                      transform: "rotate(0deg)"
                    }
                  }
                }}
              />
            </IconButton>
          ) : !synched ? (
            <Tooltip title="Failed saving data. Click here to retry.">
              <IconButton onClick={resync} disabled={synching} sx={{ mx: 0.5 }}>
                <SyncProblemIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}
