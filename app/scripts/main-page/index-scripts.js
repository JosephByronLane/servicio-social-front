document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggle-button");
  const housingTypeButtons = document.querySelectorAll(".housing-type-button");
  const searchForm = document.querySelector(".search-bar");
  const minPriceInput = document.querySelector(".min-price input");
  const maxPriceInput = document.querySelector(".max-price input");
  const filterButtons = document.querySelectorAll(".toggle-button");
  const houseImagesContainer = document.querySelector(".house-images");

  const IMAGE_BASE_URL = "http://servicio.runefx.org/";

  const serviceMapping = {
    Agua: "water",
    Luz: "electricity",
    Internet: "internet",
    Amueblado: "furnishings",
    Estacionamiento: "parking",
    "Recolección de basura": "garbage collection",
    "Pet friendly": "pet friendly",
    Limpieza: "cleaning service",
    Lavado: "washing service",
    "Áreas comunes": "communal areas",
    Comida: "food",
  };

  let filters = {
    title: "",
    type: null,
    minPrice: null,
    maxPrice: null,
    services: [],
    isLookingForRoommate: null,
    isOnlyWomen: null,
    sort: "newest",
    paging: false,
    page: 1,
    pageSize: 10,
  };

  buttons.forEach((button) => {
    const icon = button.querySelector("img");
    const [folderPath, filename] = icon.src.split(/\/(?=[^\/]+$)/);
    const toggledSrc = `${folderPath}/alt_colors/${filename.replace(
      ".png",
      ".svg"
    )}`;

    button.addEventListener("click", () => {
      const isActive = button.classList.toggle("active");
      icon.src = isActive ? toggledSrc : `${folderPath}/${filename}`;
      button.style.backgroundColor = isActive ? "white" : "#061F57";
      button.style.color = isActive ? "#061F57" : "white";
    });
  });

  housingTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.firstChild.textContent.trim().toLowerCase();
      const isActive = button.classList.contains("active");

      housingTypeButtons.forEach((btn) => btn.classList.remove("active"));
      filters.type = isActive ? null : type;

      if (!isActive) button.classList.add("active");
      fetchHouses();
    });
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filters.title = searchForm.querySelector(".search-input").value.trim();
    fetchHouses();
  });

  [minPriceInput, maxPriceInput].forEach((input) => {
    input.addEventListener("change", () => {
      const value = parseFloat(input.value);
      filters[input === minPriceInput ? "minPrice" : "maxPrice"] =
        isNaN(value) || value < 0 ? null : value;
      fetchHouses();
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const serviceId = serviceMapping[button.textContent.trim()];
      if (!serviceId) return;

      filters.services.includes(serviceId)
        ? (filters.services = filters.services.filter((s) => s !== serviceId))
        : filters.services.push(serviceId);

      fetchHouses();
    });
  });

  function fetchHouses() {
    const url = "http://servicio.runefx.org/listing";
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        queryParams.append(key, Array.isArray(value) ? value.join(",") : value);
      }
    });

    fetch(`${url}?${queryParams}`)
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(`Error: ${response.status}`)
      )
      .then((data) => updateUI(data.data))
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        houseImagesContainer.innerHTML = `<p class="error-message">Error al cargar los datos. Inténtalo de nuevo más tarde.</p>`;
      });
  }

  function updateUI(houses) {
    houseImagesContainer.innerHTML =
      houses.length === 0
        ? `<p class="no-results">No se encontraron casas con los filtros seleccionados.</p>`
        : houses
            .map(
              (house) => `
            <div class="house" id="house-details-${house.id}">
                <img src="${
                  house.images.length
                    ? `${IMAGE_BASE_URL}${house.images[0].imageUrl}`
                    : "../assets/default-house.png"
                }" 
                    alt="" id="house-image-${house.id}">
                <h3 id="house-name-${house.id}">${house.title}</h3>
                <h6 id="house-price-${
                  house.id
                }">$${house.house.price.toLocaleString()} MXN al mes</h6>
                <div class="divider"></div>
                <p id="house-description-${house.id}">${truncateText(
                house.description
              )}</p>
            </div>`
            )
            .join("");

    // Agregar los event listeners después de que se hayan renderizado las casas
    houses.forEach((house) => {
      const houseElement = document.getElementById(`house-details-${house.id}`);
      houseElement.addEventListener("click", () => storeHouseId(house.id));
    });
  }

  function storeHouseId(houseId) {
    localStorage.setItem("selectedHouseId", houseId);
    window.location.href = "house-info.html"; // Redirige a la página de detalles
  }

  function truncateText(text, wordLimit = 50) {
    const words = text.split(" ");
    return words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(" ")}...`
      : text;
  }
});
