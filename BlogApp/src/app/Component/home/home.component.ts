import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  Username :any;
  constructor(
    private modalService: NgbModal,
    private api: BlogservicesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  BlogsContent:any;
  ngOnInit(): void {
  this.getallfunction();
}


  getallfunction(){
    this.api.getallblogs().subscribe({
      next: (res) => {
        if (res.success) {
          this.BlogsContent = res.blog;
         } else {
          this.toastr.warning(res.errors.code, res.errors.response);
         }
      },
      error: (er) => {
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }
}
