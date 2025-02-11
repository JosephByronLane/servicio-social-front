document.addEventListener("DOMContentLoaded", () => {
  const houseId = localStorage.getItem("selectedHouseId");

  if (houseId) {
    fetchHouseDetails(houseId);
  } else {
    window.location.href = "index.html"; // Redirigir si no hay ID almacenado
  }
});

function fetchHouseDetails(houseId) {
  const url = `http://servicio.runefx.org/listing/${houseId}`;
  console.log(`Fetching house details from: ${url}`);

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (data) {
        console.log("Response Data:", data);
        updateHouseDetails(data);
      } else {
        throw new Error("No data found in response");
      }
    })
    .catch((error) =>
      console.error("Error al obtener los detalles de la casa:", error)
    );
}

function updateHouseDetails(house) {
  document.getElementById("house-title").textContent = house.title;
  document.getElementById("house-description").textContent = truncateText(
    house.description,
    10
  );
  document.getElementById(
    "house-address"
  ).textContent = `${house.house.street}, ${house.house.crossings}, ${house.house.postalCode}`;
  document.getElementById(
    "house-price"
  ).textContent = `$${house.house.price} MXN al mes`;
  document.getElementById("long-description").textContent = house.description;
  document.getElementById(
    "owner-name"
  ).textContent = `${house.house.owner.firstName} ${house.house.owner.lastName}`;
  document.getElementById("owner-mail").textContent = house.house.owner.email;
  document.getElementById("owner-cellphone").textContent =
    house.house.owner.telephone;

  updateCarousel(house.images);
  updateHouseServices(house.house.services);

  localStorage.removeItem("selectedHouseId"); // Borrar el ID después de cargar los detalles
}

function updateCarousel(images) {
  const IMAGE_BASE_URL = "http://servicio.runefx.org/";
  const carouselInner = document.querySelector(".carousel-inner");
  carouselInner.innerHTML = "";

  const sortedImages = images.sort((a, b) => a.id - b.id).slice(0, 10); // Ordenar y limitar imágenes
  const chunkedImages = [];

  for (let i = 0; i < sortedImages.length; i += 5) {
    chunkedImages.push(sortedImages.slice(i, i + 5));
  }

  chunkedImages.forEach((chunk, index) => {
    const isActive = index === 0 ? "active" : "";
    const bigImage = chunk[0];
    const smallImages = chunk.slice(1);

    const slideHTML = `
      <div class="carousel-item ${isActive}">
          <div class="row">
              <div class="col-6">
                  <img src="${IMAGE_BASE_URL}${
      bigImage.imageUrl
    }" class="d-block w-100" 
                    alt="House image ${
                      index + 1
                    }" onclick="openModal('${IMAGE_BASE_URL}${
      bigImage.imageUrl
    }')">
              </div>
              <div class="col-6">
                  <div class="row">
                      ${smallImages
                        .map(
                          (image) => `
                          <div class="col-6">
                              <img src="${IMAGE_BASE_URL}${image.imageUrl}" class="d-block w-100" 
                                alt="Small house image" onclick="openModal('${IMAGE_BASE_URL}${image.imageUrl}')">
                          </div>
                      `
                        )
                        .join("")}
                  </div>
              </div>
          </div>
      </div>
    `;

    carouselInner.innerHTML += slideHTML;
  });
}

function updateHouseServices(services) {
  const serviceIcons = {
    water: "../assets/filter-buttons/mdi_water.svg",
    electricity: "../assets/filter-buttons/material-symbols_lightbulb.svg",
    internet: "../assets/filter-buttons/material-symbols_wifi.svg",
    furnishings: "../assets/filter-buttons/material-symbols_bed.svg",
    parking: "../assets/filter-buttons/mdi_car.svg",
    "garbage collection": "../assets/filter-buttons/mdi_trash.svg",
    "pet friendly": "../assets/filter-buttons/streamline_pet-paw-solid.svg",
    "cleaning service": "../assets/filter-buttons/mdi_broom.svg",
    "washing service": "../assets/filter-buttons/lsicon_clothes-filled.svg",
    "communal areas": "../assets/filter-buttons/material-symbols_pool.svg",
    food: "../assets/filter-buttons/fa6-solid_utensils.svg",
  };

  const serviceNames = {
    water: "Agua",
    electricity: "Luz",
    internet: "Wifi",
    furnishings: "Amueblado",
    parking: "Estacionamiento",
    "garbage collection": "Recolección de basura",
    "pet friendly": "Pet friendly",
    "cleaning service": "Limpieza",
    "washing service": "Lavado",
    "communal areas": "Áreas comunes",
    food: "Comida",
  };

  const container = document.getElementById("house-services");
  if (!container) {
    console.error("El contenedor #house-services no existe en el HTML.");
    return;
  }

  container.innerHTML =
    services
      .map((service) =>
        serviceIcons[service.name] && serviceNames[service.name]
          ? `<p>${serviceNames[service.name]}
        <img src="${serviceIcons[service.name]}" alt="${
              serviceNames[service.name]
            }"/>
      </p>`
          : ``
      )
      .join("") ||
    console.warn("No se encontraron servicios válidos para mostrar.");
}

function openModal(imageSrc) {
  document.getElementById("modalImage").src = imageSrc;
  new bootstrap.Modal(document.getElementById("imageModal")).show();
}

function truncateText(text, maxWords) {
  const words = text.split(" ");
  return words.length > maxWords
    ? words.slice(0, maxWords).join(" ") + "..."
    : text;
}
