const google = window.google;

export const distanceToMouse = (pt, mousePos, markerProps) => {
    // console.log(pt, mousePos, markerProps);
    // this fixed the current bug in the library version 1.1.7
  
  
    // pt can be undefined in some cases
    // don't know why this happens
    if (pt && mousePos) {
      return Math.sqrt(
        (pt.x - mousePos.x) * (pt.x - mousePos.x) +
          (pt.y - mousePos.y) * (pt.y - mousePos.y)
      );
    }
  };
  
  // Return map bounds based on list of places
  export const getMapBounds = (places) => {
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      bounds.extend(new google.maps.LatLng(
        place.location.lat,
        place.location.lng,
      ));
    });
    return bounds;
  };
  
  // Re-center map when resizing the window
  export const bindResizeListener = (map, maps, bounds) => {
    maps.event.addDomListenerOnce(map, 'idle', () => {
      maps.event.addDomListener(window, 'resize', () => {
        map.fitBounds(bounds);
      });
    });
  };
  
  // Fit map to its bounds after the api is loaded
  export const  apiIsLoaded = (map, maps, places) => {
    // Get bounds by our places
    const bounds = getMapBounds(places);

    if (places.length > 0){
        // Fit map to bounds
        map.fitBounds(bounds);
    }
    // Bind the resize listener
    bindResizeListener(map, maps, bounds);
  };
  