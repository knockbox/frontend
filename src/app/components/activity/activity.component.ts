import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventResponse, FlagHistoryResponse, TaskResponse, UserResponse} from "../../lib/responses";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {BehaviorSubject, catchError, combineLatest, max, min, of, skip} from "rxjs";
import {RouterLink} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CdkCopyToClipboard, Clipboard} from '@angular/cdk/clipboard';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EventsService} from "../../services/events.service";
import {FlagsService} from "../../services/flags.service";
import {ParticipantService} from "../../services/participant.service";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    AsyncPipe,
    RouterLink,
    CdkCopyToClipboard,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent implements OnInit {
  @Input() event!: EventResponse;
  @Input() isEventOrganizer!: boolean;
  @Input() isParticipant$!: BehaviorSubject<boolean>;

  @Output() join = new EventEmitter<void>();

  task?: TaskResponse;
  loading$ = new BehaviorSubject<boolean>(false);

  history: FlagHistoryResponse[] = [];
  users: UserResponse[] = [];

  captureForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clipboard: Clipboard,
    private taskService: TaskService,
    private eventsService: EventsService,
    private flagService: FlagsService,
    private usersService: UsersService,
  ) {
  }

  ngOnInit() {
    this.captureForm = this.fb.group({
      id: [
        {
          value: "",
          disabled: false,
        },
        [Validators.required, Validators.minLength(1)]
      ]
    })

    this.getTask(true)
    this.getFlagHistory()
  }

  copyIpAddress(ip: string) {
    this.clipboard.copy(ip)
  }

  startTask(): void {
    this.taskService.startTask(this.event.activity_id).subscribe({
      error: (err) => {
        console.error(err);
        alert('Failed to start task');
      },
      complete: () => {
        alert('Task starting...');
        this.getTask()
      }
    })
  }

  stopTask(): void {
    this.taskService.stopTask(this.event.activity_id).subscribe({
      error: (err) => {
        console.error(err);
        alert('Failed to stop task');
      },
      complete: () => {
        alert('Task stopping...');
        this.getTask()
      }
    })
  }

  getTask(skipAlert: boolean = false): void {
    this.loading$.next(true)

    this.taskService.getTask(this.event.activity_id).subscribe({
      next: (task) => {
        this.task = task;
        this.loading$.next(false)
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse && !skipAlert) {
          if (err.status === 403) {
            alert("You are not a member of this activity");
          } else if (err.error['error'] === "the task does not exist") {
            alert("You have not started a task yet")
          } else if (err.error['error'] === "the deployment is missing a task definition") {
            alert("This event has not been configured yet, please contact the event organizer")
          }
        }

        this.loading$.next(false)
        console.error(err);
      }
    })
  }

  isScoringActive(): boolean {
    const now = Date.now()
    const start = new Date(this.event.starts_at).valueOf()
    const end = new Date(this.event.ends_at).valueOf()

    return now >= start && now < end
  }

  captureFlag(): void {
    const {id} = this.captureForm.value
    const {activity_id} = this.event

    this.eventsService.captureFlag(activity_id, id).subscribe({
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          alert(err.error['error']);
          return
        }
      },
      complete: () => {
        alert('Flag captured!');
        this.captureForm.reset();
      }
    })
  }

  getFlagHistory(): void {
    const {activity_id} = this.event

    this.flagService.getAllFlagHistory(activity_id).subscribe({
      next: (history) => {
        this.history = history ? history : [];

        const requests$ = this.history.map(r => this.usersService.getByAccountId(r.redeemer_id).pipe(catchError(() => of(null))))
        combineLatest(requests$).subscribe({
          next: (users) => {
            this.users = users ? users.filter(u => u !== null) : [];
          },
          error: console.error,
        })
      },
      error: console.error
    })
  }

  getUserForHistory(history: FlagHistoryResponse): UserResponse {
    return this.users.find(u => u.account_id === history.redeemer_id)!
  }

  getScoreForHistory(history: FlagHistoryResponse): number {
    const end = new Date(this.event.ends_at).valueOf()
    const at = new Date(history.timestamp).valueOf()
    const score = Math.round((end-at) / 1000000);

    return Math.max(score, 0)
  }
}
