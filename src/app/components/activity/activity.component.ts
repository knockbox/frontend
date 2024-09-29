import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventResponse} from "../../lib/responses";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  @Input() event!: EventResponse;
  @Input() isEventOrganizer!: boolean;
  @Input() isParticipant$!: BehaviorSubject<boolean>;

  @Output() join = new EventEmitter<void>();
}
