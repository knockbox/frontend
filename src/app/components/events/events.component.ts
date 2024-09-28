import {Component, OnInit} from '@angular/core';
import {EventsService} from "../../services/events.service";
import {EventResponse} from "../../lib/responses";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events?: EventResponse[]

  constructor(private eventsService: EventsService) {
  }

  ngOnInit() {
    this.eventsService.getAllEvents().subscribe({
      next: this.onAllEventsSuccess.bind(this),
      error: this.onAllEventsError.bind(this)
    })
  }

  private onAllEventsSuccess(events: EventResponse[]): void {
    this.events = events;
  }

  private onAllEventsError(err: Error): void {
    console.log(err);
    alert("Failed to get all events");
  }
}
