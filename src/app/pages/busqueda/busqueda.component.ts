import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];


  constructor(private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedasService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(({termino}) => this.buscar(termino))
  }

  buscar(termino: string){
    this.busquedaService.busquedaGlobal(termino)
      .subscribe((resp: any) => {
        this.usuarios = resp.usuarios;
        this.medicos = resp.medicos;
        this.hospitales = resp.hospitales;
      });
  }

  abrirMedico(medico: Medico){
    this.router.navigateByUrl(`dashboard/medicos/${medico._id}`);
  }

}
