import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaTareasComponent } from './lista-tareas/lista-tareas.component';
import { TablaTareasComponent } from './tabla-tareas/tabla-tareas.component';
import { FormsModule } from '@angular/forms';
import { FormulariosModule } from '../formularios/formularios.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [ListaTareasComponent, TablaTareasComponent],
  imports: [
    CommonModule,
    FormsModule,
    FormulariosModule,
    AngularFireAuthModule,
  ],
  exports: [ListaTareasComponent],
})
export class TareasModule {}
