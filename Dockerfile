# 1. Folosește imaginea oficială de Node.js ca bază
FROM node:16

# 2. Setează directorul de lucru în container
WORKDIR /usr/src/app

# 3. Copiază fișierele aplicației în container
COPY package*.json ./

# 4. Instalează dependențele aplicației
RUN npm install

# 5. Copiază toate fișierele aplicației (în afară de cele din .dockerignore)
COPY . .

# 6. Expune portul pe care serverul va asculta
EXPOSE 3000

# 7. Comanda pentru a porni aplicația
CMD ["node", "back.js"]