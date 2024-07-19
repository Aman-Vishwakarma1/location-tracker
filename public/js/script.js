const socket = io("https://location-tracker3.vercel.app/");

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
      console.log(latitude, "--", longitude);
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 20);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Aman Vishwakarma Maps",
}).addTo(map);

const marker = {};

socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 20);

  if (marker[id]) {
    marker[id].setLatLng;
    [latitude, longitude];
  } else {
    marker[id] = L.marker([latitude, longitude], 20).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (marker[id]) {
    map.removeLayer(marker.id);
    delete marker[id];
  }
});
