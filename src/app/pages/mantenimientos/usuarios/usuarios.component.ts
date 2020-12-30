import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit , OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarUsuarios());
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor:number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0;
    }else if (this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino:string){
  
    if(termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar('usuarios',termino)
      .subscribe((resultados: Usuario[]) => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuarios(usuario: Usuario) {

    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error','No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Está a punto de borrar ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {
            Swal.fire( 'Usuario Borrado', 
              `${usuario.nombre} fue eliminado correctamente`,
              'success');
            this.cargarUsuarios()
          });
      }
    })
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarusuario(usuario).subscribe(resp => console.log(resp));
  }

  abriModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios',usuario.uid, usuario.img);
  }

}
