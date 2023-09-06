import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Tareas } from 'src/app/interfaces/listaTareas.interface';
import { TareasService } from 'src/app/services/tareas.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.css'],
})
export class ListaTareasComponent {
  Tarea: Tareas[] = [];
  // Nueva propiedad para almacenar las tareas filtradas

  categoriaBuscada: string = '';

  id = '';
  descripcion: string = '';
  realizada: boolean = false;
  en_progreso: boolean = false;
  categoria: string = '';
  fecha: Date = new Date();
  errorDescripcion: string = '';
  errorCategoria: string = '';
  tarea = '';
  tareaSeleccionada: Tareas | null = null;

  constructor(
    private tareasService: TareasService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerTareas();
  }

  obtenerTareas() {
    const userUID = this.userService.getCurrentUserUID();
    if (userUID) {
      this.tareasService
        .getObtenerTarea(userUID)
        .subscribe((tareas: Tareas[]) => {
          this.Tarea = tareas;
        });
    }
  }

  agregartarea() {
    if (!this.descripcion.trim() || !this.categoria.trim() || !this.fecha) {
      this.errorDescripcion = 'Rellene el campo';
      this.errorCategoria = 'Rellene el campo';
    } else {
      this.errorDescripcion = '';
      this.errorCategoria = '';
      const nuevatarea: Tareas = {
        descripcion: this.descripcion,
        realizada: this.realizada,
        en_progreso: this.en_progreso,
        categoria: this.categoria,
        fecha: this.fecha,
        userUID: this.userService.getCurrentUserUID() || '',
      };
      this.Tarea.push(nuevatarea);
      this.descripcion = '';
      this.realizada = false;
      this.en_progreso = false;
      this.categoria = '';
      this.fecha = new Date();
      this.userService.getCurrentUserUID();
      this.tareasService.addTarea(nuevatarea).then(() => {
        this.obtenerTareas(); // Actualizar la lista de tareas después de agregar una nueva tarea
      });
      this.tarea = '';
    }
  }

  eliminartarea(tareaEliminar: Tareas) {
    this.tareasService.eliminarTarea(tareaEliminar).then(() => {
      // Eliminar la tarea del arreglo local
      const index = this.Tarea.findIndex((t) => t.id === tareaEliminar.id);
      if (index !== -1) {
        this.Tarea.splice(index, 1);
      }
    });
  }

  cambiarestadotarea(posicion: number) {
    this.Tarea[posicion].realizada = !this.Tarea[posicion].realizada;
    this.actualizarTarea(this.Tarea[posicion]);
  }
  cambiarestadotareaCompletada(posicion: number) {
    this.Tarea[posicion].en_progreso = !this.Tarea[posicion].en_progreso;
    this.actualizarTarea(this.Tarea[posicion]);
  }
  editarTarea(tarea: Tareas) {
    this.tareaSeleccionada = { ...tarea };
  }

  actualizarTarea(tarea: Tareas) {
    this.tareasService.actualizarTarea(tarea).then(() => {
      this.obtenerTareas(); // Actualizar la lista de tareas después de actualizar una tarea
      this.tareaSeleccionada = null; // Reiniciar la tarea seleccionada
    });
  }

  buscarCategoria() {
    if (this.categoriaBuscada !== '') {
      this.Tarea = this.Tarea.filter((tarea) =>
        tarea.categoria
          .toLowerCase()
          .includes(this.categoriaBuscada.toLowerCase())
      );
    } else {
      this.obtenerTareas(); // Si no hay búsqueda, recuperar todas las tareas originales
    }
  }

  logOut() {
    this.userService
      .logout()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => console.log(error));
  }
}
