# E-Commerce-Application
Plataforma E-Commerce desenvolvida em Express e Next.js, o banco de dados utilizado é o Postgresql. Nessa aplicação o usuário consegue cadastrar, buscar, deletar seus produtos, ver a categoria de um produto, as imagens dele. Consegue relacionar ao número de pedidos que o cliente está fazendo, e muitas outras características complexas.

## Visão geral das Entidades(Tabelas)

Usuários (com rôles de ADMIN/CUSTOMER).

Endereços (vários endereços por usuário).

Produtos (podem ter várias categorias via relação many-to-many).

Categorias (cada categoria pode ter vários produtos).

Imagens de produtos (várias por produto).

Pedidos e Itens de pedido (um pedido pode ter vários itens).

Enums para organizar papéis de usuário e status do pedido.

## Backend(Express, Typescript, JWT, Bcrypt, Prisma)
Vamos para os passos para a inicialização do backend

1 - Inicie o Arquivo package.json

```
$ npm init -y
```

2 - Instalar as depêndencias
```
$ npm install express cors pg jsonwebtoken bcryptjs

$ npm install --save-dev typescript ts-node @types/express @types/nodemon @types/cors @types/jsonwebtoken @types/bcryptjs
```

3 - Configurar o Typescript (tsconfig.json)

Vamos criar o arquivo **tsconfig.json** na raiz do projeto, você pode ver o conteúdo dele lá no arquivo.

4 - Estrutura das Pastas

ecommerce-backend/

├─ .env                 // Variáveis de ambiente (DATABASE_URL, etc.)

├─ .gitignore           // Ignora node_modules, dist, .env, etc.

├─ package.json         // Dependências e scripts

├─ tsconfig.json        // Configurações do TypeScript

├─ prisma/

│  ├─ schema.prisma     // Definição dos modelos do banco via Prisma

│  └─ migrations/       // Migrations geradas automaticamente pelo Prisma

├─ src/

│  ├─ controllers/

│  │  ├─ product.controller.ts

│  │  ├─ user.controller.ts

│  │  └─ order.controller.ts

│  ├─ db/

│  │  └─ prisma.ts      // Instância do PrismaClient, conexão com Postgres

│  ├─ routes/

│  │  ├─ product.routes.ts

│  │  ├─ user.routes.ts

│  │  └─ order.routes.ts

│  ├─ services/

│  │  ├─ product.service.ts

│  │  ├─ user.service.ts

│  │  └─ order.service.ts

│  ├─ middlewares/

│  │  └─ auth.middleware.ts  // Exemplos de middleware de autenticação

│  ├─ utils/

│  │  └─ helpers.ts     // Funções utilitárias ou de formatação

│  ├─ index.ts          // Configuração principal do app (Express, middlewares)

│  └─ server.ts         // Ponto de entrada para subir o servidor

└─ ...




5 - Criar um servidor Express básico(index.ts para exportar e server.ts )

6 - Rodar o em modo de desenvolvimento

No package.json em **scripts**, adicione:

{

  "scripts": {
  
    "dev": "nodemon --watch src --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
    
  }
  
}

7 - Iniciar o servidor com **npm run dev**.

## Configurar a conexão do Postgresql com o Prisma

1 - Instale as dependências do Prisma.

```
$ npm install prisma @prisma/client

$ npx prisma init
```

Isso cria um arquivo **.env** e a pasta **prisma/**

2 - No arquivo **.env** coloque sua string de conexão do Postgres

`DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco`

3 - No arquivo **prisma/schema.prisma**, defina seus modelos

4 - Gere o cliente e crie as tabelas:

```
$ npx prisma migrate dev --name init

$ npx prisma generate
```

5 - Crie um arquivo src/db/prisma.ts para inicializar o prisma para poder usar nos arquivos services.

## Frontend
