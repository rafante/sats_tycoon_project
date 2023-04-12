# Escolha uma imagem base com Node.js
FROM node:16-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie o arquivo package.json e package-lock.json (se disponível) para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm ci

# Copie o restante do código para o diretório de trabalho
COPY . .

# Defina o comando para iniciar o serviço
CMD ["npm", "start"]