// models/Evento.js
const mongoose = require('mongoose');
import { v4 as uuidv4 } from 'uuid';

const recurrenciaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['diario', 'semanal', 'mensual', 'anual'],
        required: true
    },
    fin: {
        type: Date,
    },
    repeticiones: {
        type: Number,
        min: 1
    },
    intervalo: {
        type: Number,
        default: 1, // Cada 1 día, 1 semana, etc.
        min: 1
    },
    dias_semana: [{
        type: Number, // 0: Domingo, 1: Lunes, ..., 6: Sábado
        min: 0,
        max: 6
    }],
    dia_mes: {
        type: Number,
        min: 1,
        max: 31
    }
}, { _id: false });

const eventoSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4() // Genera UUID automático
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        maxlength: [200, 'El título no puede exceder 200 caracteres'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fecha_inicio: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
        message: 'La fecha de inicio debe ser anterior a la fecha fin'
    },
    fecha_fin: {
        type: Date,
        required: [true, 'La fecha fin es obligatoria'],
        message: 'La fecha fin debe ser posterior a la fecha de inicio'
    },
    todo_el_dia: {
        type: Boolean,
        default: false
    },
    calendario_id: {
        type: mongoose.Schema.Types.UUID,
        ref: 'Calendario',
        required: [true, 'El calendario es obligatorio']
    },
    recurrencia: {
        type: recurrenciaSchema,
        default: null
    },
    ubicacion: {
        type: String,
        maxlength: 255,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Índices para mejor performance
eventoSchema.index({ calendario_id: 1, fecha_inicio: 1 });
eventoSchema.index({ fecha_inicio: 1 });
eventoSchema.index({ 'recurrencia.tipo': 1 });
eventoSchema.index({ created_at: -1 });

export const EventModel = mongoose.model('Event', eventoSchema)