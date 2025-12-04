import { log } from "node:console";
import { EventModel } from "../../data/models/eventos.model";
import { CreateEventoDto } from "../../domain/dtos/events/create-event-dto";
import { CustomError } from "../../domain/entities/errors/customErrors";

export class EventService {

    constructor() { }

    public async createEvent(createEventDto: CreateEventoDto) {

        const existingEvent = await EventModel.findOne({
            titulo: createEventDto.titulo,

            //todo verificar si la fecha y el calendario 
            //todo existen para no ingresar o sobreponer eventos en la misma fecha 

            // fecha_inicio: createEventDto.fecha_inicio,
            // calendario_id: createEventDto.calendario_id

        }).exec();

        if (existingEvent) { throw CustomError.badRequest('event already exist') }

        try {

            const event = new EventModel(createEventDto);

            await event.save();

            console.log(
                'created'
            );

            return event;
        } catch (error) {
            log(error);
            throw CustomError.badRequest(`${error}`);
        }
    }

    public async listEvents() {
        try {

            const events = await EventModel.find().exec();
            return events;

        } catch (error) {

            throw CustomError.badRequest(`${error}`);

        }
    }

    public async updateEvent(id: string, updateData: Partial<CreateEventoDto>) {
        const { titulo, descripcion, fecha_inicio, fecha_fin, todo_el_dia, ubicacion } = updateData
        try {

            const event = await EventModel.findById(id).exec();
            if (event) {
                const doc = await EventModel.findByIdAndUpdate(id, {
                    titulo, descripcion, fecha_fin, fecha_inicio, todo_el_dia, ubicacion
                })
                await doc.save()
            }

        } catch (error) {

            throw CustomError.badRequest(`${error}`)

        }

    }

    public async cancelEvent(id: string) {

        const event = await EventModel.findById(id).exec();

        if (!event) {
            throw CustomError.notFound('Event not found');
        }

        try {

            await EventModel.findByIdAndDelete(id).exec();
        } catch (error) {
            throw CustomError.badRequest(`${error}`);
        }

    }

    public async cloneEvent(id: string) {
        
        const event = await EventModel.findById(id).exec();

        if (!event) {
            throw CustomError.notFound('Event not found');
        }

        try {

            const clonedEvent = new EventModel({
                ...event.toObject(),
                _id: undefined, // Deja que Mongoose genere un nuevo ID
                titulo: `${event.titulo} (Clonado)`,
                fecha_inicio: new Date(event.fecha_inicio.getTime() + 7 * 24 * 60 * 60 * 1000), // Clonado para una semana después
                fecha_fin: new Date(event.fecha_fin.getTime() + 7 * 24 * 60 * 60 * 1000)
            });
            await clonedEvent.save();
            return clonedEvent;

        } catch (error) {
            throw CustomError.badRequest(`${error}`);
        }

    }

}