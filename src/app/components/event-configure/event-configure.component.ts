import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EventResponse} from "../../lib/responses";
import {ErrorHandler} from "../../lib/errors";
import {ActivatedRoute, Router} from "@angular/router";
import {EventsService} from "../../services/events.service";
import {AuthService} from "../../services/auth.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-event-configure',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './event-configure.component.html',
  styleUrl: './event-configure.component.scss'
})
export class EventConfigureComponent implements OnInit {
  form?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventsService: EventsService,
    private authService: AuthService
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
    if (!this.isEventOrganizer(event)) {
      this.router.navigate(['events', event.activity_id])
      return
    }

    this.form = this.fb.group({
      containers: this.fb.array([this.createContainer()])
    })
  }

  private onEventError(err: Error): void {
    new ErrorHandler(this.authService).processErrorResponse(err);
  }

  /**
   * Determine if the viewer is the organizer.
   * @param event
   */
  isEventOrganizer(event: EventResponse): boolean {
    return event.organizer_id == this.authService.getAccountId()
  }

  private createContainer(): FormGroup {
    return this.fb.group({
      image: [
        "",
        [
          Validators.required
        ]
      ]
    })
  }

  get containers(): FormArray {
    return this.form?.get('containers') as FormArray
  }

  addContainer(): void {
    this.containers.push(this.createContainer())
  }

  removeContainer(index: number): void {
    this.containers.removeAt(index)
  }

  onSubmit(): void {
    console.log(this.containers.value)
  }
}
