import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';


const childRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard'} },
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajuste Cuenta'} },
  { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Busquedas'} },
  { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica 1'} },
  { path: 'perfil', component: PerfilComponent, data: { titulo: 'Pelfil Usuario'} },
  { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar'} },
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'} },
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs'} },

  //Mantenimientos
  { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Hospitales de Aplicación'} },
  { path: 'medicos', component: MedicosComponent, data: { titulo: 'Medicos de Aplicación'} },
  { path: 'medicos/:id', component: MedicoComponent, data: { titulo: 'Actualizar Medico'} },
  { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: { titulo: 'Usuarios de Aplicación'} }
]

@NgModule({
  imports: [ 
    RouterModule.forChild(childRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChildRoutesModule { }
