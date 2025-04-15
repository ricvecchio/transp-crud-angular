import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.css'],
})
export class MetricasComponent {
  // Dados para o gráfico de barras
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [
    { 
      data: [65, 59, 80, 81, 56, 55, 40], 
      label: 'Bar Chart Data',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ];

  // Dados para o gráfico de pizza
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = ['Red', 'Blue', 'Yellow'];
  public pieChartData: ChartDataset = {
    data: [300, 500, 100],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
}