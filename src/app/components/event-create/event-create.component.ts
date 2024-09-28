import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TokenResponse} from "../../lib/responses";
import {EventsService} from "../../services/events.service";
import {EventCreateInput} from "../../lib/inputs";
import {ErrorHandler} from "../../lib/errors";

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.scss'
})
export class EventCreateComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private eventsService: EventsService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(64)
        ]
      ],
      starts_at: [
        "",
        [
          Validators.required,
        ]
      ],
      ends_at: [
        "",
        [
          Validators.required,
        ]
      ],
      image_namespace: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256)
        ]
      ],
      image_repository: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256)
        ]
      ],
      image_tag: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256)
        ]
      ],
      private: [
        false,
        []
      ]
    })
  }

  onSubmit(): void {
    const name = this.form.get('name')?.value as string
    const starts_at = this.form.get('starts_at')?.value as string
    const ends_at = this.form.get('ends_at')?.value as string
    const image_namespace = this.form.get('image_namespace')?.value as string
    const image_repository = this.form.get('image_repository')?.value as string
    const image_tag = this.form.get('image_tag')?.value as string
    const isPrivate = this.form.get('private')?.value as boolean

    const input: EventCreateInput = {
      name,
      starts_at: new Date(starts_at).valueOf() as number / 1000,
      ends_at: new Date(ends_at).valueOf() as number / 1000,
      image_namespace,
      image_repository,
      image_tag,
      private: isPrivate
    }


    this.eventsService.createEvent(input).subscribe({
      error: this.onError.bind(this),
      complete: () => {
        this.router.navigate(['events'])
      }
    })
  }

  private onError(err: any): void {
    if (new ErrorHandler(this.authService).processErrorResponse(err)) return

    console.log(err);
    alert("Failed to Create Event");
  }
}
