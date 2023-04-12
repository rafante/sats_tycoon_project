# Utilize uma imagem base leve com suporte ao Node.js
FROM node:16-alpine

# Crie uma pasta para o aplicativo e defina-a como diretório de trabalho
WORKDIR /app

# Copie package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm ci

# Copie o arquivo .env para o diretório de trabalho
COPY .env ./

# Copie o código do aplicativo para o diretório de trabalho
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Transpile TypeScript para JavaScript
RUN npm run build

# Exponha a porta que o aplicativo utilizará
EXPOSE 3000

# Inicie o aplicativo
CMD ["node", "dist/index.js"]