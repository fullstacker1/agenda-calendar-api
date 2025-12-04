import { Router } from "express";
import { EventsController } from "./controller";
import { EventService } from "../services/event.service";


export class EventsRoutes {

    static get routes() {

        const router = Router();

        const eventService = new EventService(); 
        const eventsController = new EventsController(eventService); 

        //POST / api / events - Crear evento grupal
        router.post('/create', eventsController.createEvent)
        
        //GET / api / events - Listar eventos(con filtros)
        router.get('/list', eventsController.listEvents);

        // PUT / api / events / { title } - Actualizar evento
         router.put('/:id', eventsController.updateEvent);

        // DELETE / api / events / { id } - Cancelar evento
        router.delete('/:id', eventsController.cancelEvent);

        // POST / api / events / { id } / clone - Clonar evento recurrente
        router.post('/:id/clone', eventsController.cloneEvent);

        return router;
    }
}