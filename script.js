let map;
let busMarker;
let currentIndex = 0;

// Route coordinates (Uttara → Banani → Mohakhali → Gulshan)
const route = [
  { lat: 23.8748, lng: 90.3984 }, // Uttara
  { lat: 23.8204, lng: 90.4125 }, // Airport Road
  { lat: 23.7961, lng: 90.4043 }, // Banani
  { lat: 23.7803, lng: 90.4116 }, // Mohakhali
  { lat: 23.7890, lng: 90.4175 }  // Gulshan
];

function initMap() {
  const startPos = route[currentIndex];
  map = new google.maps.Map(document.querySelector(".map-box"), {
    zoom: 14,
    center: startPos,
  });

  busMarker = new google.maps.Marker({
    position: startPos,
    map: map,
    title: "BUS-1",
    icon: {
      url: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
      scaledSize: new google.maps.Size(40, 40),
    },
  });

  autoDriveBus();
}

// === Automated movement function ===
function autoDriveBus() {
  setInterval(async () => {
    if (currentIndex < route.length - 1) {
      const current = route[currentIndex];
      const next = route[currentIndex + 1];

      // Animate movement smoothly
      animateMovement(current, next, 50);

      const currentName = await getPlaceName(current.lat, current.lng);
      const nextName = await getPlaceName(next.lat, next.lng);

      updateBusInfo(currentName, nextName);

      currentIndex++;
    } else {
      currentIndex = 0; // পুনরায় শুরু (loop)
    }
  }, 5000);
}

// === Smooth Movement Animation ===
function animateMovement(start, end, steps) {
  let step = 0;
  const latStep = (end.lat - start.lat) / steps;
  const lngStep = (end.lng - start.lng) / steps;

  const interval = setInterval(() => {
    step++;
    const newLat = start.lat + latStep * step;
    const newLng = start.lng + lngStep * step;

    const newPos = { lat: newLat, lng: newLng };
    busMarker.setPosition(newPos);
    map.panTo(newPos);

    if (step >= steps) clearInterval(interval);
  }, 100); // প্রতি 100ms এ আপডেট
}

// === Reverse Geocoding (Place Name) ===
async function getPlaceName(lat, lng) {
  const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results[0]) {
      return data.results[0].formatted_address;
    } else {
      return "Unknown Area";
    }
  } catch (err) {
    console.error("Geocoding Error:", err);
    return "Unavailable";
  }
}

// === Update Info on Page ===
function updateBusInfo(current, next) {
  document.querySelector(".bus-info").innerHTML = `
    <p><strong>Route :</strong> Uttara → Banani → Mohakhali → Gulshan</p>
    <p><strong>Current Location :</strong> ${current}</p>
    <p><strong>Next Stop:</strong> ${next}</p>
    <p><strong>Seat Available :</strong> ${Math.floor(Math.random() * 20)}</p>
    <p><strong>Last Update:</strong> ${new Date().toLocaleTimeString()}</p>
  `;
}
