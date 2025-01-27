# Documentação do Frontend

## Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── Layout.tsx  # Layout principal com menu
│   │   └── ...
│   ├── pages/         # Páginas da aplicação
│   │   ├── Produtos/
│   │   ├── Categorias/
│   │   └── Kanban/
│   ├── routes.tsx     # Configuração de rotas
│   └── main.tsx       # Ponto de entrada
└── package.json
```

## Componentes Principais

### Layout (`src/components/Layout.tsx`)
- Layout principal com menu lateral responsivo
- Utiliza Material-UI para estilização
- Menu com highlight no item ativo
- Suporte a modo mobile com drawer

### Kanban Board (`src/pages/Kanban/KanbanBoard.tsx`)
- Quadro Kanban para gerenciamento de tarefas
- Drag and drop entre colunas
- Cards com tipo e descrição
- Cores diferentes por tipo de card
- Funcionalidade de exclusão

### Lista de Produtos (`src/pages/Produtos/ListaProdutos.tsx`)
- Tabela de produtos com paginação
- Busca e filtros
- Botões de ação (editar, excluir)
- Link para adicionar novo

### Formulário de Produto (`src/pages/Produtos/FormProduto.tsx`)
- Formulário de cadastro/edição
- Validação de campos
- Seleção de categoria
- Upload de imagem (planejado)

### Lista de Categorias (`src/pages/Categorias/ListaCategorias.tsx`)
- Tabela de categorias
- Paginação e busca
- Ações de editar e excluir

### Formulário de Categoria (`src/pages/Categorias/FormCategoria.tsx`)
- Formulário de cadastro/edição
- Validação de campos
- Feedback visual

## Tecnologias Utilizadas

### Core
- React 18
- TypeScript
- Vite

### UI/UX
- Material-UI v5
- React Router v6
- React Beautiful DND

### Estado
- React Hooks
- Context API (planejado)

### Validação
- Zod (planejado)

## Padrões de Código

### Nomenclatura
- Componentes: PascalCase
- Funções: camelCase
- Interfaces: IPascalCase
- Types: TPascalCase

### Organização
- Um componente por arquivo
- Estilos junto ao componente
- Interfaces em arquivo separado para componentes complexos

### Boas Práticas
- Componentização para reuso
- Hooks customizados para lógica comum
- Lazy loading para rotas
- Feedback visual para ações
- Tratamento de erros consistente

## Temas e Estilização

### Cores
- Primary: #1976d2
- Secondary: #dc004e
- Background: #f5f5f5
- Text: #333333

### Responsividade
- Breakpoints Material-UI
- Layout flexível
- Menu colapsável
- Grid system

## Roadmap

### Próximas Features
1. Autenticação e autorização
2. Upload de imagens
3. Relatórios em PDF
4. Gráficos e dashboards
5. Modo dark/light
6. Internacionalização

### Melhorias Planejadas
1. Testes unitários
2. Testes e2e
3. PWA
4. Performance optimization
5. Acessibilidade 