import {Component, Input, OnInit} from '@angular/core';
import {EventResponse, FlagResponse} from "../../lib/responses";
import {FlagsService} from "../../services/flags.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlagCreateInput, FlagUpdateInput} from "../../lib/inputs";

@Component({
  selector: 'app-flag-details',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './flag-details.component.html',
  styleUrl: './flag-details.component.scss'
})
export class FlagDetailsComponent implements OnInit {
  @Input() event!: EventResponse;

  flags?: FlagResponse[];
  form?: FormGroup;
  createForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private flagsService: FlagsService
  ) {
  }

  ngOnInit(): void {
    this.reloadFlags();
    this.createForm = this.fb.group({
      difficulty: [
        {
          value: "very_easy",
          disabled: false,
        },
        [
          Validators.required
        ]
      ],
      env_var: [
        {
          value: "",
          disabled: false,
        },
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(128)
        ]
      ],
    })
  }

  private reloadFlags(): void {
    this.flagsService.getAllFlags(this.event.activity_id).subscribe({
      next: (flags) => {
        this.flags = flags ? flags : [];

        this.form = this.fb.group({
          flags: this.fb.array([]),
        })

        this.initFormFlags(this.flags)
      },
      error: console.error
    });
  }

  private createFromExistingFlag(flag: FlagResponse): FormGroup {
    return this.fb.group({
      flag_id: [
        {
          value: flag.flag_id,
          disabled: true,
        }
      ],
      difficulty: [
        {
          value: flag.difficulty,
          disabled: true,
        },
        [
          Validators.required
        ]
      ],
      env_var: [
        {
          value: flag.env_var,
          disabled: true,
        },
        [
          Validators.required
        ]
      ],
      editing: [
        {
          value: false,
          disabled: false,
        }
      ],
      hidden: [
        {
          value: false,
          disabled: false,
        }
      ]
    })
  }

  private initFormFlags(flags: FlagResponse[]) {
    flags.forEach(flag => this.formFlags.push(this.createFromExistingFlag(flag)));
  }

  get formFlags(): FormArray {
    return this.form?.get('flags') as FormArray
  }

  toggleFlagHidden(index: number): void {
    this.formFlags.at(index).get('hidden')?.setValue(!this.formFlags.at(index).get('hidden')?.value)
  }

  getFlagDisplay(index: number): string {
    if (this.isFlagEditing(index)) return "text";

    return this.formFlags.at(index).get('hidden')?.value ? "text" : "password";
  }

  toggleFlagEdit(index: number): void {
    this.formFlags.at(index).get('editing')?.setValue(!this.formFlags.at(index).get('editing')?.value)

    if (this.isFlagEditing(index)) {
      this.formFlags.at(index).get('difficulty')?.enable()
      this.formFlags.at(index).get('env_var')?.enable()
    } else {
      this.formFlags.at(index).get('difficulty')?.disable()
      this.formFlags.at(index).get('env_var')?.disable()
    }
  }

  saveFlagEdit(index: number): void {
    const {difficulty, env_var} = this.formFlags.at(index).value
    const input: FlagUpdateInput = {
      difficulty,
      env_var
    }
    const activity_id = this.event.activity_id;
    const flag_id = this.getFlagId(index);

    this.flagsService.updateFlag(activity_id, flag_id, input).subscribe({
      error: console.error,
      complete: () => this.reloadFlags()
    })
  }

  createFlag(): void {
    const {difficulty, env_var} = this.createForm.value
    const input: FlagCreateInput = {
      difficulty,
      env_var
    }
    const activity_id = this.event.activity_id;

    this.flagsService.createFlag(activity_id, input).subscribe({
      error: console.error,
      complete: () => this.reloadFlags()
    })
  }

  deleteFlag(index: number): void {
    const result = confirm("Are you sure you want to delete this flag?");
    if (!result) return;

    const flag_id = this.getFlagId(index);
    const activity_id = this.event.activity_id

    this.flagsService.deleteFlag(this.event.activity_id, flag_id).subscribe({
      error: console.error,
      complete: () => this.reloadFlags()
    })
  }

  isFlagEditing(index: number): boolean {
    return this.formFlags.at(index).get('editing')?.value
  }

  getFlagId(index: number): string {
    return this.formFlags.at(index).get('flag_id')?.value
  }
}
