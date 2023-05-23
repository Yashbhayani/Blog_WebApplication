import { NumberFormatStyle } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  imagedata = new Array();
  hasarray = new Array();
  imageArray = new Array();

  constructor(  private api: BlogservicesService){}

  ngOnInit(): void {
    this.Addnewrow();
  }

  title = 'FormArray';
  userblogform = new FormGroup({
    blog_title: new FormControl('',Validators.required),
    blogs: new FormArray([])
  });

  hasblogform = new FormGroup({
    has: new FormControl('', Validators.required),
  });

  ProceedSave() {
    const formdata: any = new FormData();
    for(let i=0; i<this.imageArray.length; i++){
      //console.log(this.imageArray[i]['image'].name)
      formdata.append("uploads[]", this.imageArray[i]['image']);
    }


    let df = new Array();
    for(let i=0; i<this.imageArray.length; i++){
      let data = (<FormArray>this.userblogform.get("blogs")).at(i)
      let blogdata = {
        id:i,
        blogs:data.value.Bloginfo
      }
      df.push(blogdata);
    }
    formdata.append("blogs",JSON.stringify(df));
    formdata.append("tags", JSON.stringify(this.hasarray));

    let Authtoken = localStorage.getItem('token');
    this.api.Addblogs(Authtoken,formdata).subscribe({
      next: (res) => {
        if (res.success) {

        } else {
          // this.toastr.warning(res.error);
        }
      },
    });
   
    console.log(formdata.keys().next());
    console.log(formdata.values().next());
    console.log(formdata.entries().next());
    for (const  value of formdata) {
      console.log(value);
    }
    /* for(let i = 0; i < this.imageArray.length; i++){
       console.log(this.userblogform.controls['blogs'].value)
     }*/
    /*console.log(this.imageArray)
      console.log(this.userblogform.value);*/
    /*console.log(this.userblogform.)
      console.log(this.userblogform.getRawValue().blogs[0]);*/
  }

  Addnewrow() {
    this.items = this.userblogform.get('blogs') as FormArray;
    this.items.push(this.Genrow());
    this.imagedata.push(this.imgsrc);
  }
  Removeitem(index: any) {
    this.items = this.userblogform.get('blogs') as FormArray;
    this.items.removeAt(index);
    this.imagedata.splice(index, 1);
  }

  get blogs() {
    return this.userblogform.get('blogs') as FormArray;
  }

  Genrow(): FormGroup {
    return new FormGroup({
      image: new FormControl('', Validators.required),
      Bloginfo: new FormControl('', Validators.required),
    });
  }

  showPreview(event: any, i: number) {
    if (event.target.files) {
   /*   console.log(event.target.files);
      console.log(event.target.files[0]);*/
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      /*console.log(this.userblogform.value.blogs)
        this.userblogform[i].blogs = event.target.files[0]
        this.userblogform.getRawValue().blogs[i]*/
        let imag = {
          id : i,
          image :event.target.files[0]
        }
        this.imageArray.splice(i, 1);
        this.imageArray.push(imag)

        console.log(this.imageArray)

        var io = event.target.files[0];
        reader.onload = (event: any) => {
        this.imagedata[i] = event.target.result;
        // console.log(this.imgsrc)
        var extension = this.imagedata[i].split(';')[0].split('/')[1];
        console.log(extension);
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
    this.hasblogform.reset();

  }

  removelist(id: number) {
    this.hasarray.splice(id, 1);
  }

}
