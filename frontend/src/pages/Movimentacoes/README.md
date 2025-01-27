# Módulo de Movimentações

## Estrutura Técnica

### Frontend

#### Localização dos Componentes
```
src/pages/Movimentacoes/
├── MovimentacoesPage.tsx       # Página principal de movimentações
├── NovaMovimentacao.tsx        # Formulário de criação
├── EditarMovimentacao.tsx      # Formulário de edição
└── components/
    ├── MovimentacaoForm.tsx    # Componente de formulário reutilizável
    ├── MovimentacaoList.tsx    # Lista de movimentações
    └── MovimentacaoFilters.tsx # Filtros de busca
```

#### Componentes Principais

##### MovimentacoesPage
- Gerencia o estado global da página
- Integra listagem, filtros e ações
- Utiliza React Query para cache e sincronização

##### MovimentacaoForm
- Formulário reutilizável para criação/edição
- Validações em tempo real
- Integração com select de produtos
- Cálculo automático de estoque

### Backend

#### Modelo Prisma
```prisma
model Movimentacao {
  id          Int      @id @default(autoincrement())
  tipo        String   // 'ENTRADA' | 'SAIDA'
  quantidade  Int
  produto     Produto  @relation(fields: [produtoId], references: [id])
  produtoId   Int
  observacao  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("movimentacoes")
}
```

#### Endpoints da API

```typescript
// GET /api/movimentacoes
// Lista todas as movimentações com paginação
interface ListParams {
  page?: number;
  limit?: number;
  tipo?: 'ENTRADA' | 'SAIDA';
  produtoId?: number;
  startDate?: Date;
  endDate?: Date;
}

// POST /api/movimentacoes
// Cria nova movimentação
interface CreateMovimentacao {
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  produtoId: number;
  observacao?: string;
}

// PUT /api/movimentacoes/:id
// Atualiza movimentação existente
interface UpdateMovimentacao {
  quantidade?: number;
  observacao?: string;
}

// DELETE /api/movimentacoes/:id
// Remove movimentação
```

### Integrações

#### Com Produtos
- Atualização automática do estoque
- Validação de quantidade disponível
- Histórico de movimentações por produto

#### Transações
- Uso de transações Prisma para garantir consistência
- Rollback em caso de erro
- Logs de operações críticas

### Gerenciamento de Estado

#### React Query
```typescript
// Queries
const { data, isLoading } = useQuery(
  ['movimentacoes', filters],
  () => movimentacoesService.listar(filters)
);

// Mutations
const createMutation = useMutation(
  (data: CreateMovimentacao) => movimentacoesService.criar(data),
  {
    onSuccess: () => {
      queryClient.invalidateQueries('movimentacoes');
      queryClient.invalidateQueries(['produto', data.produtoId]);
    }
  }
);
```

### Validações

#### Frontend
- Quantidade não pode ser zero ou negativa
- Produto é obrigatório
- Saídas não podem exceder estoque disponível
- Datas de filtro válidas

#### Backend
- Validações duplicadas por segurança
- Verificação de existência do produto
- Controle de concorrência
- Sanitização de inputs

### Funcionalidades

#### Implementadas
- [x] CRUD completo de movimentações
- [x] Filtros por tipo, produto e período
- [x] Atualização automática de estoque
- [x] Validações em tempo real
- [x] Histórico de alterações
- [x] Paginação e ordenação
- [x] Feedback visual de operações
- [x] Tratamento de erros

#### Futuras
- [ ] Exportação de dados
- [ ] Filtros avançados
- [ ] Gráficos por período
- [ ] Notificações de estoque baixo
- [ ] Agendamento de movimentações
- [ ] Anexos e documentos
- [ ] Multi-seleção de produtos
- [ ] Templates de movimentações 