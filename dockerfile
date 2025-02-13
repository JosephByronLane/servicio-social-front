# Usa la imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Instala http-server globalmente
RUN npm install -g http-server

# Expone el puerto 8080
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["http-server", "app", "-p", "8080"]
