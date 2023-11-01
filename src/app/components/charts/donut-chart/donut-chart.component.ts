import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-donut-chart',
  template: `
    <div style="display: block">
      <canvas baseChart [data]="data" [type]="chartType"></canvas>
    </div>
  `,
  styleUrls: ['./donut-chart.component.scss'],
  imports: [CommonModule, NgChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DonutChartComponent {
  @Input() data: any = {
    labels: [],
    datasets: [],
  };

  readonly chartType: ChartType = 'doughnut';
}
