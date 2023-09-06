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

  getObtenerTarea(userUID: string): Observable<Tareas[]> {
    const tareas = collection(this.firestore, 'tarea');
    console.log(this.firestore);
    const tareasQuery = query(
      tareas,
      orderBy('fecha', 'desc'),
      where('userUID', '==', userUID)
    );
    return collectionData(tareasQuery, { idField: 'id' }).pipe(
      map((data: DocumentData[]) => {
        console.log('Tareas data:', data); // Agregar el console.log aquí
        return data.map((item: DocumentData) => {
          const tarea: Tareas = {
            id: item['id'] as string,
            userUID: item['userUID'] as string,
            descripcion: item['descripcion'] as string,
            realizada: item['realizada'] as boolean,
            en_progreso: item['en_progreso'] as boolean,
            categoria: item['categoria'] as string,
            fecha: new Date(),
          };
          return tarea;
        });
      })
    );
  }

  addTarea(tarea: Tareas) {
    const tare = collection(this.firestore, 'tarea');
    return addDoc(tare, tarea);
  }

  //INTENTO EXITOSO
  eliminarTarea(tarea: Tareas) {
    const tareaEliminar = doc(this.firestore, `tarea/${tarea.id}`);
    const tareaId = doc(this.firestore, `tarea/${tarea.id}`).id;
    console.log(tareaId);
    return deleteDoc(tareaEliminar)
      .then((error) => {
        console.log('eliminado correctamente');
      })
      .catch((error) => {
        console.error('Error al eliminar la tarea:', error);
      });
  }
  actualizarTarea(tarea: Tareas) {
    const tareaDoc = doc(this.firestore, `tarea/${tarea.id}`);
    const tareaData = {
      descripcion: tarea.descripcion,
      realizada: tarea.realizada,
      en_progreso: tarea.en_progreso,
      categoria: tarea.categoria,
      fecha: tarea.fecha,
    };
    return updateDoc(tareaDoc, tareaData)
      .then(() => {
        console.log('Tarea actualizada correctamente');
      })
      .catch((error) => {
        console.error('Error al actualizar la tarea:', error);
      });
  }
}
