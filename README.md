# Sistema de Estoque ASA

Sistema de gerenciamento de estoque com funcionalidades de controle de produtos, movimentações, relatórios e quadro Kanban para melhorias.

## Tecnologias Utilizadas

### Frontend
- **React** (v18.2.0) - Biblioteca para construção de interfaces
- **TypeScript** (v5.0.2) - Superset JavaScript com tipagem estática
- **Material-UI** (v5.15.0) - Framework de componentes React
- **React Query** (v4.29.5) - Gerenciamento de estado e cache
- **Chart.js** (v4.4.1) - Biblioteca de gráficos
- **React Beautiful DnD** (v13.1.1) - Drag and drop para Kanban
- **Vite** (v4.4.5) - Build tool e dev server

### Backend
- **Node.js** (v18.x) - Runtime JavaScript
- **Express** (v4.18.2) - Framework web
- **Prisma** (v5.7.1) - ORM e migrations
- **SQLite** - Banco de dados relacional
- **TypeScript** (v5.0.2) - Tipagem e desenvolvimento

## Estrutura do Projeto

```
sistema-estoque/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Produtos/
│   │   │   ├── Movimentacoes/
│   │   │   ├── Relatorios/
│   │   │   └── Kanban/
│   │   ├── services/
│   │   ├── components/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── docs/
    ├── CHANGELOG.md
    └── ui-evolution/
```

## Módulos

### [Produtos](frontend/src/pages/Produtos/README.md)
- Cadastro e gestão de produtos
- Controle de estoque
- Categorização
- Validações

### [Movimentações](frontend/src/pages/Movimentacoes/README.md)
- Registro de entradas e saídas
- Histórico de operações
- Atualização automática de estoque
- Observações e rastreamento

### [Relatórios](frontend/src/pages/Relatorios/README.md)
- Dashboard interativo
- Gráficos de movimentações
- Produtos mais movimentados
- Filtros por período

### [Kanban](frontend/src/pages/Kanban/README.md)
- Quadro de melhorias
- Drag and drop
- Tipos de cards
- Histórico de alterações

## Instalação e Execução

### Requisitos
- Node.js v18.x ou superior
- npm v10.x ou superior
- Git

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

## Endpoints da API

### Produtos
- `GET /api/produtos` - Lista todos os produtos
- `POST /api/produtos` - Cria novo produto
- `PUT /api/produtos/:id` - Atualiza produto
- `DELETE /api/produtos/:id` - Remove produto

### Movimentações
- `GET /api/movimentacoes` - Lista movimentações
- `POST /api/movimentacoes` - Registra movimentação
- `PUT /api/movimentacoes/:id` - Atualiza movimentação
- `DELETE /api/movimentacoes/:id` - Remove movimentação

### Kanban
- `GET /api/kanban` - Lista cards
- `POST /api/kanban` - Cria card
- `PUT /api/kanban/:id` - Atualiza card
- `DELETE /api/kanban/:id` - Remove card

## Modelos do Banco

### Produto
```prisma
model Produto {
  id          Int      @id @default(autoincrement())
  nome        String
  descricao   String?
  quantidade  Int      @default(0)
  categoria   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  movimentacoes Movimentacao[]

  @@map("produtos")
}
```

### Movimentacao
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

### KanbanCard
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

## Funcionalidades

### Implementadas
- [x] CRUD de produtos
- [x] Controle de estoque
- [x] Movimentações com histórico
- [x] Dashboard de relatórios
- [x] Quadro Kanban
- [x] Validações e feedback
- [x] Interface responsiva
- [x] Cache e otimizações

### Futuras
- [ ] Autenticação de usuários
- [ ] Níveis de acesso
- [ ] Notificações
- [ ] Backup automático
- [ ] Temas personalizados
- [ ] Integração com BI
- [ ] App mobile
- [ ] API pública

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 