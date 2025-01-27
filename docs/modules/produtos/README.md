# Módulo de Produtos

## Estrutura Técnica

### Frontend
- **Localização**: `/frontend/src/pages/Produtos`
- **Componentes Principais**:
  - `ListaProdutos.tsx`: Grid de produtos com ações CRUD
  - `FormProduto.tsx`: Formulário de criação/edição
  - `DetalheProduto.tsx`: Visualização detalhada

### Backend
- **Localização**: `/backend/src/routes/produtos.js`
- **Modelo Prisma**: 
```prisma
model Produto {
  id          Int       @id @default(autoincrement())
  nome        String
  descricao   String?
  preco       Float
  quantidade  Int      @default(0)
  valor       Float?    
  categoriaId Int
  categoria   Categoria @relation(fields: [categoriaId], references: [id])
  movimentacoes Movimentacao[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Endpoints da API
- `GET /api/produtos`: Lista todos os produtos
- `GET /api/produtos/:id`: Busca produto por ID
- `POST /api/produtos`: Cria novo produto
- `PUT /api/produtos/:id`: Atualiza produto existente
- `DELETE /api/produtos/:id`: Remove produto

### Integrações
- Relacionamento com Categorias (N:1)
- Relacionamento com Movimentações (1:N)
- Validações de estoque

### Estado (React Query)
```typescript
const { data: produtos, isLoading } = useQuery(
  'produtos',
  () => produtosService.listar()
);
```

### Mutations
```typescript
const createMutation = useMutation(
  (produto) => produtosService.criar(produto)
);
```

## Funcionalidades
- Listagem com paginação
- Filtros por categoria
- CRUD completo
- Validações de formulário
- Feedback visual de ações
- Loading states
- Tratamento de erros

## Fluxo de Dados
1. Listagem carrega produtos do backend
2. Formulário envia dados para API
3. API valida e persiste no banco
4. Cache do React Query é invalidado
5. Lista é atualizada automaticamente

## Melhorias Futuras
- [ ] Paginação no servidor
- [ ] Filtros avançados
- [ ] Upload de imagens
- [ ] Histórico de alterações 