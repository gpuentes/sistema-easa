# Módulo de Relatórios

## Estrutura Técnica

### Frontend
- **Localização**: `/frontend/src/pages/Relatorios`
- **Componentes Principais**:
  - `RelatorioMovimentacoes.tsx`: Dashboard principal
  - Utiliza `Chart.js` e `react-chartjs-2`
  - Integração com Material-UI

### Gráficos Implementados
1. **Movimentações por Dia**
   - Tipo: Gráfico de Linha
   - Dados: Entradas e Saídas
   - Escala: Diária
   - Biblioteca: `Line` do Chart.js

2. **Produtos Mais Movimentados**
   - Tipo: Gráfico de Barras
   - Dados: Top 5 produtos
   - Métricas: Entradas e Saídas
   - Biblioteca: `Bar` do Chart.js

### Cards de Métricas
- Total de Entradas
- Total de Saídas
- Total de Movimentações
- Média por Tipo

### Filtros
```typescript
interface Filtros {
  tipo: 'ENTRADA' | 'SAIDA' | 'todos';
  periodo: string; // formato: 'YYYY-MM'
}
```

### Estado (React Query)
```typescript
const { data: movimentacoes } = useQuery(
  ['movimentacoes', filtroTipo, periodo],
  () => movimentacoesService.listar()
);

const { data: produtos } = useQuery(
  'produtos',
  () => produtosService.listar()
);
```

## Processamento de Dados

### Movimentações por Dia
```typescript
const dadosPorDia = movimentacoes.reduce((acc, mov) => {
  const dia = format(parseISO(mov.data), 'dd/MM');
  if (!acc[dia]) {
    acc[dia] = { entradas: 0, saidas: 0 };
  }
  if (mov.tipo === 'ENTRADA') {
    acc[dia].entradas += mov.quantidade;
  } else {
    acc[dia].saidas += mov.quantidade;
  }
  return acc;
}, {});
```

### Produtos Mais Movimentados
```typescript
const produtosMaisMovimentados = Object.values(movimentacoesPorProduto)
  .map((p) => ({
    nome: p.nome,
    total: p.entradas + p.saidas,
    entradas: p.entradas,
    saidas: p.saidas,
  }))
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);
```

## Configurações dos Gráficos

### Gráfico de Linha
```typescript
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
    }
  }
};
```

### Gráfico de Barras
```typescript
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    }
  }
};
```

## Funcionalidades
- Visualização em tempo real
- Filtros dinâmicos
- Responsividade
- Loading states
- Tratamento de erros
- Tooltips informativos
- Formatação de datas
- Cálculos automáticos

## Melhorias Futuras
- [ ] Mais tipos de gráficos
- [ ] Exportação de relatórios
- [ ] Filtros avançados
- [ ] Gráficos personalizáveis
- [ ] Comparação de períodos
- [ ] Previsões e tendências
- [ ] Alertas configuráveis 