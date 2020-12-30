import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnInit() {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(res => {
        Swal.fire('Actualizado',hospital.nombre,'success');
      });
  }

  eliminarHospital(hospital: Hospital){
    Swal.fire({
      title: '¿Seguro que quiere eliminar este Hospital?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí borralo!!!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id)
        .subscribe(res => {
          Swal.fire('Eliminado',hospital.nombre,'success');
          this.cargarHospitales();
        });
      }
    });
  }

  async abrirSweetAlert(){
    const {value} = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Nombre Hospital',
      showCancelButton: true
    });
    if(!value){
      return;
    }
    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          this.hospitales.push(resp.hospital)
        })
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id, hospital.img);
  }

  buscar(termino: string){
    if(termino.length === 0){
      return this.cargarHospitales();
    }

    this.busquedaService.buscar('hospitales',termino)
      .subscribe(resultados => {
        this.hospitales = resultados;
      });
  }

}
