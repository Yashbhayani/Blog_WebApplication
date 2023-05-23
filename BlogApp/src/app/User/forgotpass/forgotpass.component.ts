import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistrationServiceService } from 'src/app/services/registration-service.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css'],
})
export class ForgotpassComponent {
  hide = true;
  hidew = true;
  ForForm: any;
  otpForm: any;
  OTPACTIVE: boolean = false;
  FORACTIVE: boolean = true;
  Authtoken: any;
  OTPVarifide: string = '';
  EMAIL: string = '';
  display: any;
  ClickOn = true;
  Pass: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: RegistrationServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ForForm = this.formBuilder.group({
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
  modeval: any = 'indeterminate';
  DD = '';

  newpass() {
    if (this.ForForm.valid) {
      let data = {
        email: this.ForForm.value.Email,
        password: this.ForForm.value.Password,
      };
      this.api.Forgot(data).subscribe({
        next: (res) => {
          if (res.success) {
            this.EMAIL = this.ForForm.value.Email;
            this.Pass = this.ForForm.value.Password;
            this.OTPVarifide = res.OTP;
            this.Authtoken = res.authToken;
            this.ForForm.reset();
            this.timer(2);
            this.OTPACTIVE = true;
            this.FORACTIVE = false;
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
      this.api.ForresendOTPsend(this.Authtoken).subscribe({
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
      this.FORACTIVE = true;
    }
  }

  onotpvarification() {
    if (this.otpForm.valid) {
      if (this.OTPVarifide === this.otpForm.value.OTP) {
        let data = {
          OTP: this.otpForm.value.OTP,
          pass: this.Pass
        };
        this.api.Forotpvarification(data, this.Authtoken).subscribe({
          next: (res) => {
            if (res.success) {
              this.toastr.success('OTP varify success fully');
              this.router.navigate(['/login']);
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
