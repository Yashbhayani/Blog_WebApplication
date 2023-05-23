import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserservicesService } from 'src/app/services/userservices.service';

@Component({
  selector: 'app-serarch',
  templateUrl: './serarch.component.html',
  styleUrls: ['./serarch.component.css'],
})
export class SerarchComponent {
  id: any;
  Userinfo :any;
  Bloginfo :any;
  Hasinfo :any;

  constructor(
    private activatedrouter: ActivatedRoute,
    private api: UserservicesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.activatedrouter.snapshot.paramMap.get('id');
    this.getSearchValue();
  }

  getSearchValue(){
    let Authtoken = localStorage.getItem('token');
    this.api.getSearch(Authtoken, this.id).subscribe({
      next: (res) => {
        if(res.success){
          console.log(res)
          this.Userinfo = res.Userdata;
          this.Bloginfo = res.Blogdata;
          this.Hasinfo = res.Hasval;
        }
      },error: (er) => {
        this.router.navigate(['/']);
        this.toastr.error(er.statusText, er.error.errors);
      },
    })
  }

  Usernavigat(userid:any ,Firstname:any, surname:any){
    this.router.navigate([`/userinfo/${userid}/${Firstname} ${surname}`]);
  }

}
