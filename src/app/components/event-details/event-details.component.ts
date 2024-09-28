import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {EventsService} from "../../services/events.service";
import {EventResponse} from "../../lib/responses";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {
  event?: EventResponse


  constructor(
    private activatedRoute: ActivatedRoute,
    private eventsService: EventsService
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
  }

  private onEventError(err: Error): void {
    console.log(err);
    alert("Failed to get all events");
  }
}
