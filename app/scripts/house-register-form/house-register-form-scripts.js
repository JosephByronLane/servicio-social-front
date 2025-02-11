const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const button = document.getElementById("selectFileButton");
const previewContainer = document.createElement("div");
const gallery = document.getElementById("previewContainer");

previewContainer.style.display = "flex";
previewContainer.style.flexWrap = "wrap";
previewContainer.style.marginTop = "20px";
dropZone.appendChild(previewContainer);

let tempId = null;

document
  .querySelectorAll(".housing-extra-options input[type='radio']")
  .forEach((radio) => {
    radio.addEventListener("click", function (e) {
      if (this.checked) {
        if (this.dataset.clicked === "true") {
          this.checked = false; // Uncheck if clicked again
          this.dataset.clicked = "false";
        } else {
          this.dataset.clicked = "true"; // Mark as clicked once
        }
      }
    });
  });

// Create the tempId when the page loads
async function createTempId() {
  try {
    const response = await fetch("http://servicio.runefx.org/image/upload", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to create tempId");
    }

    const data = await response.json();
    tempId = data.tempId;
    console.log("Temp ID created:", tempId);
  } catch (error) {
    console.error("Error creating tempId:", error);
  }
}

window.onload = createTempId;

button.addEventListener("click", (event) => {
  event.preventDefault();
  fileInput.click();
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover");
  const files = Array.from(event.dataTransfer.files);
  handleFiles(files);
});

fileInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);
  handleFiles(files);
});

function handleFiles(files) {
  if (!tempId) {
    alert("Temp ID not created yet. Please reload the page.");
    return;
  }

  const formData = new FormData();

  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      formData.append("images", file); // Key should match backend expectation

      // Preview the image
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
    } else {
      console.error("Only images are allowed!");
    }
  });

  console.log("FormData content before upload:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  uploadImages(formData);
}

async function uploadImages(formData) {
  if (!tempId) {
    alert("Temp ID not created yet. Please reload the page.");
    return;
  }

  try {
    const response = await fetch(
      `http://servicio.runefx.org/image/upload/${tempId}`,
      {
        method: "POST",
        body: formData, // Don't set Content-Type; the browser sets it automatically for FormData
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Read the error response
      console.error("Image upload failed:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("Server response:", data);

    if (data.images) {
      // displayImages(data.images);
    } else {
      console.error("No images returned from server.");
    }
  } catch (error) {
    console.error("Error uploading images:", error);
  }
}

document
  .querySelector(".send-data")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const owner = {
      firstName: document.querySelector('input[name="nombre"]').value,
      lastName: document.querySelector('input[name="apellidos"]').value,
      email: document.querySelector('input[name="email"]').value,
      telephone: document.querySelector('input[name="telefono"]').value,
    };

    const house = {
      type:
        document.querySelector('input[name="tipo_alojamiento"]:checked')
          ?.value || "",
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

    const services = Array.from(
      document.querySelectorAll('input[name="servicios"]:checked')
    ).map((input) => input.value);

    const listing = {
      title: document.querySelector('input[name="title"]').value,
      description: document.querySelector('textarea[name="description"]').value,
    };

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
        throw new Error(errorData.message || "Unknown error");
      }

      const data = await response.json();

      if (data.success) {
        alert("House registered successfully!");
        window.location.href = "../pages/index.html"; // Redirección tras éxito
      } else {
        alert(data.message);
        window.location.href = "../pages/index.html";
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Something went wrong: " + error.message);
      window.location.href = "../pages/index.html";
    }
  });
