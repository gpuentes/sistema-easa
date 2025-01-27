# Módulo de Movimentações

## Estrutura Técnica

### Frontend
- **Localização**: `/frontend/src/pages/Movimentacao`
- **Componentes Principais**:
  - `MovimentacaoList.tsx`: Grid de movimentações com ações CRUD
  - `RelatorioMovimentacoes.tsx`: Dashboard com gráficos e métricas

### Backend
- **Localização**: `/backend/src/routes/movimentacoes.js`
- **Modelo Prisma**: 
```prisma
model Movimentacao {
  id          Int      @id @default(autoincrement())
  tipo        String   // 'ENTRADA' ou 'SAIDA'
  quantidade  Int
  data        DateTime @default(now())
  observacao  String?
  produtoId   Int
  produto     Produto  @relation(fields: [produtoId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Endpoints da API
- `GET /api/movimentacoes`: Lista todas as movimentações
- `GET /api/movimentacoes/:id`: Busca movimentação por ID
- `POST /api/movimentacoes`: Cria nova movimentação
- `PUT /api/movimentacoes/:id`: Atualiza movimentação existente
- `DELETE /api/movimentacoes/:id`: Remove movimentação

### Integrações
- Relacionamento com Produtos (N:1)
- Atualização automática de estoque
- Validações de quantidade

### Estado (React Query)
```typescript
const { data: movimentacoes, isLoading } = useQuery(
  'movimentacoes',
  () => movimentacoesService.listar()
);
```

### Mutations
```typescript
const createMutation = useMutation(
  (movimentacao) => movimentacoesService.criar(movimentacao),
  {
    onSuccess: () => {
      queryClient.invalidateQueries('movimentacoes');
      queryClient.invalidateQueries('produtos');
    }
  }
);
```

## Funcionalidades
- Listagem de movimentações
- Registro de entradas e saídas
- Edição e exclusão
- Validações de estoque
- Atualização automática de produtos
- Dashboard com gráficos
  - Movimentações por dia
  - Produtos mais movimentados
  - Totalizadores

## Fluxo de Dados
1. Usuário registra movimentação
2. API valida estoque disponível
3. Transação atualiza movimentação e produto
4. Cache é invalidado
5. Lista e dashboard são atualizados

## Validações
- Quantidade maior que zero
- Estoque suficiente para saídas
- Produto existente
- Campos obrigatórios preenchidos

## Melhorias Futuras
- [ ] Filtros avançados
- [ ] Exportação de relatórios
- [ ] Gráficos personalizáveis
- [ ] Histórico de alterações
- [ ] Agrupamento por período 