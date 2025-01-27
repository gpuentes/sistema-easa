# Módulo de Relatórios

## Estrutura Técnica

### Frontend

#### Localização dos Componentes
```
src/pages/Relatorios/
├── RelatorioMovimentacoes.tsx    # Dashboard principal
└── components/
    ├── MovimentacoesDiarias.tsx  # Gráfico de linha
    ├── ProdutosMaisMovidos.tsx   # Gráfico de barras
    ├── TotalizadoresCards.tsx    # Cards de resumo
    └── FiltrosPeriodo.tsx        # Filtros de data
```

#### Componentes Principais

##### RelatorioMovimentacoes
- Dashboard principal com layout responsivo
- Integração com Chart.js
- Gerenciamento de filtros
- Cache de dados com React Query

##### Gráficos
- Movimentações Diárias (Line Chart)
- Produtos Mais Movidos (Bar Chart)
- Distribuição por Tipo (Doughnut Chart)
- Animações e interatividade

### Integrações

#### Chart.js
```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
```

#### Material-UI
- Grid system para layout
- Cards para métricas
- DatePicker para filtros
- Temas e cores consistentes

### Gerenciamento de Estado

#### React Query
```typescript
// Query principal
const { data, isLoading } = useQuery(
  ['movimentacoes', periodo],
  () => movimentacoesService.listarPorPeriodo(periodo),
  {
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  }
);

// Processamento de dados
const processarDados = (movimentacoes) => {
  const dadosDiarios = {};
  const produtosMaisMovidos = {};
  
  movimentacoes.forEach(mov => {
    // Agrupa por dia
    const dia = format(new Date(mov.createdAt), 'dd/MM');
    if (!dadosDiarios[dia]) {
      dadosDiarios[dia] = { entradas: 0, saidas: 0 };
    }
    
    // Soma movimentações
    if (mov.tipo === 'ENTRADA') {
      dadosDiarios[dia].entradas += mov.quantidade;
    } else {
      dadosDiarios[dia].saidas += mov.quantidade;
    }
    
    // Conta produtos
    if (!produtosMaisMovidos[mov.produto.nome]) {
      produtosMaisMovidos[mov.produto.nome] = 0;
    }
    produtosMaisMovidos[mov.produto.nome] += mov.quantidade;
  });
  
  return { dadosDiarios, produtosMaisMovidos };
};
```

### Configurações dos Gráficos

#### Movimentações Diárias
```typescript
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Movimentações Diárias',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const data = {
  labels,
  datasets: [
    {
      label: 'Entradas',
      data: dadosDiarios.map(d => d.entradas),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: 'Saídas',
      data: dadosDiarios.map(d => d.saidas),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};
```

#### Produtos Mais Movidos
```typescript
const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Produtos Mais Movimentados',
    },
  },
};
```

### Cálculos e Métricas

#### Totalizadores
```typescript
const calcularTotais = (movimentacoes) => {
  return movimentacoes.reduce((acc, mov) => {
    if (mov.tipo === 'ENTRADA') {
      acc.totalEntradas += mov.quantidade;
    } else {
      acc.totalSaidas += mov.quantidade;
    }
    acc.totalMovimentacoes++;
    return acc;
  }, {
    totalEntradas: 0,
    totalSaidas: 0,
    totalMovimentacoes: 0
  });
};

const calcularMedias = (totais) => {
  return {
    mediaPorTipo: totais.totalMovimentacoes / 2,
    mediaQuantidade: (totais.totalEntradas + totais.totalSaidas) / totais.totalMovimentacoes
  };
};
```

### Funcionalidades

#### Implementadas
- [x] Dashboard responsivo
- [x] Gráfico de movimentações diárias
- [x] Gráfico de produtos mais movidos
- [x] Cards de totalizadores
- [x] Filtros por período
- [x] Filtros por tipo
- [x] Cache de dados
- [x] Loading states
- [x] Tratamento de erros

#### Futuras
- [ ] Exportação de relatórios
- [ ] Mais tipos de gráficos
- [ ] Filtros avançados
- [ ] Comparação de períodos
- [ ] Previsões e tendências
- [ ] Relatórios customizados
- [ ] Alertas configuráveis
- [ ] Integração com BI 