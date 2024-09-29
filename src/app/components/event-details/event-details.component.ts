import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {EventsService} from "../../services/events.service";
import {EventResponse} from "../../lib/responses";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {ErrorHandler} from "../../lib/errors";
import {FlagDetailsComponent} from "../flag-details/flag-details.component";
import {ParticipantsComponent} from "../participants/participants.component";
import {ParticipantService} from "../../services/participant.service";
import {ParticipantInput} from "../../lib/inputs";
import {BehaviorSubject, Observable, of} from "rxjs";
import {ActivityComponent} from "../activity/activity.component";

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    FlagDetailsComponent,
    RouterOutlet,
    ParticipantsComponent,
    AsyncPipe,
    ActivityComponent
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {
  event?: EventResponse

  isParticipant$ = new BehaviorSubject<boolean>(false)

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private eventsService: EventsService,
    private participantService: ParticipantService,
  ) {
  }

  ngOnInit(): void {
    const event_id = this.activatedRoute.snapshot.params['event_id'] as string
    this.eventsService.getEvent(event_id).subscribe({
      next: this.onEventSuccess.bind(this),
      error: this.onEventError.bind(this)
    })
  }

  private onEventSuccess(event: EventResponse): void {
    this.event = event;

    this.participantService.getAllParticipants(event.activity_id).subscribe({
      next: (participants) => {
        if (!participants) return

        const isParticipant = !!participants.find(p => p.participant_id === this.authService.getAccountId())
        this.isParticipant$.next(!isParticipant && !this.isEventOrganizer() && !event.private)
      },
      error: console.error
    })
  }

  private onEventError(err: Error): void {
    new ErrorHandler(this.authService).processErrorResponse(err);
  }

  /**
   * Determine if the viewer is the organizer.
   */
  isEventOrganizer(): boolean {
    return this.event?.organizer_id == this.authService.getAccountId()
  }

  joinEvent(): void {
    const account_id = this.authService.getAccountId();
    if (!account_id) {
      alert('Please login and try again')
      return
    }

    if (!this.event) {
      alert('This event does not exist')
      return
    }

    const {activity_id} = this.event;
    const input: ParticipantInput = {
      status: 'member',
      can_invite: false,
      can_manage: false,
    }

    this.participantService.createParticipant(activity_id, account_id, input).subscribe({
      next: () => {
        alert('You have successfully join this event');
      },
      error: (err) => {
        console.error(err)
        alert('Failed to join event');
      }
    })
  }
}
