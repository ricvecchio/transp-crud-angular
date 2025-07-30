import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { DashboardService } from './dashboard.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, MatProgressSpinner],
})
export class DashboardComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  yearOptions: number[] = [];
  public isLoading = true;

  public barChartLabels: string[] = [];

  private topColors = {
    'Top 1': 'rgba(100, 149, 237, 0.7)',
    'Top 2': 'rgba(0, 128, 0, 0.7)',
    'Top 3': 'rgba(128, 128, 128, 0.7)',
    'Top 4': 'rgba(255, 0, 0, 0.7)',
    'Top 5': 'rgba(255, 255, 0, 0.7)',
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
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
            return tooltipItems[0].label;
          },
          label: function (tooltipItem) {
            const cliente =
              tooltipItem.dataset.label?.replace('Cliente ', '') || '';
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
    this.generateYearOptions();
    this.updateLabels();
    this.fetchDashboardData();
  }

  private generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    const lastYear = 2040;
    for (let year = currentYear; year <= lastYear; year++) {
      this.yearOptions.push(year);
    }
  }

  private updateLabels(): void {
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    this.barChartLabels = months.map((m) => `${m}/${this.selectedYear}`);
    this.barChartData.labels = this.barChartLabels;
  }

  onYearChange(): void {
    this.updateLabels();
    this.fetchDashboardData();
  }

  private fetchDashboardData(): void {
    this.isLoading = true;
    this.dashboardService
      .listarDadosDashboard(0, 60, this.selectedYear)
      .subscribe({
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
    const clientMonthTotals: { [idCliente: string]: number[] } = {};

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

  private populatePieChart(data: any[]): void {
    const monthlyTotals: { [mesTotal: number]: number } = {};
    const monthlyLabels: string[] = [];
    const monthlyTotalValues: number[] = [];
    const monthlyColors: string[] = [];

    data.forEach((item) => {
      const monthLabel = this.barChartLabels[item.mesTotal - 1];
      monthlyTotals[item.mesTotal] = item.valorTotalMes;
      monthlyLabels.push(monthLabel);
      monthlyTotalValues.push(item.valorTotalMes);
      monthlyColors.push(Object.values(this.topColors)[item.mesTotal % 5]);
    });

    this.pieChartData.labels = monthlyLabels;
    this.pieChartData.datasets[0].data = monthlyTotalValues;
    this.pieChartData.datasets[0].backgroundColor = monthlyColors;

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
            },
          },
        },
      },
    };
  }

  private darkenColor(color: string): string {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d\.]+\)$/, '1)').replace(/0\.\d+\)/, '1)');
    }
    return color;
  }
}
