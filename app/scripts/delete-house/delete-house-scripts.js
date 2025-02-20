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
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Error desconocido");
      }

      const data = await response.json();

      if (data.success) {
        alert("Listado borrado exitosamente.");
        tokenInput.value = ""; // Limpiar el campo de token
      } else {
        alert(data.message || "No se pudo borrar el listado.");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Algo salió mal: " + error.message);
    }
  });
});
