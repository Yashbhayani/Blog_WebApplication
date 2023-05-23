import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
  blog: any;
  user: any;
  isDisabled: any = true;
  constructor(
    private activatedrouter: ActivatedRoute,
    private api: BlogservicesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  like = '';
  Username: any = null;
  fllatter: any = null;
  UserId: any;
  name: any = null;
  id: any = null;
  Usernamejs: any;
  BlogLikecount: any;
  BlogLikeArray: any;
  BlogsComment: any;
  yu: any = '';
  Userinfo: any;
  commentblogform = new FormGroup({
    Comment: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.id = this.activatedrouter.snapshot.paramMap.get('id');
    if (
      this.activatedrouter.snapshot.paramMap.get('id') === null ||
      this.activatedrouter.snapshot.paramMap.get('id') === undefined
    ) {
      this.router.navigate(['/']);
    } else {
      let ki: any = localStorage.getItem('Userinfo');
      this.Usernamejs = `${JSON.parse(ki).Firstname} ${JSON.parse(ki).surname}`;
      this.getallfunction();
    }
  }

  getallfunction() {
    let Authtoken = localStorage.getItem('token');
    this.api.getblogsid(Authtoken, this.id).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.blog === undefined || res.blog.Blog_content.length === 0) {
            this.router.navigate(['/']);
            this.toastr.warning('Blogs not found', 'Unsuccesfull');
          } else {
            console.log(res)
            this.blog = res.blog;
            this.user = res.user;
            this.Userinfo = res.userio;
            this.UserId = res.userio._id;
            this.BlogsComment = this.blog.comments;
            this.Username = `${this.user.Firstname} ${this.user.surname}`;
            this.fllatter = `${this.user.Firstname.slice(
              0,
              1
            )}${this.user.surname.slice(
              0,
              1)}`;
            this.BlogLikecount = Object.keys(this.blog.Like).length;
            this.BlogLikeArray = Object.keys(this.blog.Like);
            let ji = this.BlogLikeArray.indexOf(res.userio._id);
            ji >= 0 ? (this.like = 'warn') : (this.like = '');
          }
        } else {
          this.router.navigate(['/']);
          this.toastr.warning(res.errors.code, res.errors.response);
        }
      },
      error: (er) => {
        this.router.navigate(['/']);
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }

  onlike() {
    if (this.like === '' || this.like === null || this.like === undefined) {
      this.like = 'warn';
      this.BlogLikecount++;
    } else {
      this.like = '';
      this.BlogLikecount--;
    }

    let Authtoken = localStorage.getItem('token');
    const data = {
      id: this.UserId,
    };
    this.api.getblogslike(Authtoken, this.id, data).subscribe({
      next: (res) => {
        if (res.success) {
        } else {
          this.toastr.warning(res.errors.code, res.errors.response);
        }
      },
      error: (er) => {
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }

  oncomment() {
    if (this.isDisabled) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  addComment() {
    if (
      this.commentblogform.value.Comment !== '' &&
      this.commentblogform.value.Comment !== undefined &&
      this.commentblogform.value.Comment !== null &&
      this.commentblogform.value.Comment !== ' '
    ) {
      let com = {
        postid: this.id,
        comment: this.commentblogform.value.Comment.replace(/^\s+|\s+$/g, ''),
        postuserId: this.user._id,
      };
      const d = new Date();
      let todayDate =
        d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

      let usercomment = {
        userid: this.UserId,
        surname: this.Userinfo.surname,
        Firstname: this.Userinfo.Firstname,
        comment: this.commentblogform.value.Comment.replace(/^\s+|\s+$/g, ''),
        date: todayDate,
      };
      this.BlogsComment.push(usercomment);
      let Authtoken = localStorage.getItem('token');
      this.api.postblogscomment(Authtoken, com).subscribe({});
      this.commentblogform.controls['Comment'].setValue(' ');
    } else {
      this.commentblogform.controls['Comment'].setValue(' ');
    }
  }

  deletecomment(i: number) {
    this.BlogsComment.splice(i, 1);
    let Authtoken = localStorage.getItem('token');

    this.api
      .deleteblogslike(Authtoken, this.blog._id, this.BlogsComment)
      .subscribe({
        next: (res) => {},
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
  }
}
