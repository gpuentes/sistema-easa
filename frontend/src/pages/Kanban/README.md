# Módulo Kanban

## Estrutura Técnica

### Frontend

#### Localização dos Componentes
```
src/pages/Kanban/
├── KanbanBoard.tsx        # Componente principal do quadro
├── KanbanCard.tsx         # Componente de card individual
└── components/
    ├── CardForm.tsx       # Formulário de criação/edição
    ├── Column.tsx         # Coluna do quadro
    └── CardDetails.tsx    # Modal de detalhes do card
```

#### Componentes Principais

##### KanbanBoard
- Gerencia o estado global do quadro
- Implementa drag and drop entre colunas
- Integra com backend via React Query
- Responsivo e adaptável

##### KanbanCard
- Renderiza cards individuais
- Suporta diferentes tipos (cores)
- Exibe informações resumidas
- Permite ações rápidas

### Backend

#### Modelo Prisma
```prisma
model KanbanCard {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  type        String   // 'improvement' | 'implementation' | 'bug' | 'feature'
  status      String   // 'parkingLot' | 'todo' | 'inProgress' | 'done' | 'history'
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("kanban_cards")
}
```

#### Endpoints da API

```typescript
// GET /api/kanban
// Lista todos os cards
interface ListParams {
  status?: string;
  type?: string;
}

// POST /api/kanban
// Cria novo card
interface CreateCard {
  title: string;
  description: string;
  type: 'improvement' | 'implementation' | 'bug' | 'feature';
  status: 'parkingLot' | 'todo' | 'inProgress' | 'done' | 'history';
}

// PUT /api/kanban/:id
// Atualiza card existente
interface UpdateCard {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
}

// DELETE /api/kanban/:id
// Remove card
```

### Integrações

#### React Beautiful DnD
- Drag and drop suave
- Reordenação automática
- Animações de transição
- Acessibilidade

#### Material-UI
- Componentes estilizados
- Temas consistentes
- Ícones e cores
- Responsividade

### Gerenciamento de Estado

#### React Query
```typescript
// Queries
const { data: cards = [], isLoading } = useQuery(
  'kanban-cards',
  () => kanbanService.listar()
);

// Mutations
const createMutation = useMutation(
  (card: CreateCard) => kanbanService.criar(card),
  {
    onSuccess: () => {
      queryClient.invalidateQueries('kanban-cards');
    }
  }
);

const updateMutation = useMutation(
  ({ id, ...data }: UpdateCard & { id: number }) => 
    kanbanService.atualizar(id, data),
  {
    onSuccess: () => {
      queryClient.invalidateQueries('kanban-cards');
    }
  }
);
```

### Validações

#### Frontend
- Título obrigatório
- Descrição com limite de caracteres
- Tipo válido
- Status válido

#### Backend
- Validações duplicadas
- Sanitização de inputs
- Verificação de existência
- Controle de concorrência

### Funcionalidades

#### Implementadas
- [x] CRUD completo de cards
- [x] Drag and drop entre colunas
- [x] Persistência no banco
- [x] Diferentes tipos de cards
- [x] Coluna de histórico
- [x] Validações em tempo real
- [x] Feedback visual
- [x] Responsividade

#### Futuras
- [ ] Filtros por tipo
- [ ] Busca por texto
- [ ] Labels customizadas
- [ ] Anexos
- [ ] Comentários
- [ ] Atribuição a usuários
- [ ] Datas de entrega
- [ ] Templates de cards

### Cores e Tipos

```typescript
const cardTypes = {
  improvement: {
    label: 'Melhoria',
    color: '#4CAF50' // Verde
  },
  implementation: {
    label: 'Implementação',
    color: '#2196F3' // Azul
  },
  bug: {
    label: 'Bug',
    color: '#F44336' // Vermelho
  },
  feature: {
    label: 'Funcionalidade',
    color: '#FF9800' // Laranja
  }
};
```

### Colunas do Quadro

```typescript
const columns = [
  {
    id: 'parkingLot',
    title: 'Parking Lot',
    cards: [] // Filtrado por status
  },
  {
    id: 'todo',
    title: 'A Fazer',
    cards: []
  },
  {
    id: 'inProgress',
    title: 'Em Progresso',
    cards: []
  },
  {
    id: 'done',
    title: 'Concluído',
    cards: []
  },
  {
    id: 'history',
    title: 'Histórico',
    cards: []
  }
]; 