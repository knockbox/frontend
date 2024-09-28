import {Component, inject, OnInit} from '@angular/core';
import {EventsService} from "../../services/events.service";
import {EventResponse} from "../../lib/responses";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorHandler} from "../../lib/errors";
import {AuthService} from "../../services/auth.service";

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

  constructor(
    private authService: AuthService,
    private eventsService: EventsService
  ) {
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
    new ErrorHandler(this.authService).processErrorResponse(err)
  }
}
