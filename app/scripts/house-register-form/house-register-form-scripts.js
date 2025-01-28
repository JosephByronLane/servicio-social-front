const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

// Create a container for thumbnails
const previewContainer = document.createElement("div");
previewContainer.style.display = "flex";
previewContainer.style.flexWrap = "wrap";
previewContainer.style.marginTop = "20px";
dropZone.appendChild(previewContainer);

// Handle click to trigger file input
dropZone.addEventListener("click", () => {
  fileInput.click();
});

// Handle drag over
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault(); // Prevent default to allow drop
  dropZone.classList.add("dragover");
});

// Handle drag leave
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

// Handle file drop
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover");

  const files = Array.from(event.dataTransfer.files);
  handleFiles(files);
});

// Handle file selection from input
fileInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);
  handleFiles(files);
});

// Process and preview files
function handleFiles(files) {
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      // Generate the image preview
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
}
