import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';
import { UserservicesService } from 'src/app/services/userservices.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FdialogComponent } from '../fdialog/fdialog.component';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css'],
})
export class UserinfoComponent {
  name: any = null;
  id: any = null;
  Username: any;
  Authtoken: any;
  USER = new Array();
  BlogsContent: any;
  Fllowers: any;
  Fllowing: any;
  BlogPost: any;
  Userdata: any;
  UserFollow: any;
  UserFollow_Follow: any;
  color = 'primary';
  Buttonname = 'Follow';
  constructor(
    private activatedrouter: ActivatedRoute,
    private api: BlogservicesService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.name = this.activatedrouter.snapshot.paramMap.get('name');
    this.id = this.activatedrouter.snapshot.paramMap.get('id');
    if (
      this.activatedrouter.snapshot.paramMap.get('id') === null ||
      this.activatedrouter.snapshot.paramMap.get('id') === undefined
    ) {
      this.router.navigate(['/']);
    } else {
      this.Userinfomation();
   
    }

  }

  Userinfomation() {
    this.Authtoken = localStorage.getItem('token');
    this.api.OtherUserdataget(this.Authtoken, this.id).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.user._id === this.id) {
            this.router.navigate(['/user']);
          } else {
            this.Fllowers = res.UDATA.Followers;
            this.Fllowing = res.UDATA.Following;
            this.BlogPost = res.UDATA.BlogPost;
            this.Userdata = res.user;
            this.USER.push(res.UDATA);
            this.BlogsContent = res.blog;
            this.UserFollow_Follow = res.usertrue[0].Follow;


            if (this.UserFollow_Follow.length === 0) {
              this.color = 'primary';
              this.Buttonname = 'Follow';
            } else {
              this.color = 'accent';
              this.Buttonname = 'Unfollow';
            }
          }
        } else {
          this.router.navigate(['/']);
          this.toastr.warning(res.error);
        }
      },
      error: (er) => {
        this.router.navigate(['/']);
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }

  followAndunfollow() {
    if (this.color === 'accent') {
      this.color = 'primary';
      this.Buttonname = 'Follow';
      this.Fllowers--;
      let Data = {
        userid: this.Userdata._id,
      };

      this.api.UserUnFollow(this.Authtoken, this.id, Data).subscribe({
        next: (res) => {},
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
    } else {
      this.color = 'accent';
      this.Buttonname = 'Unfollow';
      this.Fllowers++;

      let Data = {
        userid: this.Userdata._id,
        Firstname: this.Userdata.Firstname,
        surname: this.Userdata.surname,
      };
      this.api.UserFollow(this.Authtoken, this.id, Data).subscribe({
        next: (res) => {},
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
    }
  }

  openDialog() {
    if (this.Fllowers === 0) {
      this.toastr.warning("Followers not available", "Sorry");
    } else {
      this.dialog
        .open(DialogComponent, {
          width: '40%',
          data: this.id,
        })
        .afterClosed()
        .subscribe((val) => {});
    }
  }

  openFDialog(){
    if (this.Fllowing === 0) {
      this.toastr.warning("Fllowing not available", "Sorry");
    } else {
      this.dialog
      .open(FdialogComponent, {
        width: '40%',
        data: this.id,
      })
      .afterClosed()
      .subscribe((val) => {});
    }
  }
}
