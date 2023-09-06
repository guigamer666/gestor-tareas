import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegistroComponent, LoginComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormulariosModule {}
