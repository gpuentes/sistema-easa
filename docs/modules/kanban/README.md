# Módulo Kanban

## Estrutura Técnica

### Frontend
- **Localização**: `/frontend/src/pages/Kanban`
- **Componentes Principais**:
  - `KanbanBoard.tsx`: Quadro Kanban com drag and drop
  - Utiliza `react-beautiful-dnd` para DnD
  - Integração com Material-UI

### Backend
- **Localização**: `/backend/src/routes/kanban.js`
- **Modelo Prisma**: 
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

### Endpoints da API
- `GET /api/kanban`: Lista todos os cards
- `POST /api/kanban`: Cria novo card
- `PUT /api/kanban/:id`: Atualiza card existente
- `DELETE /api/kanban/:id`: Remove card

### Estado (React Query)
```typescript
const { data: cards, isLoading } = useQuery(
  'kanban-cards',
  () => kanbanService.listar()
);
```

### Mutations
```typescript
const updateMutation = useMutation(
  ({ id, data }) => kanbanService.atualizar(id, data),
  {
    onSuccess: () => queryClient.invalidateQueries('kanban-cards')
  }
);
```

## Funcionalidades
- Drag and Drop entre colunas
- Diferentes tipos de cards com cores
- Histórico de alterações com datas
- CRUD completo de cards
- Coluna de histórico
- Loading states
- Feedback visual
- Validações

## Colunas
1. **Ideias Novas (Parking Lot)**
   - Armazena ideias futuras
   - Priorização pendente

2. **A Fazer (Todo)**
   - Tarefas priorizadas
   - Prontas para desenvolvimento

3. **Em Progresso (In Progress)**
   - Tarefas em desenvolvimento
   - Limitação visual de WIP

4. **Concluído (Done)**
   - Tarefas finalizadas
   - Registro de conclusão

5. **Histórico (History)**
   - Registro permanente
   - Layout em lista

## Tipos de Cards
- **Melhoria**: Verde (#4caf50)
- **Implementação**: Azul (#2196f3)
- **Bug**: Vermelho (#f44336)
- **Funcionalidade**: Laranja (#ff9800)

## Fluxo de Dados
1. Cards são carregados do backend
2. Usuário interage com o quadro
3. Mudanças são persistidas via API
4. Cache é invalidado
5. UI é atualizada automaticamente

## Melhorias Futuras
- [ ] Limites de WIP por coluna
- [ ] Sistema de tags
- [ ] Filtros por tipo/status
- [ ] Modo compacto
- [ ] Exportação de dados
- [ ] Sistema de comentários
- [ ] Atribuição de responsáveis 