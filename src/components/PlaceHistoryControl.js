import { useDispatch, useSelector } from "react-redux";
import MapControl from "./MapControl";
import { jumpToPlace } from "../utils";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function PlaceHistoryControl({
  map,
  position = window.google.maps.ControlPosition.TOP_RIGHT,
  children,
  style,
  ...options
}) {
  const places = useSelector((state) => state.placeHistory);
  const dispatch = useDispatch();

  const onRemoveButtonClicked = (ev, index) => {
    dispatch({ type: "history/place_removed", payload: { index } });
  };

  const onRemoveAllButtonClicked = (ev) => {
    dispatch({ type: "history/all_place_removed" });
  };

  const onPlaceClicked = (ev, index) => {
    const place = index >= 0 && index < places.length ? places[index] : null;
    if (!place) return;
    if (!place.geometry || !place.geometry.location) return;
    jumpToPlace(map, place);
  };

  return (
    <MapControl map={map} position={position} style={style}>
      <Card sx={{ minWidth: "33vw", maxWidth: "33vw" }}>
        <CardHeader title="Search history"></CardHeader>
        <CardContent sx={{ backgroundColor: "whitesmoke" }}>
          {places.length > 0 ? (
            <List dense={true}>
              {places.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      onClick={(ev) => onRemoveButtonClicked(ev, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
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
        <CardActions>
          <IconButton
            onClick={onRemoveAllButtonClicked}
            disabled={places.length === 0}
          >
            <DeleteSweepIcon />
          </IconButton>
        </CardActions>
      </Card>
    </MapControl>
  );
}
