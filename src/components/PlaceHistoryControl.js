import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jumpToPlace } from "../utils";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { removePlaceHistory, removeAllPlaceHistory } from "../redux/thunks";

export default function PlaceHistoryControl({
  map,
  position = window.google.maps.ControlPosition.TOP_RIGHT,
  children,
  style,
  ...options
}) {
  const [synched, synching, places] = useSelector((state) => [
    state.synched,
    state.synching,
    state.placeHistory
  ]);
  const dispatch = useDispatch();
  const [actionVisibleIndex, setActionVisibleIndex] = useState(null);

  const onRemoveButtonClicked = (ev, index) => {
    if (index < 0) return;
    dispatch(removePlaceHistory(index));
  };

  const onRemoveAllButtonClicked = (ev) => {
    dispatch(removeAllPlaceHistory());
  };

  const onPlaceClicked = (ev, index) => {
    const place = index >= 0 && index < places.length ? places[index] : null;
    if (!place) return;
    if (!place.geometry || !place.geometry.location) return;
    jumpToPlace(map, place);
  };

  const onPlaceHover = (ev, index) => {
    setActionVisibleIndex(index);
  };

  const onListMouseLeave = (ev) => {
    setActionVisibleIndex(null);
  };

  return (
    <Card sx={{ minWidth: "33vw" }}>
      <CardHeader
        action={
          <IconButton
            onClick={onRemoveAllButtonClicked}
            disabled={places.length === 0 || synching}
          >
            <DeleteSweepIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ backgroundColor: "whitesmoke" }}>
        {places.length > 0 ? (
          <List
            dense={true}
            onMouseLeave={onListMouseLeave}
            sx={{ maxHeight: "50vh", overflow: "auto" }}
          >
            {places.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    onClick={(ev) => onRemoveButtonClicked(ev, index)}
                    disabled={synching}
                    sx={{
                      display: actionVisibleIndex === index ? "block" : "none",
                      ml: 2
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                onMouseOver={(ev) => onPlaceHover(ev, index)}
              >
                <ListItemButton>
                  <ListItemText onClick={(ev) => onPlaceClicked(ev, index)}>
                    {item.formatted_address}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <center>
            <em>Search history is empty</em>
          </center>
        )}
      </CardContent>
    </Card>
  );
}
