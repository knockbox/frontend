import {Component, Input, OnInit} from '@angular/core';
import {EventResponse, ParticipantResponse, UserResponse} from "../../lib/responses";
import {NgForOf} from "@angular/common";
import {ParticipantService} from "../../services/participant.service";
import {UsersService} from "../../services/users.service";
import {catchError, combineLatest, Observable, of} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ParticipantInput} from "../../lib/inputs";

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent implements OnInit {
  @Input() event!: EventResponse;

  searchForm!: FormGroup;

  participants?: ParticipantResponse[];
  users?: UserResponse[];
  searchResults?: UserResponse[];

  constructor(
    private fb: FormBuilder,
    private participantService: ParticipantService,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: [
        {
          value: "",
          disabled: false,
        },
        [Validators.required]
      ]
    });
    this.reloadParticipants();
  }

  private reloadParticipants(): void {
    this.searchResults = [];
    this.participantService.getAllParticipants(this.event.activity_id).subscribe({
      next: (participants) => {
        this.participants = participants = participants || [];

        // Map all the sub-requests for user details.
        const requests$ = participants.map(p => this.usersService.getByAccountId(p.participant_id).pipe(catchError(() => of(null))))

        // Combine them as they complete.
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

  getParticipantForUser(user: UserResponse): ParticipantResponse {
    return this.participants!.find(p => p.participant_id === user.account_id)!
  }

  onSearch(): void {
    const {search} = this.searchForm.value

    this.usersService.getLikeUsername(search).subscribe({
      next: (users) => {
        if (!users) {
          alert(`'No users found like: '${search}'`);
          return
        }

        this.searchResults = users.filter(u => !this.getParticipantForUser(u));
      },
      error: (err) => {
        alert(`Search failed for users like: '${search}'`);
      }
    })
  }

  inviteUser(account_id: string): void {
    const {activity_id} = this.event;
    const input: ParticipantInput = {
      status: 'invited',
      can_invite: false,
      can_manage: false,
    }

    this.participantService.createParticipant(activity_id, account_id, input).subscribe({
      next: () => this.reloadParticipants(),
      error: (err) => {
        console.error(err);
        alert('failed to invite user');
      }
    })
  }
}
