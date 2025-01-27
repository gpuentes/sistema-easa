import { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  Legend,
} from 'chart.js';
import { movimentacoesService, produtosService } from '../../services/api';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Registrar componentes do Chart.js
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

export default function RelatorioMovimentacoes() {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [periodo, setPeriodo] = useState<string>(format(new Date(), 'yyyy-MM'));

  // Buscar movimentações
  const { data: movimentacoes, isLoading: isLoadingMovimentacoes, error: errorMovimentacoes } = useQuery(
    ['movimentacoes', filtroTipo, periodo],
    () => movimentacoesService.listar(),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Buscar produtos
  const { data: produtos, isLoading: isLoadingProdutos } = useQuery(
    'produtos',
    () => produtosService.listar(),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Processar dados para os gráficos
  const processarDadosGrafico = () => {
    if (!movimentacoes?.data) return null;

    const dataInicio = startOfMonth(parseISO(periodo + '-01'));
    const dataFim = endOfMonth(parseISO(periodo + '-01'));

    const dadosFiltrados = movimentacoes.data.filter((mov: any) => {
      const data = parseISO(mov.data);
      return (
        data >= dataInicio &&
        data <= dataFim &&
        (filtroTipo === 'todos' || mov.tipo === filtroTipo)
      );
    });

    const dadosPorDia = dadosFiltrados.reduce((acc: any, mov: any) => {
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

    const labels = Object.keys(dadosPorDia);
    const dataEntradas = labels.map(dia => dadosPorDia[dia].entradas);
    const dataSaidas = labels.map(dia => dadosPorDia[dia].saidas);

    return {
      labels,
      datasets: [
        {
          label: 'Entradas',
          data: dataEntradas,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.5)',
          tension: 0.4,
        },
        {
          label: 'Saídas',
          data: dataSaidas,
          borderColor: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.5)',
          tension: 0.4,
        },
      ],
    };
  };

  // Processar dados para o gráfico de produtos mais movimentados
  const processarDadosProdutos = () => {
    if (!movimentacoes?.data || !produtos?.data) return null;

    const movimentacoesPorProduto = movimentacoes.data.reduce((acc: any, mov: any) => {
      if (!acc[mov.produtoId]) {
        acc[mov.produtoId] = { entradas: 0, saidas: 0, nome: mov.produtoNome };
      }
      if (mov.tipo === 'ENTRADA') {
        acc[mov.produtoId].entradas += mov.quantidade;
      } else {
        acc[mov.produtoId].saidas += mov.quantidade;
      }
      return acc;
    }, {});

    const produtosMaisMovimentados = Object.values(movimentacoesPorProduto)
      .map((p: any) => ({
        nome: p.nome,
        total: p.entradas + p.saidas,
        entradas: p.entradas,
        saidas: p.saidas,
      }))
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 5);

    return {
      labels: produtosMaisMovimentados.map((p: any) => p.nome),
      datasets: [
        {
          label: 'Entradas',
          data: produtosMaisMovimentados.map((p: any) => p.entradas),
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
        },
        {
          label: 'Saídas',
          data: produtosMaisMovimentados.map((p: any) => p.saidas),
          backgroundColor: 'rgba(244, 67, 54, 0.8)',
        },
      ],
    };
  };

  // Calcular totais
  const calcularTotais = () => {
    if (!movimentacoes?.data) return { entradas: 0, saidas: 0, total: 0, media: 0 };

    const totais = movimentacoes.data.reduce(
      (acc: any, mov: any) => {
        if (mov.tipo === 'ENTRADA') {
          acc.entradas += mov.quantidade;
        } else {
          acc.saidas += mov.quantidade;
        }
        return acc;
      },
      { entradas: 0, saidas: 0 }
    );

    return {
      ...totais,
      total: totais.entradas + totais.saidas,
      media: Math.round((totais.entradas + totais.saidas) / 2),
    };
  };

  const dadosGrafico = processarDadosGrafico();
  const dadosProdutos = processarDadosProdutos();
  const totais = calcularTotais();

  if (isLoadingMovimentacoes || isLoadingProdutos) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (errorMovimentacoes) {
    return (
      <Alert severity="error">
        Erro ao carregar dados do relatório. Por favor, tente novamente.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard de Movimentações
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Tipo de Movimentação"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="ENTRADA">Entradas</MenuItem>
              <MenuItem value="SAIDA">Saídas</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="month"
              label="Período"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Total de Entradas
                </Typography>
                <Typography variant="h4" color="primary">
                  {totais.entradas}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Total de Saídas
                </Typography>
                <Typography variant="h4" color="error">
                  {totais.saidas}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Total de Movimentações
                </Typography>
                <Typography variant="h4" color="text.primary">
                  {totais.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Média por Tipo
                </Typography>
                <Typography variant="h4" color="text.secondary">
                  {totais.media}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Movimentações por Dia
              </Typography>
              {dadosGrafico && (
                <Box sx={{ height: 400 }}>
                  <Line
                    data={dadosGrafico}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Quantidade',
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Data',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Produtos Mais Movimentados
              </Typography>
              {dadosProdutos && (
                <Box sx={{ height: 400 }}>
                  <Bar
                    data={dadosProdutos}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Quantidade',
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Produtos',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 