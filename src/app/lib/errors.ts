import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../services/auth.service";

export class ErrorHandler {
  constructor(private authService: AuthService) {
  }

  processErrorResponse(err: Error): boolean {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this.authService.logout();
        return true;
      }
    }

    return false;
  }
}
