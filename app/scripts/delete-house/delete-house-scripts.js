document.addEventListener("DOMContentLoaded", () => {
  const deleteForm = document.querySelector(".delete-house-listing");

  deleteForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe

    const tokenInput = document.getElementById("delete-token");
    const token = tokenInput.value.trim();

    if (!token) {
      alert("Por favor, ingresa un token válido.");
      return;
    }

    try {
      const response = await fetch(
        `http://servicio.runefx.org/listing/delete/delete?token=${token}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        // Redirigir a la página de éxito si la respuesta es 200
        window.location.href = "http://servicio.runefx.org/deletion.success.html";
      } else {
        // Manejar otros códigos de estado (errores)
        const errorData = await response.json();
        console.error("Error hola:", errorData);
        throw new Error(errorData.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Algo salió mal: " + error.message);
    }
  });
});