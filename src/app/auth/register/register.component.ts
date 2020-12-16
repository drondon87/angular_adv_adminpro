import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [false, Validators.required],
  },{
    validators: this.passwordsIguales('password','password2')
  });

  constructor(private fb: FormBuilder, 
              private _usuarioServices: UsuarioService,
              private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;

    if(this.registerForm.invalid){
      return;
    }else{
      //Registrar data del formulario
      this._usuarioServices.crearUsuario(this.registerForm.value)
      .subscribe( resp => {
      
        Swal.fire({
          icon: 'success',
          title: 'Usuario Guardado Correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      
        this.router.navigateByUrl('/dashboard');
      }, (err) => {
        Swal.fire('Error!', err.error.msg, 'error');
      });
    }
  }

  campoNoValido = (campo: string): boolean => (this.registerForm.get(campo).invalid && this.formSubmitted) ? true : false;

  aceptaTerminos = (): boolean => (!this.registerForm.get('terminos').value && this.formSubmitted);

  passwordsNoValidos = (): boolean => ( (this.registerForm.get('password').value !== this.registerForm.get('password2').value) && this.formSubmitted) ? true : false;

  passwordsIguales(pass1: string, pass2:string){
    return (formGroup: FormGroup) =>{
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual: true}); 
      }
    }
  }

}
