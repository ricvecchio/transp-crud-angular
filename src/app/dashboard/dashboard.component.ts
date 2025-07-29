import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { DashboardService } from './dashboard.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule, MatProgressSpinner],
})
export class DashboardComponent implements OnInit {
  public isLoading = true;

  public barChartLabels: string[] = [
    'Jan/2025',
    'Fev/2025',
    'Mar/2025',
    'Abr/2025',
    'Mai/2025',
    'Jun/2025',
    'Jul/2025',
    'Ago/2025',
    'Set/2025',
    'Out/2025',
    'Nov/2025',
    'Dez/2025',
  ];

  private topColors = {
    'Top 1': 'rgba(100, 149, 237, 0.7)',
    'Top 2': 'rgba(0, 128, 0, 0.7)',
    'Top 3': 'rgba(128, 128, 128, 0.7)',
    'Top 4': 'rgba(255, 0, 0, 0.7)',
    'Top 5': 'rgba(255, 255, 0, 0.7)',
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [],
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: '#ffffff',
        borderWidth: 3,
        label: 'Dataset 1',
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const label = tooltipItems[0].label;
            return label; 
          },
          label: function (tooltipItem) {
            const cliente = tooltipItem.dataset.label?.replace('Cliente ', '') || '';
            const valor = tooltipItem.raw as number;
            return `${cliente}\nValor: R$ ${valor.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
  };
  
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    aspectRatio: 1,
    cutout: '30%',
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.dataset.data.reduce(
              (acc, value) => acc + value,
              0,
            );
            const value = tooltipItem.raw as number;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  private fetchDashboardData(): void {
  this.isLoading = true;
  this.dashboardService.listarDadosDashboard(0, 60).subscribe({
    next: (response) => {
      this.populateBarChart(response.dados);  
      this.populatePieChart(response.dados);  
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erro ao carregar dados:', err);
      this.isLoading = false;
    },
  });
}

private populateBarChart(data: any[]): void {
  // Estrutura para armazenar valores por cliente e mês
  const clientMonthTotals: { [idCliente: string]: number[] } = {};

  // Preencher os dados de cada mês (já vem com até 5 clientes do backend)
  data.forEach((mesData) => {
    const mesIndex = mesData.mesTotal - 1;

    if (Array.isArray(mesData.clientes)) {
      mesData.clientes.forEach((cliente: any) => {
        const { idCliente, precoTotal } = cliente;

        if (!clientMonthTotals[idCliente]) {
          clientMonthTotals[idCliente] = Array(12).fill(0);
        }

        clientMonthTotals[idCliente][mesIndex] = precoTotal;
      });
    }
  });

  // Agora NÃO filtramos top 5 globais.
  // Incluímos todos os clientes que vieram do backend (até 5 por mês).
  const clientesUnicos = Object.keys(clientMonthTotals);

  this.barChartData.datasets = clientesUnicos.map((idCliente, index) => {
    const color = Object.values(this.topColors)[index % 5];
    return {
      label: `Cliente ${idCliente}`,
      data: clientMonthTotals[idCliente],
      backgroundColor: color,
      borderColor: this.darkenColor(color),
      borderWidth: 1,
      stack: 'stacked',
    };
  });
}


  // private populateBarChart(data: any[]): void {
  //   // Mapeia os totais por cliente por mês (12 posições)
  //   const clientMonthTotals: { [idCliente: string]: number[] } = {};
  
  //   // Itera por mês
  //   data.forEach((mesData) => {
  //     const mesIndex = mesData.mesTotal - 1;
  
  //     if (mesData.clientes && Array.isArray(mesData.clientes)) {
  //       mesData.clientes.forEach((cliente: any) => {
  //         const { idCliente, precoTotal } = cliente;
  
  //         if (!clientMonthTotals[idCliente]) {
  //           clientMonthTotals[idCliente] = Array(12).fill(0);
  //         }
  
  //         clientMonthTotals[idCliente][mesIndex] = precoTotal;
  //       });
  //     }
  //   });
  
  //   // Calcula total por cliente para pegar os top 5
  //   const totalPorCliente = Object.keys(clientMonthTotals).map((id) => ({
  //     idCliente: id,
  //     total: clientMonthTotals[id].reduce((sum, val) => sum + val, 0),
  //   }));
  
  //   const top5 = totalPorCliente
  //     .sort((a, b) => b.total - a.total)
  //     .slice(0, 5);
  
  //   // Monta os datasets com os top 5 clientes
  //   this.barChartData.datasets = top5.map((client, index) => {
  //     const color = Object.values(this.topColors)[index % 5];
  //     return {
  //       label: `Cliente: ${client.idCliente}`,
  //       data: clientMonthTotals[client.idCliente],
  //       backgroundColor: color,
  //       borderColor: this.darkenColor(color),
  //       borderWidth: 1,
  //       stack: 'stacked',
  //     };
  //   });
  // }
  
  private populatePieChart(data: any[]): void {
    // Organiza os dados mensais com base no 'valorTotalMes' retornado pelo backend
    const monthlyTotals: { [mesTotal: number]: number } = {};
    const monthlyLabels: string[] = [];
    const monthlyTotalValues: number[] = [];
    const monthlyColors: string[] = [];
  
    // Preenche os totais mensais e rótulos
    data.forEach((item) => {
      const monthLabel = this.barChartLabels[item.mesTotal - 1]; // Ajusta o mês para exibição
      monthlyTotals[item.mesTotal] = item.valorTotalMes; // Total de todos os clientes por mês
      monthlyLabels.push(monthLabel);
      monthlyTotalValues.push(item.valorTotalMes);
      // Utilizando as cores do gráfico de barras para manter a consistência visual
      monthlyColors.push(Object.values(this.topColors)[item.mesTotal % 5]); 
    });
  
    // Atualiza os dados do gráfico de pizza
    this.pieChartData.labels = monthlyLabels;
    this.pieChartData.datasets[0].data = monthlyTotalValues;
    this.pieChartData.datasets[0].backgroundColor = monthlyColors;
  
    // Atualiza o tooltip para mostrar o valor total de cada mês no gráfico de pizza
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const dataset = tooltipItem?.dataset;
              const data = dataset?.data as number[] | undefined;
              const raw = tooltipItem?.raw;
              const label = tooltipItem?.label;
    
              if (data && typeof raw === 'number' && label) {
                const total = data.reduce((acc, value) => acc + value, 0);
                const percentage = ((raw / total) * 100).toFixed(2);
                const totalValue = raw.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                });
    
                return `${label}: ${percentage}% | Valor: ${totalValue}`;
              }
    
              return '';
            }
          }
        }
      }
    };
  }
  
  private darkenColor(color: string): string {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d\.]+\)$/, '1)').replace(/0\.\d+\)/, '1)');
    }
    return color;
  }
}
