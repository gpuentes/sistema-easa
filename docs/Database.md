# Documentação do Banco de Dados - Sistema ASA

## Visão Geral

O Sistema ASA utiliza PostgreSQL como banco de dados relacional, com Prisma como ORM (Object-Relational Mapping). A estrutura foi projetada para garantir integridade referencial, performance e facilidade de manutenção.

## Conexão

```env
DATABASE_URL="postgresql://postgres:[password]@--SEU-IP-aqui/estoqueasa?schema=public"
```

## Modelos

### 1. Categoria
```prisma
model Categoria {
  id          Int       @id @default(autoincrement())
  nome        String
  descricao   String?
  tipo        String    // PRODUTOS, PESSOAS, DOACOES, ACOES
  unidade     String    // quantidade, valor, texto
  produtos    Produto[]
  registros   Registro[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categorias")
}
```
- **Relacionamentos**:
  - `produtos`: One-to-Many com Produto
  - `registros`: One-to-Many com Registro
- **Uso**: Classificação de produtos e registros

### 2. Produto
```prisma
model Produto {
  id          Int       @id @default(autoincrement())
  nome        String
  descricao   String?
  preco       Float
  quantidade  Int      @default(0)
  valor       Float?    // Para doações
  categoriaId Int
  categoria   Categoria @relation(fields: [categoriaId], references: [id])
  movimentacoes Movimentacao[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("produtos")
}
```
- **Relacionamentos**:
  - `categoria`: Many-to-One com Categoria
  - `movimentacoes`: One-to-Many com Movimentacao
- **Uso**: Gestão de produtos em estoque

### 3. Movimentacao
```prisma
model Movimentacao {
  id          Int      @id @default(autoincrement())
  tipo        String   // 'entrada' ou 'saida'
  quantidade  Int
  data        DateTime @default(now())
  observacao  String?
  produtoId   Int
  produto     Produto  @relation(fields: [produtoId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
- **Relacionamentos**:
  - `produto`: Many-to-One com Produto
- **Uso**: Registro de entradas e saídas de produtos

### 4. Registro
```prisma
model Registro {
  id          Int       @id @default(autoincrement())
  categoriaId Int
  categoria   Categoria @relation(fields: [categoriaId], references: [id])
  quantidade  Int?      // Para registros numéricos
  valor       Float?    // Para registros monetários
  descricao   String?   // Para registros textuais
  mes         Int       // Mês do registro (1-12)
  ano         Int       // Ano do registro
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("registros")
  @@index([mes, ano])
}
```
- **Relacionamentos**:
  - `categoria`: Many-to-One com Categoria
- **Uso**: Registros históricos por período

### 5. Parceria
```prisma
model Parceria {
  id          Int       @id @default(autoincrement())
  nome        String    // Nome da empresa/instituição
  tipo        String    // Tipo de parceria (mercado, padaria, etc)
  descricao   String    // Descrição da contribuição
  mes         Int       // Mês do registro
  ano         Int       // Ano do registro
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("parcerias")
  @@index([mes, ano])
}
```
- **Uso**: Gestão de parcerias e contribuições

### 6. Voluntario
```prisma
model Voluntario {
  id          Int       @id @default(autoincrement())
  nome        String
  projeto     String    // Nome do projeto em que atua
  ativo       Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("voluntarios")
}
```
- **Uso**: Gestão de voluntários

### 7. KanbanCard
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
- **Uso**: Gestão de tarefas e melhorias

## Índices e Performance

### Índices Existentes
1. Índices automáticos em chaves primárias (id)
2. Índices em chaves estrangeiras (categoriaId, produtoId)
3. Índices compostos em campos de data (mes, ano)

### Índices Recomendados
```sql
-- Índice para busca de produtos por nome
CREATE INDEX idx_produtos_nome ON produtos(nome);

-- Índice para filtro de movimentações por tipo
CREATE INDEX idx_movimentacoes_tipo ON movimentacoes(tipo);

-- Índice para busca de voluntários ativos
CREATE INDEX idx_voluntarios_ativos ON voluntarios(ativo);
```

## Integridade e Validações

### Constraints Existentes
1. Chaves primárias com auto incremento
2. Chaves estrangeiras com restrições de integridade
3. Campos NOT NULL em dados essenciais
4. Valores default para campos comuns

### Validações Recomendadas
```sql
-- Check constraint para tipo de movimentação
ALTER TABLE movimentacoes
ADD CONSTRAINT chk_tipo_movimentacao 
CHECK (tipo IN ('entrada', 'saida'));

-- Check constraint para quantidade positiva
ALTER TABLE movimentacoes
ADD CONSTRAINT chk_quantidade_positiva 
CHECK (quantidade > 0);

-- Check constraint para mês válido
ALTER TABLE registros
ADD CONSTRAINT chk_mes_valido 
CHECK (mes BETWEEN 1 AND 12);
```

## Sugestões de Melhorias

### 1. Soft Delete
```sql
-- Adicionar campo deleted_at
ALTER TABLE produtos ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE categorias ADD COLUMN deleted_at TIMESTAMP;
```

### 2. Auditoria
```sql
-- Tabela de auditoria
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(50),
  record_id INTEGER,
  action VARCHAR(10),
  old_data JSONB,
  new_data JSONB,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Otimizações
1. Particionamento de tabelas históricas
2. Materialização de views para relatórios
3. Compressão de dados antigos
4. Backup e recuperação

## Manutenção

### Backups
```bash
# Backup diário
pg_dump -h localhost -U postgres -d estoqueasa > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U postgres -d estoqueasa < backup_20240124.sql
```

### Monitoramento
1. Verificar crescimento das tabelas
2. Monitorar performance de queries
3. Analisar uso de índices
4. Manter estatísticas atualizadas

## Próximos Passos
1. Implementar soft delete
2. Adicionar sistema de auditoria
3. Criar índices adicionais
4. Configurar backups automáticos
5. Implementar particionamento de dados históricos 
