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
  /**
   * Obtiene las tareas de Firestore para un usuario específico.
   * @param userUID El ID del usuario para el que se obtienen las tareas.
   * @returns Un Observable que emite un array de objetos Tareas.
   */
  getObtenerTarea(userUID: string): Observable<Tareas[]> {
    // Define la colección 'tarea' en Firestore.
    const tareas = collection(this.firestore, 'tarea');

    // Realiza una consulta para obtener las tareas ordenadas por fecha de creación descendente,
    // filtradas por el 'userUID' proporcionado.
    const tareasQuery = query(
      tareas,
      orderBy('fecha', 'desc'),
      where('userUID', '==', userUID)
    );

    // Obtiene los datos de las tareas y los transforma a objetos 'Tareas'.
    return collectionData(tareasQuery, { idField: 'id' }).pipe(
      // Mapea los datos de Firestore a objetos 'Tareas'.
      map((data: DocumentData[]) =>
        data.map((item: DocumentData) => ({
          id: item['id'] as string,
          userUID: item['userUID'] as string,
          descripcion: item['descripcion'] as string,
          realizada: item['realizada'] as boolean,
          en_progreso: item['en_progreso'] as boolean,
          categoria: item['categoria'] as string,
          fecha: new Date(),
        }))
      )
    );
  }

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
