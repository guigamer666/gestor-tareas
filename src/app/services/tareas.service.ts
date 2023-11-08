import { Injectable } from '@angular/core';
import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Tareas } from '../interfaces/listaTareas.interface';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  constructor(private firestore: Firestore) {}

  // Esta función obtiene tareas de Firestore para un usuario específico.
  // Utiliza Firebase Firestore para realizar consultas y obtener datos.
  getObtenerTarea(userUID: string): Observable<Tareas[]> {
    // 1. Obtén la referencia a la colección 'tarea' en Firestore.
    const tareas = collection(this.firestore, 'tarea');

    // 2. Crea una consulta que ordena las tareas por fecha de creación descendente
    // y filtra las tareas por el 'userUID' proporcionado.
    const tareasQuery = query(
      tareas,
      orderBy('fecha'),
      where('userUID', '==', userUID)
    );

    // 3. Utiliza collectionData para obtener los datos de las tareas
    // y convierte esos datos en objetos 'Tareas'.
    return collectionData(tareasQuery, { idField: 'id' }).pipe(
      // 4. Usa el operador 'map' para transformar los datos de Firestore en objetos 'Tareas'.
      //Este primer map:  map((data: DocumentData[]) transforma los datos de firestore
      //y el segundo map: data.map((item: DocumentData) transforma esos datos de firestore en objetos Tareas
      map((data: DocumentData[]) =>
        data.map((item: DocumentData) => ({
          id: item['id'] as string,
          userUID: item['userUID'] as string,
          descripcion: item['descripcion'] as string,
          realizada: item['realizada'] as boolean,
          en_progreso: item['en_progreso'] as boolean,
          categoria: item['categoria'] as string,
          fecha: item['fecha'].toDate(),
        }))
      )
    );
  }
  /*Descripcion de lo que hace cada cosa de getObtenerTarea */
  /*
  1. const tareas = collection(this.firestore, 'tarea');:
    Aquí, se obtiene una referencia a la colección "tarea" en Firestore.
    Esto proporciona acceso a la colección de tareas en tu base de datos.
  2.const tareasQuery = query(tareas, orderBy('fecha', 'desc'), where('userUID', '==', userUID));:
    Se crea una consulta que ordena las tareas por la propiedad "fecha" en orden descendente
    (las tareas más recientes primero) y filtra las tareas por el valor de "userUID" proporcionado.
    Esto significa que solo se obtendrán las tareas del usuario cuyo "userUID" coincida con el
    proporcionado.
  3. return collectionData(tareasQuery, { idField: 'id' }).pipe(...):
    Utiliza collectionData para obtener los datos de las tareas según la consulta definida
    en el paso anterior. Además, se establece { idField: 'id' } para asegurarse de que el campo
    "id" se incluya en los resultados. Esto es importante para que tengas acceso a la ID de cada
    tarea.
  4.map((data: DocumentData[]) => data.map((item: DocumentData) => {...})):
   * Este es el paso donde se transforman los datos obtenidos de Firestore en objetos
    "Tareas" que pueden ser más fáciles de trabajar en tu aplicación.
   * El primer map toma un array de objetos "DocumentData" (los datos de Firestore) y
    transforma cada uno de estos objetos en un nuevo array de objetos "Tareas".
   * Dentro de este map, se mapean las propiedades de los objetos "DocumentData"
     a las propiedades de los objetos "Tareas". Esto incluye asignar el valor del
     campo "id" al campo "id" de "Tareas" y convertir la fecha de creación en un objeto "Date".

*/

  addTarea(tarea: Tareas) {
    const tare = collection(this.firestore, 'tarea');
    return addDoc(tare, tarea);
  }

  /**
   * Elimina una tarea existente en Firestore.
   * @param tarea La tarea que se eliminará, incluyendo su ID.
   */
  eliminarTarea(tarea: Tareas) {
    // 1. Obtén la referencia al documento de la tarea que se va a eliminar.
    const tareaEliminar = doc(this.firestore, `tarea/${tarea.id}`);

    // 2. Obtén la ID de la tarea para su registro y seguimiento.
    const tareaId = tareaEliminar.id;
    console.log('ID de la tarea a eliminar:', tareaId);

    // 3. Elimina el documento de la tarea y maneja las promesas y errores.
    return deleteDoc(tareaEliminar)
      .then(() => {
        // La tarea se eliminó con éxito, registra un mensaje de éxito.
        console.log('Tarea eliminada correctamente');
      })
      .catch((error) => {
        // Se produjo un error al eliminar la tarea, registra un mensaje de error y detalles del error.
        console.error('Error al eliminar la tarea:', error);
      });
  }

  /**
   * Actualiza una tarea existente en Firestore.
   * @param tarea La tarea que se actualizará, incluyendo su ID.
   */
  actualizarTarea(tarea: Tareas) {
    // 1. Obtén la referencia al documento de la tarea que se va a actualizar.
    const tareaDoc = doc(this.firestore, `tarea/${tarea.id}`);

    // 2. Crea un objeto de datos de la tarea actualizada.
    const tareaData = {
      descripcion: tarea.descripcion,
      realizada: tarea.realizada,
      en_progreso: tarea.en_progreso,
      categoria: tarea.categoria,
      fecha: tarea.fecha,
    };

    // 3. Actualiza el documento de la tarea con los nuevos datos y maneja las promesas y errores.
    return updateDoc(tareaDoc, tareaData)
      .then(() => {
        // La tarea se actualizó con éxito, registra un mensaje de éxito.
        console.log('Tarea actualizada correctamente');
      })
      .catch((error) => {
        // Se produjo un error al actualizar la tarea, registra un mensaje de error y detalles del error.
        console.error('Error al actualizar la tarea:', error);
      });
  }
}
