import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Colors } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: []
})
export class DonaComponent {

  @Input() title: string = 'Sin Titulo';
  @Input() labels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  @Input() data: number[] = [350, 450, 100];

  public doughnutChartLabels: Label[] = this.labels;
  public doughnutChartData: MultiDataSet = [
    this.data
  ];
  public colors: Colors[] = [
    { backgroundColor: ['#6857E6','#009FEE','#F02059'] }
  ];

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
