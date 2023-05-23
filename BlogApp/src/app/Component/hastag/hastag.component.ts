import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';

@Component({
  selector: 'app-hastag',
  templateUrl: './hastag.component.html',
  styleUrls: ['./hastag.component.css']
})
export class HastagComponent {
  name:any = null;
  id:any = null;
  Username:any;
  constructor(
    private activatedrouter: ActivatedRoute,
    private api: BlogservicesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  hasblog:any;
  ngOnInit(): void {
    this.name = this.activatedrouter.snapshot.paramMap.get('name');
    this.id = this.activatedrouter.snapshot.paramMap.get('id');

    if (
      this.activatedrouter.snapshot.paramMap.get('id') === null ||
      this.activatedrouter.snapshot.paramMap.get('id') === undefined
    ) {
      this.router.navigate(['/']);
    } else {
      let ki:any = localStorage.getItem("Userinfo");
      this.Username = `${JSON.parse(ki).Firstname} ${JSON.parse(ki).surname}` 
      this.getallfunction();
    }
  }

  getallfunction(){
    let Authtoken = localStorage.getItem('token');
    this.api.getblogshas(Authtoken, this.id).subscribe({
      next: (res) => {
        if (res.success) {
          if(res.bloghas.length === 0){
            this.router.navigate(['/']);
            this.toastr.warning("Hastag not found","Unsucessfull");
          }else{
          this.hasblog=res.bloghas;
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
}
