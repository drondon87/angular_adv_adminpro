import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementadorComponent } from './incrementador/incrementador.component';
import { FormsModule } from '@angular/forms';
import { DonaComponent } from './dona/dona.component';
import { ChartsModule, ThemeService } from 'ng2-charts';



@NgModule({
  declarations: [IncrementadorComponent, DonaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule
  ],
  exports: [
    IncrementadorComponent,
    DonaComponent
  ],
  providers:[ThemeService]
})
export class ComponentsModule { }
