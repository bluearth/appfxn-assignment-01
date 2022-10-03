import React, { useEffect, useRef } from "react";

export default function MapControl({
  map,
  position = window.google.maps.ControlPosition.TOP_LEFT,
  children,
  style,
  className = "map-control",
  ...options
}) {
  const ref = useRef();

  useEffect(() => {
    if (map && ref.current) {
      let pos = position;
      if (typeof position === "function") {
        pos = position.call(map);
      }
      map.controls[pos].push(ref.current);
    }
  }, [map, position]);

  return (
    <div ref={ref} className={className} style={style}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map, className });
        }
      })}
    </div>
  );
}
