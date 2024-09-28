import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EventResponse} from "../../lib/responses";
import {ErrorHandler} from "../../lib/errors";
import {ActivatedRoute, Router} from "@angular/router";
import {EventsService} from "../../services/events.service";
import {AuthService} from "../../services/auth.service";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {EventConfigureInput} from "../../lib/inputs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-event-configure',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    JsonPipe
  ],
  templateUrl: './event-configure.component.html',
  styleUrl: './event-configure.component.scss'
})
export class EventConfigureComponent implements OnInit {
  form?: FormGroup;
  errHandler!: ErrorHandler

  private event?: EventResponse;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventsService: EventsService,
    private authService: AuthService
  ) {
    this.errHandler = new ErrorHandler(authService);
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

    if (!this.isEventOrganizer(event)) {
      this.router.navigate(['events', event.activity_id])
      return
    }

    this.form = this.fb.group({
      containers: this.fb.array([this.createContainer()])
    })
  }

  private onEventError(err: Error): void {
    if (this.errHandler.processErrorResponse(err)) return;

    alert((err as HttpErrorResponse).message);
  }

  /**
   * Determine if the viewer is the organizer.
   * @param event
   */
  isEventOrganizer(event: EventResponse): boolean {
    return event.organizer_id == this.authService.getAccountId()
  }

  /**
   * Create a new container entry for the form.
   * @private
   */
  private createContainer(): FormGroup {
    return this.fb.group({
      image: [
        {
          value: "",
          disabled: false,
        },
        [
          Validators.required
        ]
      ],
      env: this.fb.array([]),
      ports: this.fb.array([]),
      volumes: this.fb.array([]),
      essential: [
        {
          value: true,
          disabled: false,
        },
        [
          Validators.required,
        ]
      ]
    })
  }

  /**
   * Create a new Environment variable.
   * @private
   */
  private createEnv(): FormGroup {
    return this.fb.group({
      key: [
        {
          value: "",
          disabled: false,
        },
        [
          Validators.required
        ]
      ],
      value: [
        {
          value: "",
          disabled: false,
        },
        [
          Validators.required
        ]
      ]
    })
  }

  /**
   * Create a new Port.
   * @private
   */
  private createPort(): FormGroup {
    return this.fb.group({
      container_port: [
        {
          value: 8080,
          disabled: false,
        },
        [
          Validators.required
        ]
      ],
      name: [
        {
          value: 'http',
          disabled: false
        },
        [
          Validators.required
        ]
      ]
    })
  }

  /**
   * Create a new Volume.
   * @private
   */
  private createVolume(): FormGroup {
    return this.fb.group({
      path: [
        {
          value: "/mnt/efs",
          disabled: false,
        },
        [
          Validators.required
        ]
      ],
      source: [
        {
          value: "efs",
          disabled: false,
        },
        [
          Validators.required
        ]
      ],
      read_only: [
        {
          value: false,
          disabled: false,
        },
        [
          Validators.required
        ]
      ]
    })
  }

  /**
   * Get all the containers for the form.
   */
  get containers(): FormArray {
    return this.form?.get('containers') as FormArray
  }

  /**
   * Add a container to the form.
   */
  addContainer(): void {
    this.containers.push(this.createContainer())
  }

  /**
   * Remove a container from the form.
   * @param index
   */
  removeContainer(index: number): void {
    this.containers.removeAt(index)
  }

  /**
   * Get all the container envs.
   * @param containerIndex
   */
  containerEnvs(containerIndex: number): FormArray {
    return this.containers.at(containerIndex).get('env') as FormArray;
  }

  /**
   * Add a new env to the container.
   * @param containerIndex
   */
  addContainerEnv(containerIndex: number): void {
    this.containerEnvs(containerIndex).push(this.createEnv());
  }

  /**
   * Remove an env from the container.
   * @param containerIndex
   * @param envIndex
   */
  removeContainerEnv(containerIndex: number, envIndex: number): void {
    this.containerEnvs(containerIndex).removeAt(envIndex);
  }

  /**
   * Get all the container ports.
   * @param containerIndex
   */
  containerPorts(containerIndex: number): FormArray {
    return this.containers.at(containerIndex).get('ports') as FormArray;
  }

  /**
   * Add a new port to the container.
   * @param containerIndex
   */
  addContainerPort(containerIndex: number): void {
    this.containerPorts(containerIndex).push(this.createPort());
  }

  /**
   * Remove a port from the container.
   * @param containerIndex
   * @param portIndex
   */
  removeContainerPort(containerIndex: number, portIndex: number): void {
    this.containerPorts(containerIndex).removeAt(portIndex);
  }

  /**
   * Get all the volumes for a container.
   * @param containerIndex
   */
  containerVolumes(containerIndex: number): FormArray {
    return this.containers.at(containerIndex).get('volumes') as FormArray;
  }

  /**
   * Add a new volume to the container.
   * @param containerIndex
   */
  addContainerVolume(containerIndex: number): void {
    this.containerVolumes(containerIndex).push(this.createVolume());
  }

  /**
   * Remove a volume from the container.
   * @param containerIndex
   * @param volumeIndex
   */
  removeContainerVolume(containerIndex: number, volumeIndex: number): void {
    this.containerVolumes(containerIndex).removeAt(volumeIndex);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    const input = this.form!.value as EventConfigureInput;
    input.cpu = "256";
    input.memory = "512";

    this.eventsService.configureEvent(this.event!.activity_id, input).subscribe({
      error: this.onEventConfigureError.bind(this),
      complete: () => this.router.navigate(['events', this.event!.activity_id])
    })
  }

  private onEventConfigureError(err: Error): void {
    if (this.errHandler.processErrorResponse(err)) return;

    console.error(err);
    alert((err as HttpErrorResponse).message);
  }
}
