export interface Tareas {
  id?: string;
  userUID?: string;
  descripcion: string;
  realizada: boolean;
  en_progreso: boolean;
  categoria: string;
  fecha: Date;
}
//En typescript hace que respete esta estructura
