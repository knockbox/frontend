import {CanActivateFn, RedirectCommand, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {map} from "rxjs";

export const tokenGuard: CanActivateFn = (route, state) => {
    const router = inject(Router)
    const authService = inject(AuthService)

    return authService.isLoggedIn.pipe(
        map(isLoggedIn => {
            if (!isLoggedIn) {
                const path = router.parseUrl("/login");
                return new RedirectCommand(path, {skipLocationChange: true})
            }

            return true;
        })
    )
};
