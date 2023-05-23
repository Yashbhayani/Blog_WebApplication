import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserservicesService } from 'src/app/services/userservices.service';

@Component({
  selector: 'app-editblog',
  templateUrl: './editblog.component.html',
  styleUrls: ['./editblog.component.css']
})
export class EditblogComponent {
  bid: any = null;
  uid: any = null;
  Authtoken: any;
  Blog: any;
  Userdata: any;
  imageArray_2: any;
  imagedata_1: any;
  imagedata_2: any;
  tyu: any;
  imageArray_1: any;
  hasarray: any;

  constructor(
    private activatedrouter: ActivatedRoute,
    private toastr: ToastrService,
    private api: UserservicesService,
    private router: Router
  ) {}

  userblogform = new FormGroup({
    blog_title: new FormControl('', Validators.required),
    blogs_Description: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(10)])
    ),
    blogs_image_1: new FormControl(''),
    blog_info_1: new FormControl('', Validators.required),
    blogs_image_2: new FormControl(''),
    blog_info_2: new FormControl('', Validators.required),
  });

  hasblogform = new FormGroup({
    has: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.uid = this.activatedrouter.snapshot.paramMap.get('userid');
    this.bid = this.activatedrouter.snapshot.paramMap.get('blogid');
    if (
      this.activatedrouter.snapshot.paramMap.get('userid') === null ||
      (this.activatedrouter.snapshot.paramMap.get('userid') === undefined &&
        this.activatedrouter.snapshot.paramMap.get('blogid') === null) ||
      this.activatedrouter.snapshot.paramMap.get('blogid') === undefined
    ) {
      this.router.navigate(['/']);
    } else {
      this.userinfo();
    }
  }

  userinfo() {
    this.Authtoken = localStorage.getItem('token');
    this.api.VrifyblogUser(this.Authtoken, this.uid, this.bid).subscribe({
      next: (res) => {
        if (res.success) {
          this.Blog = res.blog;
          this.Userdata = res.user;
          this.dataload();
        } else {
          this.router.navigate(['/']);
          this.toastr.warning('User not Found', 'Unsuccessfull');
        }
      },
      error: (er) => {
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }

  dataload() {
    this.imagedata_1 = `http://localhost:5000/${this.Blog.Blog_content[0].image}`;
    this.imagedata_2 = `http://localhost:5000/${this.Blog.Blog_content[1].image}`;
    this.hasarray = this.Blog.Hastag;
    this.userblogform.controls['blog_title'].setValue(this.Blog.Blog_Title);
    this.userblogform.controls['blogs_Description'].setValue(
      this.Blog.Blogs_Description
    );
    this.userblogform.controls['blog_info_1'].setValue(
      this.Blog.Blog_content[0].blogdata
    );
    this.userblogform.controls['blog_info_2'].setValue(
      this.Blog.Blog_content[1].blogdata
    );
  }

  showPreview_1(event: any) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.imageArray_1 = event.target.files[0];
      var io = event.target.files[0];
      reader.onload = (event: any) => {
        this.imagedata_1 = event.target.result;
        var extension = this.imagedata_1.split(';')[0].split('/')[1];
        this.tyu = io;
      };
    }
  }

  showPreview_2(event: any) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.imageArray_2 = event.target.files[0];
      var io = event.target.files[0];
      reader.onload = (event: any) => {
        this.imagedata_2 = event.target.result;
        var extension = this.imagedata_2.split(';')[0].split('/')[1];
        this.tyu = io;
      };
    }
  }

  addhas() {
    if (this.hasblogform.value.has?.slice(0, 1) !== '#') {
      this.hasarray.push(this.hasblogform.value.has);
    } else {
      this.hasarray.push(this.hasblogform.value.has.slice(1));
    }
    this.hasblogform.controls['has'].setValue('');
  }

  removelist(hid: any) {
    this.hasarray.splice(hid, 1);
  }

  ProceedSave() {
    if (this.imageArray_1 && this.imageArray_2) {
      let formData: any = new FormData();
      formData.append('image', this.imageArray_1);
      formData.append('image', this.imageArray_2);
      formData.append('blog_title', this.userblogform.value.blog_title);
      formData.append(
        'Blogs_Description',
        this.userblogform.value.blogs_Description
      );
      formData.append('blog_info_1', this.userblogform.value.blog_info_1);
      formData.append('blog_info_2', this.userblogform.value.blog_info_2);
      formData.append('hastag', this.hasarray);
      this.api.Editblog(this.Authtoken, this.bid, formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/user']);
            this.toastr.success('success', 'blog added Successfully');
          } else {
            this.router.navigate(['/user']);
            this.toastr.warning(res.errors.code, res.errors.response);
          }
        },
        error: (er) => {
          this.router.navigate(['/']);
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
    } else if (this.imageArray_1) {
      let formData: any = new FormData();
      formData.append('image', this.imageArray_1);
      formData.append('blog_title', this.userblogform.value.blog_title);
      formData.append(
        'Blogs_Description',
        this.userblogform.value.blogs_Description
      );
      formData.append('blog_info_1', this.userblogform.value.blog_info_1);
      formData.append('blog_info_2', this.userblogform.value.blog_info_2);
      formData.append('hastag', this.hasarray);
      this.api
        .UpdateblogFirstimag(this.Authtoken, this.bid, formData)
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.router.navigate(['/user']);
              this.toastr.success('success', 'blog added Successfully');
            } else {
              this.router.navigate(['/user']);
              this.toastr.warning(res.errors.code, res.errors.response);
            }
          },
          error: (er) => {
            this.toastr.error(er.statusText, er.error.errors);
          },
        });
    } else if (this.imageArray_2) {
      let formData: any = new FormData();
      formData.append('image', this.imageArray_2);
      formData.append('blog_title', this.userblogform.value.blog_title);
      formData.append(
        'Blogs_Description',
        this.userblogform.value.blogs_Description
      );
      formData.append('blog_info_1', this.userblogform.value.blog_info_1);
      formData.append('blog_info_2', this.userblogform.value.blog_info_2);
      formData.append('hastag', this.hasarray);
      this.api
        .UpdateblogSecondimag(this.Authtoken, this.bid, formData)
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.router.navigate(['/user']);
              this.toastr.success('success', 'blog added Successfully');
            } else {
              this.router.navigate(['/user']);
              this.toastr.warning(res.errors.code, res.errors.response);
            }
          },
          error: (er) => {
            this.toastr.error(er.statusText, er.error.errors);
          },
        });
    } else {
      let formData = {
        blog_title: this.userblogform.value.blog_title,
        Blogs_Description: this.userblogform.value.blogs_Description,
        blog_info_1: this.userblogform.value.blog_info_1,
        blog_info_2: this.userblogform.value.blog_info_2,
        hastag: this.hasarray,
      };
      this.api.UpdateblogNoimag(this.Authtoken, this.bid, formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/user']);
            this.toastr.success('success', 'blog added Successfully');
          } else {
            this.router.navigate(['/user']);
            this.toastr.warning(res.errors.code, res.errors.response);
          }
        },
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
    }
  }
}
