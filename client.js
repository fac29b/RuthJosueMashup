// Client-side code (browser):
let longitude;
let latitude;
const updateGeolocation = () =>
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("geolocation success");
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;
      fetch(`/weather?lon=${longitude}&lat=${latitude}`);
    },
    () => {
      console.log("geolocation error");
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );

updateGeolocation();
