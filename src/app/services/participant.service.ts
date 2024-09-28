import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ParticipantResponse} from "../lib/responses";
import {environment} from "../../environments/environment";
import {ParticipantInput} from "../lib/inputs";

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private http: HttpClient) {
  }

  /**
   * Get all the participants for an event
   * @param activity_id the activity_id of the event
   */
  getAllParticipants(activity_id: string): Observable<ParticipantResponse[] | null> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/participants`;
    return this.http.get<ParticipantResponse[] | null>(endpoint);
  }

  /**
   * Create a participant for an event
   * @param activity_id the activity_id of the event
   * @param participant_id the account_id to invite.
   * @param input
   */
  createParticipant(activity_id: string, participant_id: string, input: ParticipantInput): Observable<void> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/participants/${participant_id}`;
    return this.http.post<void>(endpoint, input);
  }
}
