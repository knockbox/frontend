import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TokenResponse} from "../../lib/responses";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
        ],
      ],
    })
  }

  onSubmit(): void {
    const username = this.form.get('username')?.value as string
    const password = this.form.get('password')?.value as string
    const email = this.form.get('email')?.value as string

    if (!username) {
      alert('Missing Username');
      return
    }

    if (!password) {
      alert('Missing Password');
      return;
    }

    if (!email) {
      alert('Missing Email');
      return;
    }

    const input = {username, password, email}
    this.authService.register(input).subscribe({
      error: this.onError.bind(this),
      complete: () => this.router.navigate(['login']),
    })
  }

  private onError(err: any): void {
    console.log(err);
    alert('Registration failed, please try again.');
  }
}
