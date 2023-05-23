import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class RegistrationServiceService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:5000';
  }

  Login(data: any) {
    return this.http.post<any>('http://localhost:5000/auth/login', data);
  }

  Forgot(data: any) {
    return this.http.post<any>('http://localhost:5000/auth/forgot', data);
  }

  Signup(data: any) {
    return this.http.post<any>('http://localhost:5000/auth/register', data);
  }

  resendOTPsend(token: any) {
    return this.http.get<any>(
      'http://localhost:5000/auth/resendotp',
      this.headtok(token)
    );
  }

  otpvarification(data: any, token: any) {
    return this.http.post<any>(
      'http://localhost:5000/auth/otpverification',
      data,
      this.headtok(token)
    );
  }

  ForresendOTPsend(token: any) {
    return this.http.get<any>(
      'http://localhost:5000/auth/forresendOTP',
      this.headtok(token)
    );
  }

  Forotpvarification(data: any, token: any) {
    return this.http.post<any>(
      'http://localhost:5000/auth/forotpverification',
      data,
      this.headtok(token)
    );
  }

  headtok(token: any) {
    // debugger
    let api_key = token;
    const headerDict = {
      'Content-Type': 'application/json',
      //Accept: 'application/json',
      Authorization: api_key,
    };

    const requestOptionss = {
      headers: new HttpHeaders(headerDict),
    };

    return requestOptionss;
  }
}
