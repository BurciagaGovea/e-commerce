# Usa Node.js versión 18 con Alpine (ligero)
FROM node:18-alpine 

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias (sin las de desarrollo)
RUN npm install --omit=dev

# Copia el resto del código
COPY . .

# Instala netcat para el script de espera
RUN apk add --no-cache netcat-openbsd

# Copia el script para esperar a MySQL
COPY wait-for-services.sh /wait-for-services.sh
RUN chmod +x /wait-for-services.sh

# Expone el puerto 3000
EXPOSE 3000

# Comando de inicio
CMD ["/wait-for-services.sh", "node", "index.js"]