# Use the official Nginx image
FROM nginx:alpine

# Copy your custom configuration into Nginx’s configuration directory

# Copy the entire app folder into Nginx's web root
# (Assuming your Dockerfile is in the root folder and your app folder is also here)
COPY app/ /usr/share/nginx/html/

# Expose port 80 (Nginx default)
EXPOSE 80
