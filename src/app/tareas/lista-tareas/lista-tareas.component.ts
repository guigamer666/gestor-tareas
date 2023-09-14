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
  //Al iniciar la pagina web obtiene todas las tareas
  ngOnInit() {
    this.obtenerTareas();
  }
  //Funcion que obtiene las tareas en base a la uid del usuario
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
  //Funcion que agrega una tarea
  //trim() comprueba si hay espacios en blaco o el campo no se relleno
  agregartarea() {
    //Si se deja uno de estos campos sin rellenas sales los mensajes de error
    if (!this.descripcion.trim() || !this.categoria.trim() || !this.fecha) {
      this.errorDescripcion = 'Rellene el campo';
      this.errorCategoria = 'Rellene el campo';
      //Si lo hemos rellenado se ejecuta la parte del else.
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
      this.Tarea.push(nuevatarea); //esto es lo que realmente agrega la tarea  junto lo lo de arriba la constante nuevatarea
      //reseteamos los campos
      this.descripcion = '';
      this.realizada = false;
      this.en_progreso = false;
      this.categoria = '';
      this.fecha = new Date();
      this.userService.getCurrentUserUID();
      //Le pasa al servicio addTarea lo que el usuario a ingresado y lo pone en base de datos
      this.tareasService.addTarea(nuevatarea).then(() => {
        this.obtenerTareas(); // Actualizar la lista de tareas después de agregar una nueva tarea
      });
      this.tarea = '';
    }
  }

  eliminartarea(tareaEliminar: Tareas) {
    this.tareasService.eliminarTarea(tareaEliminar).then(() => {
      // Eliminar la tarea del array local
      //Busca un elemento por la condicion en este caso la condicion es t y lo que busca un elemento
      //cuya propiedad sea id(t.id)
      const index = this.Tarea.findIndex((t) => t.id === tareaEliminar.id);
      //Si index no es igual a -1 significa que encontro una tarea entonces la elimina
      if (index !== -1) {
        this.Tarea.splice(index, 1);
      }
    });
  }
  //Esta funcion lo que hace basicamente es decir si una tarea a sido realizada o no
  //esto es como una bombilla o esta encendida o apagada
  //piensa como si esta funcion fuese una bombilla si la tarea esta realizada es 1 y si no 0
  /*Cuando se llama a esta función y se proporciona una posición posicion, lo que hace es cambiar
  el estado actual de la tarea en esa posición. Si estaba "realizada", la función lo cambiará a
  "no realizada" y viceversa. Esto se logra utilizando el operador ! (not) para negar el valor
  actual de this.Tarea[posicion].realizada. */
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
