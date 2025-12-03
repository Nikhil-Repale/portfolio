# Use lightweight Nginx image
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy your portfolio website files
COPY . /usr/share/nginx/html/

# Expose port 80 for Kubernetes/Docker
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
