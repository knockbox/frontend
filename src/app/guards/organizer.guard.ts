import {CanActivateChildFn} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {EventsService} from "../services/events.service";
import {catchError, map, of} from "rxjs";

export const organizerGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService)
  const eventsService = inject(EventsService)

  const event_id = childRoute.params['event_id'] as string
  return eventsService.getEvent(event_id).pipe(
    map(event => {
      return event.organizer_id === authService.getAccountId();
    }),
    catchError(error => of(false))
  )
};
