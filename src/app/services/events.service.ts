import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EventResponse} from "../lib/responses";
import {environment} from "../../environments/environment";
import {EventCreateInput} from "../lib/inputs";

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private http: HttpClient) {
  }

  /**
   * Returns all the Events.
   */
  getAllEvents(): Observable<EventResponse[]> {
    const endpoint = `${environment.matchboxApiUrl}/events`;
    return this.http.get<EventResponse[]>(endpoint);
  }

  /**
   * Returns a single Event.
   * @param activity_id
   */
  getEvent(activity_id: string): Observable<EventResponse> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}`;
    return this.http.get<EventResponse>(endpoint);
  }

  /**
   * Create an Event
   * @param input
   */
  createEvent(input: EventCreateInput): Observable<void> {
    const endpoint = `${environment.matchboxApiUrl}/events`;
    return this.http.post<void>(endpoint, input);
  }
}