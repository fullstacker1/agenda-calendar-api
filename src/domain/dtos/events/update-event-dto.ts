// dtos/evento.dtos.ts

// Interfaces TypeScript para tipado estático
export interface IRecurrenciaDto {
  tipo: 'diario' | 'semanal' | 'mensual' | 'anual';
  fin?: Date;
  repeticiones?: number;
  intervalo?: number;
  dias_semana?: number[];
  dia_mes?: number;
}

export interface IUpdatedEventoDto {
  titulo: string;
  descripcion?: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  todo_el_dia?: boolean;
  calendario_id: string;
  recurrencia?: IRecurrenciaDto;
  ubicacion?: string;
}

export interface IUpdateEventoDto extends Partial<IUpdatedEventoDto> {}

// Clases de validación manual
export class UpdateEventoDto implements IUpdatedEventoDto {
  titulo: string;
  descripcion?: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  todo_el_dia?: boolean;
  calendario_id: string;
  recurrencia?: RecurrenciaDto;
  ubicacion?: string;

  constructor(data: any) {
    this.titulo = data.titulo;
    this.descripcion = data.descripcion;
    this.fecha_inicio = new Date(data.fecha_inicio);
    this.fecha_fin = new Date(data.fecha_fin);
    this.todo_el_dia = data.todo_el_dia || false;
    this.calendario_id = data.calendario_id;
    this.recurrencia = data.recurrencia;
    this.ubicacion = data.ubicacion;
  }

  // Método de validación
  validate(): string[] {
    const errors: string[] = [];

    // Validaciones básicas
    if (!this.titulo || this.titulo.trim().length === 0) {
      errors.push('El título es obligatorio');
    }
    if (this.titulo && this.titulo.length > 200) {
      errors.push('El título no puede exceder 200 caracteres');
    }
    if (!this.fecha_inicio || Number.isNaN(this.fecha_inicio.getTime())) {
      errors.push('Fecha de inicio inválida');
    }
    if (!this.fecha_fin || Number.isNaN(this.fecha_fin.getTime())) {
      errors.push('Fecha fin inválida');
    }
    if (this.fecha_inicio && this.fecha_fin && this.fecha_inicio >= this.fecha_fin) {
      errors.push('La fecha de inicio debe ser anterior a la fecha fin');
    }
    if (!this.calendario_id) {
      errors.push('El calendario es obligatorio');
    }

    // Validar recurrencia si existe
    if (this.recurrencia) {
      const recurrenciaErrors = this.validateRecurrencia();
      errors.push(...recurrenciaErrors);
    }

    if (this.ubicacion && this.ubicacion.length > 255) {
      errors.push('La ubicación no puede exceder 255 caracteres');
    }

    return errors;
  }

  private validateRecurrencia(): string[] {
    const errors: string[] = [];
    const tiposValidos = ['diario', 'semanal', 'mensual', 'anual'];

    if (!this.recurrencia!.tipo || !tiposValidos.includes(this.recurrencia!.tipo)) {
      errors.push('Tipo de recurrencia inválido');
    }

    if (this.recurrencia!.repeticiones !== undefined && this.recurrencia!.repeticiones < 1) {
      errors.push('Las repeticiones deben ser al menos 1');
    }

    if (this.recurrencia!.intervalo !== undefined && this.recurrencia!.intervalo < 1) {
      errors.push('El intervalo debe ser al menos 1');
    }

    if (this.recurrencia!.dias_semana) {
      for (const dia of this.recurrencia!.dias_semana) {
        if (dia < 0 || dia > 6) {
          errors.push('Los días de la semana deben estar entre 0 (Domingo) y 6 (Sábado)');
          break;
        }
      }
    }

    if (this.recurrencia!.dia_mes !== undefined && (this.recurrencia!.dia_mes < 1 || this.recurrencia!.dia_mes > 31)) {
      errors.push('El día del mes debe estar entre 1 y 31');
    }

    return errors;
  }

  // Método para obtener objeto plano
  toPlainObject(): Record<string, any> {
    return {
      titulo: this.titulo,
      descripcion: this.descripcion,
      fecha_inicio: this.fecha_inicio,
      fecha_fin: this.fecha_fin,
      todo_el_dia: this.todo_el_dia,
      calendario_id: this.calendario_id,
      recurrencia: this.recurrencia,
      ubicacion: this.ubicacion,
    };
  }
}

export class RecurrenciaDto implements IRecurrenciaDto {
  tipo: 'diario' | 'semanal' | 'mensual' | 'anual';
  fin?: Date;
  repeticiones?: number;
  intervalo?: number;
  dias_semana?: number[];
  dia_mes?: number;

  constructor(data: any) {
    this.tipo = data.tipo;
    this.fin = data.fin ? new Date(data.fin) : undefined;
    this.repeticiones = data.repeticiones;
    this.intervalo = data.intervalo || 1;
    this.dias_semana = data.dias_semana;
    this.dia_mes = data.dia_mes;
  }

}
