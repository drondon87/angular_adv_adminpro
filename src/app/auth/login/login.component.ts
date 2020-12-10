import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', Validators.required, Validators.email],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private _usuarioService: UsuarioService) { }

  ngOnInit(){
    this.renderButton();
  }
  
  login() {
   
    this._usuarioService.login(this.loginForm.value)
      .subscribe(resp =>{ 
        if(this.loginForm.get('remember').value){
          localStorage.setItem('email',this.loginForm.get('email').value);
        }else {
          localStorage.removeItem('email');
        }
         this.router.navigateByUrl('/dashboard');
      }, (err) => {
        Swal.fire('Error!', err.error.msg, 'error');
      });
  }

  onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    let id_token = googleUser.getAuthResponse().id_token;
    
  }

  onFailure(error) {
    console.log(error);
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });
    this.startApp();
  }

  startApp() {
    gapi.load('auth2', () =>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '154133610773-42engbr2br7jfdek9d1v0rumbhkmsdht.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin'
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element) {
    console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this._usuarioService.loginGoogle(id_token).subscribe();
          this.router.navigateByUrl('/');
        }, (error) => {
          console.log(error);
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
