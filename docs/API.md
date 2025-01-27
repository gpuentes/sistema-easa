# Documentação da API

## Base URL
`http://localhost:3000/api`

## Endpoints

### Produtos

#### GET /produtos
Lista todos os produtos com paginação.

**Query Parameters:**
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Itens por página (default: 10)
- `search` (opcional): Busca por nome

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Produto 1",
      "descricao": "Descrição do produto",
      "preco": 99.99,
      "quantidade": 100,
      "categoriaId": 1
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### GET /produtos/:id
Busca um produto específico.

**Response:**
```json
{
  "id": 1,
  "nome": "Produto 1",
  "descricao": "Descrição do produto",
  "preco": 99.99,
  "quantidade": 100,
  "categoriaId": 1
}
```

#### POST /produtos
Cria um novo produto.

**Request Body:**
```json
{
  "nome": "Novo Produto",
  "descricao": "Descrição do produto",
  "preco": 99.99,
  "quantidade": 100,
  "categoriaId": 1
}
```

#### PUT /produtos/:id
Atualiza um produto existente.

**Request Body:**
```json
{
  "nome": "Produto Atualizado",
  "descricao": "Nova descrição",
  "preco": 149.99,
  "quantidade": 200,
  "categoriaId": 2
}
```

#### DELETE /produtos/:id
Remove um produto.

### Categorias

#### GET /categorias
Lista todas as categorias.

**Query Parameters:**
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `search` (opcional): Busca por nome

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Categoria 1",
      "descricao": "Descrição da categoria"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10
}
```

#### GET /categorias/:id
Busca uma categoria específica.

#### POST /categorias
Cria uma nova categoria.

**Request Body:**
```json
{
  "nome": "Nova Categoria",
  "descricao": "Descrição da categoria"
}
```

#### PUT /categorias/:id
Atualiza uma categoria.

#### DELETE /categorias/:id
Remove uma categoria.

### Movimentações (Em Desenvolvimento)

#### GET /movimentacoes
Lista todas as movimentações.

#### POST /movimentacoes
Registra uma nova movimentação.

**Request Body:**
```json
{
  "tipo": "ENTRADA",
  "produtoId": 1,
  "quantidade": 50,
  "observacao": "Recebimento de mercadoria"
}
```

### Relatórios (Em Desenvolvimento)

#### GET /relatorios/estoque
Gera relatório de estoque.

#### GET /relatorios/movimentacoes
Gera relatório de movimentações.

## Erros

A API retorna os seguintes códigos de erro:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campos inválidos",
    "details": [
      {
        "field": "nome",
        "message": "Nome é obrigatório"
      }
    ]
  }
}
```

### Códigos de Status
- 200: Sucesso
- 201: Criado
- 400: Erro de validação
- 404: Não encontrado
- 500: Erro interno

## Autenticação (Planejado)

A API utilizará autenticação JWT:

```
Authorization: Bearer <token>
```

## Rate Limiting

- 100 requisições por minuto por IP
- Headers de resposta incluem X-RateLimit-*

## Versionamento

A API está na versão 1.0. Futuras versões serão acessadas via:
`/api/v2/...`

## Ambiente de Desenvolvimento

1. Instale as dependências:
```bash
npm install
```

2. Configure o .env:
```
DATABASE_URL="file:./dev.db"
PORT=3000
```

3. Execute as migrações:
```bash
npx prisma migrate dev
```

4. Inicie o servidor:
```bash
npm run dev
```

## Testes

Execute os testes:
```bash
npm test
```

## Deployment

1. Build do projeto:
```bash
npm run build
```

2. Inicie em produção:
```bash
npm start
``` 