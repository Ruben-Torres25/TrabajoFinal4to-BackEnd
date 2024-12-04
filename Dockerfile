FROM node:16

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos del backend al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto que usará la app
EXPOSE 8080

# Ejecuta la aplicación
CMD ["npm", "run", "start"]