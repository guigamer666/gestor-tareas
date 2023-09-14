import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UserCredential } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  formulario!: FormGroup;
  usuarioYaRegistrado: boolean = false;
  registroExitoso: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      const email = this.formulario.value.email;
      const password = this.formulario.value.password;

      this.userService.registrarUsuario({ email, password }).then(
        //UserCredential es parte de firebase
        (response: UserCredential) => {
          // Manejar la respuesta del servicio
          console.log(response);
          //Si se ha registrado correctamete el usuario establecemos esta variable en true
          //y se redirige a la pagina de login
          this.registroExitoso = true;
          this.router.navigate(['/login']);
        },
        (error: any) => {
          // Manejar el error del servicio
          if (error.code === 'auth/email-already-in-use') {
            this.usuarioYaRegistrado = true;
          }
          console.log(error);
        }
      );
    } else {
      // Formulario inválido, mostrar mensajes de validación si es necesario
    }
  }
}
