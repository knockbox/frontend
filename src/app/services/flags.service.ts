import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FlagHistoryResponse, FlagResponse} from "../lib/responses";
import {environment} from "../../environments/environment";
import {FlagCreateInput, FlagUpdateInput} from "../lib/inputs";

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  constructor(private http: HttpClient) {
  }

  /**
   * Create a flag for the given activity_id
   * @param activity_id the activity_id of the event
   * @param input
   */
  createFlag(activity_id: string, input: FlagCreateInput): Observable<void> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/flags`;
    return this.http.post<void>(endpoint, input);
  }

  /**
   * Update a flag for the given activity_id
   * @param activity_id the activity_id of the event
   * @param flag_id the id of the flag to update.
   * @param input
   */
  updateFlag(activity_id: string, flag_id: string, input: FlagUpdateInput): Observable<void> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/flags/${flag_id}`;
    return this.http.put<void>(endpoint, input);
  }

  /**
   * Delete a flag for the given activity_id
   * @param activity_id the activity_id of the event
   * @param flag_id the id of the flag to update.
   */
  deleteFlag(activity_id: string, flag_id: string): Observable<void> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/flags/${flag_id}`;
    return this.http.delete<void>(endpoint);
  }

  /**
   * Returns all the flags, if any exist, for the given event
   * @param activity_id the activity_id of the event.
   */
  getAllFlags(activity_id: string): Observable<FlagResponse[] | null> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/flags`;
    return this.http.get<FlagResponse[] | null>(endpoint);
  }

  /**
   * Returns all the history, if any exist, for the given event
   * @param activity_id the activity_id of the event.
   */
  getAllFlagHistory(activity_id: string): Observable<FlagHistoryResponse[] | null> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/flags/history`;
    return this.http.get<FlagHistoryResponse[] | null>(endpoint);
  }
}
