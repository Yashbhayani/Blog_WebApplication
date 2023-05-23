import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';
import { UserservicesService } from 'src/app/services/userservices.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  dataloader: boolean = false;
  Authtoken: any;
  SpinnerActive: boolean = true;
  Spinner: string = 'assets/spinner/loading.gif';
  login_Active: boolean = false;
  login_Not_Active: boolean = true;
  FData:any;
  FNewData:any;
  HomeUserData:any;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public id: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private route: Router,
    private toastr: ToastrService,
    private dialog: MatDialogRef<DialogComponent>,
    private api: UserservicesService,
    private FandUapi: BlogservicesService
  ) {}

  Follow:any;

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      this.Spinonn();
    });
    this.Spinnnerfunctions();
  }

  Spinonn() {
    this.SpinnerActive = true;
    this.dataloader = false;
  }

  Spinnnerfunctions() {
    setInterval(() => {
      this.SpinnerActive = false;
      this.dataloader = true;
    }, 2000);
    this.getFollowers();
  }

  getFollowers() {
    if (this.id === null || this.id === undefined || this.id === '') {
      this.dialogRef.close();
    } else {
      this.Authtoken = localStorage.getItem('token');
      this.api.getFollowers(this.Authtoken, this.id).subscribe({
        next: (res) => {
          
          this.Follow = res.follow.Follow;
          this.FNewData =res.ff[0].followings.Following;
          
          this.HomeUserData=res.user;
          this.FData = this.FNewData.map(function(o:any) { return o.U_id;})

        },
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
    }
  }


  Usernavigat(userid:any ,Firstname:any, surname:any){
    this.dialogRef.close();
    this.route.navigate([`/userinfo/${userid}/${Firstname} ${surname}`]);
  }




    Followuser(id:any){

      let Data = {
        userid: this.HomeUserData._id,
        Firstname: this.HomeUserData.Firstname,
        surname: this.HomeUserData.surname,
      };

      this.FandUapi.UserFollow(this.Authtoken, id, Data).subscribe({
        next: (res) => {},
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
      this.FData.push(id);
    }

    UnFollowuser(id:any){
      let Data = {
        userid: this.HomeUserData._id,
      };
      this.FandUapi.UserUnFollow(this.Authtoken, id, Data).subscribe({
        next: (res) => {},
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });

      let i = this.FData.indexOf(id)
      this.FData.splice(i, 1);
    }

}


