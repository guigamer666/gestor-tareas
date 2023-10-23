import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
//Esto es un comentario
export class LoginComponent implements OnInit {
  formulario: FormGroup;
  loginError: boolean = false;
  usuarioLogueado: string | null = null;
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.formulario.valid) {
      const email = this.formulario.value.email;
      const password = this.formulario.value.password;

      this.userService
        //Si el email y password es correcto inicia sesion
        .login({ email, password })
        .then((response) => {
          // Inicio de sesión exitoso
          console.log(response);
          this.router.navigate(['/tareas']);
        })
        .catch((error) => {
          // Error de inicio de sesión
          console.log(error);
          this.loginError = true;
        });
    }
  }
}
