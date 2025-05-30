# servicio-social-front
![image](https://github.com/user-attachments/assets/40308a31-9d9e-4a29-a493-a5ec303fa990)

---

## Descripción

Aplicación web para el programa de servicio social de la Universidad Modelo. Esta aplicación permite gestionar información relacionada con viviendas o propiedades.

Nuestro servicio social fue crear una plataforma de renta de casas que nuestra institucion pudiera utilizar. Este es el repositorio del sitio web. Todo el back-end esta dentro de otro repositorio, `servicio-social-back`

Si se hacen cambios, estos se actualizan automaticamente en las instancias de la nube.

## Tech Stack

-   **Frontend:** HTML, CSS (Sass), JavaScript
-   **Frameworks/Libraries:** Bootstrap 5
-   **Servidor Web:** Nginx (para servir archivos estáticos)
-   **Contenerización:** Docker


## Cómo Ejecutar el Proyecto

Este proyecto está configurado para ser ejecutado utilizando Docker.

1.  **Construir la imagen Docker:**
    Asegúrate de tener Docker instalado y corriendo. Desde la raíz del proyecto (donde se encuentra el `dockerfile` principal), ejecuta:
    ```bash
    docker build -t servicio-social-app .
    ```

2.  **Ejecutar el contenedor:**
    Una vez construida la imagen, puedes ejecutarla con:
    ```bash
    docker run -d -p 8080:80 servicio-social-app
    ```
    Esto iniciará la aplicación y la hará accesible en `http://localhost:8080/pages/index.html` en tu navegador.


