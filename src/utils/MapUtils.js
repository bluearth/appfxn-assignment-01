function jumpToPlace(map, place) {
  if (!place.geometry || !place.geometry.location) return;
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
  }
}

export { jumpToPlace };
