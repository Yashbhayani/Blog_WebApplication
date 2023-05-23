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
import { RegistrationServiceService } from 'src/app/services/registration-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  gender = ['Male', 'Female', 'Other'];
  UserForm!: FormGroup;
  otpForm!: FormGroup;
  Authtoken: any;
  OTPVarifide: string = '';
  actionBtn: string = 'Signup';
  hide = true;
  Authdata = new Array();
  OTPACTIVE: boolean = false;
  SIGACTIVE: boolean = true;
  EMAIL: string = '';
  display: any;
  ClickOn = true;
  cookieValue: any;
  db1;
  constructor(
    private formBuilder: FormBuilder,
    private api: RegistrationServiceService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      Surname: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      MobileNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
      ],
      Email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ]),
      ],
      Birthdate: ['', Validators.required],
      Password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ]),
      ],
      Gender: ['', Validators.required],
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

  addUser() {
    if (this.UserForm.valid) {

      let data = {
        Surname: this.UserForm.value.Surname,
        FirstName: this.UserForm.value.FirstName,
        LastName: this.UserForm.value.LastName,
        MobileNumber: this.UserForm.value.MobileNumber,
        Email: this.UserForm.value.Email,
        Birthdate: this.UserForm.value.Birthdate,
        Password: this.UserForm.value.Password,
        Gender: this.UserForm.value.Gender,
      };

      this.api.Signup(data).subscribe({
        next: (res) => {
          this.Authtoken = res.authToken;
          this.OTPVarifide = res.OTP;
          if (res.success) {
            this.EMAIL = this.UserForm.value.Email;
            this.UserForm.reset();
            this.toastr.success('success', 'Account is Created');
            this.timer(2);
            this.SIGACTIVE = false;
            this.OTPACTIVE = true;
          } else {
            this.toastr.warning(res.error);
          }
        },
        error: () => {
          this.toastr.error('Error while adding the information.');
        },
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
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
      this.SIGACTIVE = true;
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
              localStorage.setItem('Userinfo', JSON.stringify(res.UDATA));
              localStorage.setItem('token', this.Authtoken);
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
