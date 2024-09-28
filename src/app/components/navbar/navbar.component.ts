import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TokenService} from "../../services/token.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        RouterLink,
        AsyncPipe,
        NgIf
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    constructor(
        public authService: AuthService,
        private tokenService: TokenService
    ) {
    }

    /**
     * Handles token revoking for logout.
     */
    onLogout(): void {
        this.tokenService.logout();
    }
}
