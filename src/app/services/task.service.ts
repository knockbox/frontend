import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TaskResponse} from "../lib/responses";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) {
  }

  /**
   * Starts a task for the event.
   * @param activity_id the activity_id of the event.
   */
  startTask(activity_id: string): Observable<void> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/task`;
    return this.http.put<void>(endpoint, null)
  }

  /**
   * Stops a task for the event.
   * @param activity_id the activity_id of the event.
   */
  stopTask(activity_id: string): Observable<void> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/task`;
    return this.http.delete<void>(endpoint)
  }

  /**
   * Gets a task for the event.
   * @param activity_id the activity_id of the event.
   */
  getTask(activity_id: string): Observable<TaskResponse> {
    const endpoint = `${environment.matchboxApiUrl}/events/${activity_id}/task`;
    return this.http.get<TaskResponse>(endpoint)
  }
}
