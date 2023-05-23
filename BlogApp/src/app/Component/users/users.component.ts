import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserservicesService } from 'src/app/services/userservices.service';
import { FdialogComponent } from '../fdialog/fdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  id:any;
  USER:any;
  Authtoken: any;
  Fllowing: number;
  Fllowers: number;
  BlogsContent: any;

  constructor(
    private activatedrouter: ActivatedRoute,
    private toastr: ToastrService,
    private api: UserservicesService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userinfo();
  }

  userinfo() {
    this.Authtoken = localStorage.getItem('token');
    this.api.Userdataget(this.Authtoken).subscribe({
      next: (res) => {
        if (res.success) {
          this.USER = res.Userdata
          this.id= res.Userdata._id
          this.BlogsContent = res.Blog;
        } else {
          this.toastr.warning(res.error);
        }
      },
      error: (er) => {
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
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


  
  delete(bid: any) {
    this.api.DeleteBlog(this.Authtoken, bid).subscribe({
      next: (res) => {
        if (res.success) {
          this.BlogsContent.splice(bid, 1);
          this.toastr.success('blog delete Successfully', 'success');
        } else {
          this.toastr.warning('blog not delete Successfully', 'error');
        }
      },
      error: (er) => {
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }

  edit(bid:any){
    this.router.navigate([`/editblog/${this.id}/${bid}`]);
  }
}
