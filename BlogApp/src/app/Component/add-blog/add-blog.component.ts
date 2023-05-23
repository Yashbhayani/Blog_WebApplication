import { NumberFormatStyle } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css'],
})
export class AddBlogComponent {
  items!: FormArray;
  imgsrc = './assets/image_placeholder.png';
  tyu: any;
  imagedata_1: any = './assets/image_placeholder.png';
  imagedata_2: any = './assets/image_placeholder.png';

  hasarray = new Array();
  imageArray_1: any;
  imageArray_2: any;

  constructor(
    private api: BlogservicesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  title = 'FormArray';
  userblogform = new FormGroup({
    blog_title: new FormControl('', Validators.required),
    blogs_Description: new FormControl(
      '',
      Validators.compose([Validators.required, 
      Validators.minLength(10),
      ])
    ),
    blogs_image_1: new FormControl('', Validators.required),
    blog_info_1: new FormControl('', Validators.required),
    blogs_image_2: new FormControl('', Validators.required),
    blog_info_2: new FormControl('', Validators.required),
  });

  hasblogform = new FormGroup({
    has: new FormControl('', Validators.required),
  });

  ProceedSave() {
    let gh: any = [];
    const formData: any = new FormData();
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

    let Authtoken = localStorage.getItem('token');
    this.api.Addblogs(Authtoken, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.userblogform.reset();
          this.hasblogform.reset();
          this.hasarray = new Array();
          this.imagedata_1 = './assets/image_placeholder.png';
          this.imagedata_2 = './assets/image_placeholder.png';
          this.imageArray_1 = [];
          this.imageArray_2 = [];
          this.router.navigate(['/']);
          this.toastr.success('success', 'blog added Successfully');
        } else {
          this.toastr.warning(res.errors.code, res.errors.response);
        }
      },
      error: (er) => {
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
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

  removelist(id: number) {
    this.hasarray.splice(id, 1);
  }
}
