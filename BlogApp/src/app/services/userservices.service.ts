import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserservicesService {
  constructor(private http: HttpClient) {}

  Userdataget(token: any) {
    return this.http.get<any>(
      'http://localhost:5000/user/personaluser',
      this.headtok(token)
    );
  }

  getFollowers(token: any, id: any) {
    return this.http.get<any>(
      `http://localhost:5000/user/getfollowers/${id}`,
      this.headtok(token)
    );
  }


  getFollowing(token: any, id: any) {
    return this.http.get<any>(
      `http://localhost:5000/user/getfollowing/${id}`,
      this.headtok(token)
    );
  }

  getBlogs(token: any, id: any) {
    return this.http.get<any>(
      `http://localhost:5000/user/getpersonaluserblog/${id}`,
      this.headtok(token)
    );
  }


  getSearch(token: any, id: any) {
    return this.http.get<any>(
      `http://localhost:5000/user/getsearch/${id}`,
      this.headtok(token)
    );
  }


  DeleteBlog(token: any, id: any) {
    return this.http.delete<any>(
      `http://localhost:5000/blogs/deleteblog/${id}`,
      this.headtok(token)
    );
  }

  
  Editblog(token: any, id: any, data: any) {
    return this.http.put<any>(
      `http://localhost:5000/blogs/updateblog/${id}`,
      data,
      this.headtoker(token)
    );
  }

  VrifyblogUser(token: any, uid: any, bid: any) {
    return this.http.get<any>(
      `http://localhost:5000/blogs/userverify/${uid}/${bid}`,
      this.headtok(token)
    );
  }

  UpdateblogFirstimag(token: any, id: any, data: any) {
    return this.http.put<any>(
      `http://localhost:5000/blogs/updateblogfirstimag/${id}`,
      data,
      this.headtoker(token)
    );
  }

  UpdateblogSecondimag(token: any, id: any, data: any) {
    return this.http.put<any>(
      `http://localhost:5000/blogs/updateblogsecondimag/${id}`,
      data,
      this.headtoker(token)
    );
  }

  
  UpdateblogNoimag(token: any, id: any, data: any) {
    return this.http.put<any>(
      `http://localhost:5000/blogs/updateblognoimag/${id}`,
      data,
      this.headtoker(token)
    );
  }


  headtoker(token: any) {
    let api_key = token;
    const headerDict = {
      Authorization: api_key,
    };

    const requestOptionss = {
      headers: new HttpHeaders(headerDict),
    };

    return requestOptionss;
  }

  headtok(token: any) {
    let api_key = token;
    const headerDict = {
      'Content-Type': 'application/json',
      Authorization: api_key,
    };

    const requestOptionss = {
      headers: new HttpHeaders(headerDict),
    };

    return requestOptionss;
  }
}
