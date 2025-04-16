import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule],
})
export class DashboardComponent {
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
    'Top 1': 'rgba(100, 149, 237, 0.7)', // Azul claro (Cornflower Blue) com transparência
    'Top 2': 'rgba(0, 128, 0, 0.7)', // Verde mais claro
    'Top 3': 'rgba(128, 128, 128, 0.7)', // Cinza mais claro
    'Top 4': 'rgba(255, 0, 0, 0.7)', // Vermelho mais claro
    'Top 5': 'rgba(255, 255, 0, 0.7)', // Amarelo mais claro
  };

  // Dados de exemplo para cada Top (12 meses para cada Top)
  private generateTopData(): { [key: string]: number[] } {
    return {
      'Top 1': [65, 59, 80, 81, 56, 55, 40, 72, 88, 90, 65, 80],
      'Top 2': [45, 49, 60, 61, 46, 45, 30, 52, 68, 70, 45, 60],
      'Top 3': [35, 39, 50, 51, 36, 35, 20, 42, 58, 60, 35, 50],
      'Top 4': [25, 29, 40, 41, 26, 25, 10, 32, 48, 50, 25, 40],
      'Top 5': [15, 19, 30, 31, 16, 15, 5, 22, 38, 40, 15, 30],
    };
  }

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: Object.keys(this.topColors).map((top) => {
      return {
        data: this.generateTopData()[top],
        label: top,
        backgroundColor: this.topColors[top as keyof typeof this.topColors],
        borderColor: this.darkenColor(
          this.topColors[top as keyof typeof this.topColors],
        ),
        borderWidth: 1,
        stack: 'stacked',
      };
    }),
  };

  // Função para escurecer ligeiramente a cor para as bordas
  private darkenColor(color: string): string {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d\.]+\)$/, '1)').replace(/0\.\d+\)/, '1)');
    }
    return color; // Para cores hex, retorna como está ou implemente lógica para hex
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true, // Usa pontos ao invés de retângulos na legenda
          pointStyle: 'circle', // Estilo dos pontos na legenda
        },
      },
    },
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: Object.keys(this.topColors),
    datasets: [
      {
        data: [500, 400, 300, 200, 100],
        backgroundColor: Object.values(this.topColors),
        borderColor: '#ffffff', // Linhas brancas entre as fatias
        borderWidth: 3, // Largura da linha branca
        label: 'Dataset 1',
      },
    ],
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
}
