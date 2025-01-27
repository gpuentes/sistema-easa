# Changelog

## [0.4.0] - 2024-01-24

### Adicionado
- Dashboard de Movimentações com gráficos dinâmicos
  - Gráfico de linha para movimentações diárias
  - Gráfico de barras para produtos mais movimentados
  - Cards com totalizadores
    - Total de entradas
    - Total de saídas
    - Total de movimentações
    - Média por tipo
  - Filtros
    - Por tipo de movimentação (Entrada/Saída)
    - Por período (mês/ano)
  - Dados atualizados em tempo real
  - Interface responsiva

### Corrigido
- Conflito de arquivos api.js/api.ts no frontend
- Exportação correta dos serviços de movimentação
- Tipagem TypeScript para os serviços

### Melhorias Técnicas
- Migração completa para TypeScript no frontend
- Organização dos serviços de API
- Melhor tratamento de erros
- Loading states para carregamento de dados

## [0.3.0] - 2024-01-23

### Adicionado
- CRUD completo de Categorias com validações
- Integração entre Produtos e Categorias
- Sistema de Movimentações com entrada/saída
- Atualização automática de estoque
- Melhorias na interface do usuário
  - Layout responsivo
  - Menu com destaque visual no item ativo
  - Formulários centralizados
  - Feedback visual para ações do usuário

### Corrigido
- Correção no formulário de categorias para criar novos itens corretamente
- Ajustes na navegação entre páginas
- Validações aprimoradas nos formulários

## [0.2.0] - 2024-01-22

### Adicionado
- CRUD básico de Produtos
- CRUD básico de Categorias
- Layout inicial com Material-UI
- Navegação entre páginas
- Kanban board para acompanhamento

## [0.1.0] - 2024-01-21

### Adicionado
- Configuração inicial do projeto
- Estrutura base do frontend com React
- Estrutura base do backend com Express
- Configuração do banco de dados PostgreSQL

## [0.4.1] - 2024-01-24

### Adicionado
- Funcionalidade de edição de movimentações
  - Botão de editar na listagem
  - Formulário de edição reutilizando o dialog existente
  - Validações de estoque ao editar
  - Atualização automática do estoque ao editar

### Melhorias Técnicas
- Refatoração do componente MovimentacaoList para suportar edição
- Adição de mutation de atualização com React Query
- Tratamento de erros na edição de movimentações
- Feedback visual para ações de edição

## [0.4.2] - 2024-01-24

### Adicionado
- Persistência de dados no Kanban
  - Integração com banco de dados
  - Sincronização automática entre usuários
  - Histórico de alterações com datas
  - Nova coluna "Histórico" para cards concluídos
- Melhorias no Kanban
  - Loading states durante operações
  - Feedback visual de sucesso/erro
  - Layout responsivo para coluna de histórico
  - Validações de campos obrigatórios

### Melhorias Técnicas
- Criação do modelo KanbanCard no Prisma
- Implementação de endpoints REST para o Kanban
- Integração com React Query para cache e sincronização
- Tratamento de erros e loading states

## Próximos Passos
- [ ] Implementar paginação no servidor
- [ ] Adicionar filtros avançados nas listagens
- [ ] Melhorar performance do carregamento inicial
- [ ] Implementar sistema de busca global
- [ ] Adicionar testes automatizados
- [ ] Implementar autenticação de usuários 