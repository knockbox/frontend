import {Component, input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {TokenResponse} from "../lib/responses";
import {TokenService} from "../services/token.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(16),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(32),
        ],
      ]
    })
  }

  onSubmit(): void {
    const username = this.form.get('username')?.value as string
    const password = this.form.get('password')?.value as string

    if (!username) {
      alert('Missing Username');
      return
    }

    if (!password) {
      alert('Missing Password');
      return;
    }

    const input = {username, password}
    this.authService.login(input).subscribe({
      next: this.onSuccess.bind(this),
      error: this.onError.bind(this),
      complete: () => this.authService.setLoggedIn(true),
    })
  }

  private onSuccess(token: TokenResponse): void {
    this.tokenService.saveToken(token.access_token);
    this.router.navigate(['events'])
  }

  private onError(err: any): void {
    console.log(err);
    alert('Login failed, please try again.')
  }
}
