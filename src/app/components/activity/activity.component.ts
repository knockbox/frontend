import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventResponse, TaskResponse} from "../../lib/responses";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {BehaviorSubject, skip} from "rxjs";
import {RouterLink} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CdkCopyToClipboard, Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    AsyncPipe,
    RouterLink,
    CdkCopyToClipboard
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

  constructor(
    private clipboard: Clipboard,
    private taskService: TaskService
  ) {
  }

  ngOnInit() {
    this.getTask(true)
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
}

