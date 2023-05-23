import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ForgotpassComponent } from 'src/app/User/forgotpass/forgotpass.component';
import { RegistrationServiceService } from 'src/app/services/registration-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  LoginForm!: FormGroup;
  actionBtn: string = 'Login';
  OTPACTIVE: boolean = false;
  LOGACTIVE: boolean = true;
  otpForm!: FormGroup;
  Authtoken: any;
  OTPVarifide: string = '';
  hide = true;
  code = false;
  EMAIL: string = '';
  display: any;
  ClickOn = true;
  cookieValue: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: RegistrationServiceService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      Email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ]),
      ],
      Password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ]),
      ],
    });

    this.otpForm = this.formBuilder.group({
      OTP: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
      ],
    });
  }

  timer(minute: number) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        clearInterval(timer);
        this.display = 'Resend OTP';
        this.ClickOn = false;
      }
    }, 1000);
  }

  resendOTP() {
    if (this.Authtoken !== null && this.Authtoken !== undefined) {
      this.api.resendOTPsend(this.Authtoken).subscribe({
        next: (res) => {
          if (res.success) {
            this.OTPVarifide = res.OTP;
            this.Authtoken = res.authToken;
            this.timer(2);
            this.ClickOn = true;
          } else {
            this.toastr.warning(res.error);
          }
        },
        error: (er) => {
          this.toastr.error(er.error.errors, er.statusText);
        },
      });
    } else {
      this.OTPACTIVE = false;
      this.LOGACTIVE = true;
    }
  }

  addLoginUser() {
    if (this.LoginForm.valid) {
      let data = {
        email: this.LoginForm.value.Email,
        password: this.LoginForm.value.Password,
      };
      this.api.Login(data).subscribe({
        next: (res) => {
          if (res.success) {
            if (res.OTPSUCCESS === false) {
              this.OTPVarifide = res.OTP;
              this.Authtoken = res.authToken;
              this.EMAIL = this.LoginForm.value.Email;
              this.LoginForm.reset();
              this.timer(2);
              this.OTPACTIVE = true;
              this.LOGACTIVE = false;
            } else {
              this.Authtoken = res.authToken;
              localStorage.setItem('token', this.Authtoken);
              localStorage.setItem('Userinfo',JSON.stringify(res.UDATA));
              this.toastr.success('success', 'Login Successfully');
              this.router.navigate(['/']);
            }
          } else {
            this.toastr.warning(res.errors.code, res.errors.response);
          }
        },
        error: (er) => {
          console.log(er);
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }

  onotpvarification() {
    if (this.otpForm.valid) {
      if (this.OTPVarifide === this.otpForm.value.OTP) {
        let data = {
          OTP: this.otpForm.value.OTP,
        };
        this.api.otpvarification(data, this.Authtoken).subscribe({
          next: (res) => {
            if (res.success) {
              
              localStorage.setItem('token', this.Authtoken);
              localStorage.setItem('Userinfo', JSON.stringify(res.UDATA));
              /**/
              this.toastr.success('OTP varify success fully');
              this.router.navigate(['/']);
            } else {
              this.toastr.warning(res.error);
            }
          },
        });
      } else {
        this.toastr.warning('Please enter valid OTP.');
      }
    } else {
      this.toastr.warning('Please enter OTP.');
    }
  }
}
