// Constantes y elementos del DOM
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const selectFileButton = document.getElementById("selectFileButton");
const previewContainer = document.createElement("div");
const gallery = document.getElementById("previewContainer");
const sendDataButton = document.querySelector(".send-data");

let tempId = null;

// Configuración inicial del contenedor de previsualización
previewContainer.style.display = "flex";
previewContainer.style.flexWrap = "wrap";
previewContainer.style.marginTop = "20px";
dropZone.appendChild(previewContainer);

// Crear el tempId cuando la página cargue
window.onload = createTempId;

// Event listeners
selectFileButton.addEventListener("click", handleSelectFileButtonClick);
dropZone.addEventListener("dragover", handleDragOver);
dropZone.addEventListener("dragleave", handleDragLeave);
dropZone.addEventListener("drop", handleDrop);
fileInput.addEventListener("change", handleFileInputChange);
sendDataButton.addEventListener("click", handleSendDataButtonClick);

// Funciones principales
async function createTempId() {
  try {
    const response = await fetch("http://servicio.runefx.org/image/upload", {
      method: "POST",
    });

    if (!response.ok) throw new Error("No se pudo crear el ID temporal.");

    const data = await response.json();
    tempId = data.tempId;
    console.log("ID temporal creado: ", tempId);
  } catch (error) {
    console.error("Error al crear el ID temporal: ", error);
  }
}

function handleSelectFileButtonClick(event) {
  event.preventDefault();
  fileInput.click();
}

function handleDragOver(event) {
  event.preventDefault();
  dropZone.classList.add("dragover");
}

function handleDragLeave() {
  dropZone.classList.remove("dragover");
}

function handleDrop(event) {
  event.preventDefault();
  dropZone.classList.remove("dragover");
  const files = Array.from(event.dataTransfer.files);
  handleFiles(files);
}

function handleFileInputChange(event) {
  const files = Array.from(event.target.files);
  handleFiles(files);
}

function handleFiles(files) {
  if (!tempId) {
    alert("Por favor, recargue la página.");
    return;
  }
  console.log("files", files);
  // Disable the button as soon as files are being processed
  sendDataButton.disabled = true;
  sendDataButton.textContent = "Subiendo imágenes...";

  const formData = new FormData();
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      formData.append("images", file);
      previewImage(file);
    } else {
      alert("Solamente se permiten imágenes archivos .jpeg o .png");
    }
  });

  uploadImages(formData);
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = document.createElement("img");
    img.src = event.target.result;
    img.alt = file.name;
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.objectFit = "cover";
    img.style.margin = "10px";
    img.style.border = "1px solid #ccc";
    img.style.borderRadius = "8px";
    previewContainer.appendChild(img);
  };
  reader.readAsDataURL(file);
}

sendDataButton.disabled = true;

async function uploadImages(formData) {
  if (!tempId) {
    alert("ID temporal no creado, recarga la página.");
    return;
  }

  sendDataButton.disabled = true;
  sendDataButton.textContent = "Subiendo imágenes...";

  try {
    const response = await fetch(
      `http://servicio.runefx.org/image/upload/${tempId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Falló la subida de imágenes:", errorText);
      sendDataButton.disabled = true;   
      sendDataButton.textContent = "Enviar datos";
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("Respuesta:", data);

    if (data.images) {
      sendDataButton.disabled = false;
      sendDataButton.textContent = "Enviar datos";
      console.log("Botón 'send-data' habilitado.");
    } else {
      console.error("No hay imágenes dentro del servidor.");
      sendDataButton.disabled = true;
      sendDataButton.textContent = "Enviar datos";
    }
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    sendDataButton.disabled = true;
    sendDataButton.textContent = "Enviar datos";
  }
}

async function handleSendDataButtonClick(event) {
  event.preventDefault();

  sendDataButton.disabled = true;

  const owner = getOwnerData();
  const house = getHouseData();
  const services = getServicesData();
  const listing = getListingData();

  const requestData = { tempId, owner, house, services, listing };

  try {
    const response = await fetch("http://servicio.runefx.org/listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Error desconocido");
    }

    const data = await response.json();

    if (data.success) {
      alert("Listado creado exitosamente.");
      window.location.href = "../pages/index.html";
    } else {
      alert("Listado creado exitosamente.");
      window.location.href = "../pages/index.html";
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    alert("Algo salió mal: " + error.message);
    // window.location.href = "../pages/index.html";
  } finally {
    sendDataButton.disabled = false;
  }
}

// Funciones auxiliares para obtener datos del formulario
function getOwnerData() {
  return {
    firstName: document.querySelector('input[name="nombre"]').value,
    lastName: document.querySelector('input[name="apellidos"]').value,
    email: document.querySelector('input[name="email"]').value,
    telephone: document.querySelector('input[name="telefono"]').value,
  };
}

function getHouseData() {
  return {
    type:
      document.querySelector('input[name="tipo_alojamiento"]:checked')?.value ||
      "",
    isLookingForRoommate:
      document.querySelector('input[name="con_roomie"]')?.checked || false,
    isOnlyWomen:
      document.querySelector('input[name="solo_mujeres"]')?.checked || false,
    price:
      parseFloat(document.querySelector('input[name="precio"]').value) || 0,
    street: document.querySelector('input[name="calle"]').value,
    postalCode: document.querySelector('input[name="codigo_postal"]').value,
    crossings: document.querySelector('input[name="cruzamientos"]').value,
    colony: document.querySelector('input[name="colonia"]').value,
  };
}

function getServicesData() {
  return Array.from(
    document.querySelectorAll('input[name="servicios"]:checked')
  ).map((input) => input.value);
}

function getListingData() {
  return {
    title: document.querySelector('input[name="title"]').value,
    description: document.querySelector('textarea[name="description"]').value,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const radioGroups = document.querySelectorAll(".radio-group");

  radioGroups.forEach((group) => {
    const radios = group.querySelectorAll('input[type="radio"]');

    radios.forEach((radio) => {
      radio.addEventListener("click", (event) => {
        const currentRadio = event.target;

        if (currentRadio.checked && currentRadio.dataset.checked === "true") {
          currentRadio.checked = false;
          currentRadio.dataset.checked = "false";
        } else {
          currentRadio.dataset.checked = "true";
        }

        radios.forEach((r) => {
          if (r !== currentRadio) {
            r.dataset.checked = "false";
          }
        });
      });
    });
  });
});
