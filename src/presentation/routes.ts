import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { EventsRoutes } from "./events/routes";
import { ParticipantRoutes } from "./participants/routes";
import { NotificationRoutes } from "./notifications/routes";

export class AppRoutes {


    static get routes(): Router {

        const router = Router();

        // Authentication Routes 
        router.use('/api/auth', AuthRoutes.routes)
        // Events Routes
        router.use('/api/events', EventsRoutes.routes)
        // Participants Routes
        router.use('/api/participants', ParticipantRoutes.routes);
        // Notifications Routes
        router.use('/api/notifications', NotificationRoutes.routes);

        return router;

    }

}