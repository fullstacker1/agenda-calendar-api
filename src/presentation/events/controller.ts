import { Request, Response } from "express";
import { CreateEventoDto } from "../../domain/dtos/events/create-event-dto";
import { EventService } from "../services/event.service";
import { v4 as uuidv4 } from 'uuid';
import { UpdateEventoDto } from "../../domain/dtos/events/update-event-dto";

export class EventsController {

   constructor(
      private readonly eventService: EventService
   ) { }

   private handlerError(res: Response, error: unknown) {
      if (error instanceof Error) {
         return res.status(500).json({ message: error.message });
      }

      console.log(error);

      return res.status(500).json({ message: 'Error desconocido' });
   }

   // createEvent 
   createEvent = (req: Request, res: Response) => {

      const validator = new CreateEventoDto(req.body);

      if (!validator.calendario_id) {
         validator.calendario_id = uuidv4();
      }

      const errors = validator.validate();

      if (errors.length > 0) {
         return res.status(400).json({ errors });
      }

      this.eventService.createEvent(validator)
         .then(event => res.status(201).json(event))
         .catch(error => this.handlerError(res, error));

   }

   // listEvents
   listEvents = (req: Request, res: Response) => {

      this.eventService.listEvents()
         .then(events => res.status(200).json(events))
         .catch(error => this.handlerError(res, error));

   }

   // updateEvent
   updateEvent = (req: Request, res: Response) => {

      const { id } = req.params;
      const updateData: Partial<UpdateEventoDto> = req.body;

      this.eventService.updateEvent(id, updateData)
      res.status(200).json({ message: 'Update event endpoint hit', updateData });

   }

   // cancelEvent
   cancelEvent = (req: Request, res: Response) => {

      const { id } = req.params;

      this.eventService.cancelEvent(id)
         .then(() => res.status(200).json({ message: 'Cancel event endpoint hit' }))
         .catch(error => this.handlerError(res, error));

   }

   // cloneEvent

   cloneEvent = (req: Request, res: Response) => {

      const { id } = req.params;

      this.eventService.cloneEvent(id)
         .then(() => res.status(200).json({ message: 'Clone event endpoint hit' }))
         .catch(error => this.handlerError(res, error));

   }


}