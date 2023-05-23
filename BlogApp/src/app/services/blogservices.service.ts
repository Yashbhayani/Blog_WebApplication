import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogservicesService {

  constructor(private http: HttpClient) {}

  Addblogs(token: any, body:any) {
    return this.http.post<any>(
      'http://localhost:5000/blogs/addblog',
      body,
      this.headtok(token)
    );
  }

  getallblogs() {
    return this.http.get<any>(
      'http://localhost:5000/blogs/getallblog',
    );
  }

  getblogsid(token: any, id:any) {
    return this.http.get<any>(
      `http://localhost:5000/blogs/getblog/${id}`,
      this.headtok(token)
    );
  }


  getblogshas(token: any, id:any) {
    return this.http.get<any>(
      `http://localhost:5000/blogs/getallhasBlogs/${id}`,
      this.headtok(token)
    );
  }

  getblogslike(token: any, id:any, data:any) {
    return this.http.patch<any>(
      `http://localhost:5000/blogs/${id}/like`,
      data,
      this.headtok(token)
    );
  }


  postblogscomment(token: any, data:any) {
    return this.http.patch<any>(
      `http://localhost:5000/blogs/comment`,
      data,
      this.headtok(token)
    );
  }

  deleteblogslike(token: any, id:any, data:any) {
    return this.http.patch<any>(
      `http://localhost:5000/blogs/${id}/commentdelete`,
      data,
      this.headtok(token)
    );
  }

  OtherUserdataget(token: any, id : any) {
    return this.http.get<any>(
      `http://localhost:5000/blogs/otheruserinfo/${id}`,
      this.headtok(token)
    );
  }


  UserFollow(token: any, id : any, data:any){
    return this.http.patch<any>(
      `http://localhost:5000/user/followuser/${id}`,
      data,
      this.headtok(token)
    );
  }

  
  UserUnFollow(token: any, id : any, data:any){
    return this.http.patch<any>(
      `http://localhost:5000/user/unfollowuser/${id}`,
      data,
      this.headtok(token)
    );
  }

  headtok(token: any) {
    let api_key = token;
    const headerDict = {
      Authorization: api_key,
    };

    const requestOptionss = {
      headers: new HttpHeaders(headerDict),
    };

    return requestOptionss;
  }

  headtoker(token: any) {
    let api_key = token;
    const headerDict = {
      'Content-Type': 'multipart/form-data',
      Authorization: api_key,
    };

    const requestOptionss = {
      headers: new HttpHeaders(headerDict),
    };

    return requestOptionss;
  }
}
