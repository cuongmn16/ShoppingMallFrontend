import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ApiResponse} from '../../models/api-response';
import {AuthenticationResponse} from '../../models/response/authentication-response';
import {UserService} from '../../services/user.service';
import {ToastrModule, ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder,
              private loginService: UserService,
              private router: Router,
              private toastr: ToastrService,
  ) {}

    ngOnInit(): void {
      this.initLoginForm()
    }

    private initLoginForm() : void {
      this.loginForm = this.fb.group({
        username:['', [Validators.required, Validators.minLength(3)]],
        password:['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required]]
      },{
        validators: this.passwordMatchValidator('password', 'confirmPassword')
      });
    }


  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup): void => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return;
      }

      if (confirmPasswordControl.errors && !(confirmPasswordControl.errors['passwordMismatch'])) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({passwordMismatch: true});
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    console.log("tài khoản là " + username, password);
    this.loginService.login({ username, password }).subscribe({
      next: (response: ApiResponse<AuthenticationResponse>) => {
        if (response.result?.token) {
          this.loginService.setToken(response.result.token);
          this.toastr.success('Đăng nhập thành công', 'Thông báo', {timeOut : 2000});
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2500);

        }
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Đăng nhập thất bại, vui lòng thử lại';
        this.toastr.error(errorMessage, 'thất bại', {timeOut: 2000});
      },
    });
  }


  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get confirmPassword() {
    return this.loginForm.get('confirmPassword');
  }

}
