import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(private medicosServices: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnInit() {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicosServices.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
      });
  }

  buscar(termino: string){
    if(termino.length === 0){
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos',termino)
      .subscribe(resultados => {
        this.medicos = resultados;
      });
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos',medico._id, medico.img);
  }

  guardarCambios(medico: Medico){

  }

  eliminarMedico(medico: Medico){
    Swal.fire({
      title: '¿Seguro que quiere eliminar este Medico?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí borralo!!!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosServices.borrarMedico(medico._id)
        .subscribe(res => {
          Swal.fire('Eliminado',medico.nombre,'success');
          this.cargarMedicos();
        });
      }
    });
  }

}
