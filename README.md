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
