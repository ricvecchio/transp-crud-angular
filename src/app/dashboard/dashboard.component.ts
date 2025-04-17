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
      next: (data) => {
        this.populateBarChart(data);
        this.populatePieChart(data);
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
    // Converte precoTotal em número, se necessário
    data = data.map((item) => ({
      ...item,
      precoTotal: +item.precoTotal,
    }));

    // Agrupa os dados por cliente e por mês
    const clientMonthTotals: { [idCliente: string]: number[] } = {};

    for (let i = 0; i < data.length; i++) {
      const { idCliente, precoTotal, mesTotal } = data[i];
      if (!clientMonthTotals[idCliente]) {
        clientMonthTotals[idCliente] = Array(12).fill(0);
      }
      clientMonthTotals[idCliente][mesTotal - 1] += precoTotal;
    }

    // Soma total por cliente e ordena
    const totalPorCliente = Object.keys(clientMonthTotals).map((id) => ({
      idCliente: id,
      total: clientMonthTotals[id].reduce((sum, val) => sum + val, 0),
    }));

    const top5 = totalPorCliente.sort((a, b) => b.total - a.total).slice(0, 5);

    // Atualiza o gráfico de barras
    this.barChartData.datasets = top5.map((client, index) => {
      const color = Object.values(this.topColors)[index % 5];
      return {
        label: `Cliente ${client.idCliente}`,
        data: clientMonthTotals[client.idCliente],
        backgroundColor: color,
        borderColor: this.darkenColor(color),
        borderWidth: 1,
        stack: 'stacked',
      };
    });
  }

  private populatePieChart(data: any[]): void {
    // Converte precoTotal em número, se necessário
    data = data.map((item) => ({
      ...item,
      precoTotal: +item.precoTotal,
    }));

    const monthlyTotals: { [mesTotal: number]: number } = {};

    data.forEach((item) => {
      if (!monthlyTotals[item.mesTotal]) {
        monthlyTotals[item.mesTotal] = 0;
      }
      monthlyTotals[item.mesTotal] += item.precoTotal;
    });

    // Garante que todos os 12 meses existam no gráfico
    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];

    for (let month = 1; month <= 12; month++) {
      labels.push(this.barChartLabels[month - 1]);
      values.push(monthlyTotals[month] || 0);
      colors.push(Object.values(this.topColors)[month % 5]); // alterna cores
    }

    this.pieChartData.labels = labels;
    this.pieChartData.datasets[0].data = values;
    this.pieChartData.datasets[0].backgroundColor = colors;
  }

  private darkenColor(color: string): string {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d\.]+\)$/, '1)').replace(/0\.\d+\)/, '1)');
    }
    return color;
  }
}
