import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Component/home/home.component';
import { SignupComponent } from './User/signup/signup.component';
import { AuthgardGuard } from './guard/authgard.guard';
import { LoginComponent } from './User/login/login.component';
import { UsersComponent } from './Component/users/users.component';
import { UsergurdGuard } from './guard/usergurd.guard';
import { AddBlogComponent } from './Component/add-blog/add-blog.component';
import { BlogComponent } from './Component/blog/blog.component';
import { HastagComponent } from './Component/hastag/hastag.component';
import { UserinfoComponent } from './Component/userinfo/userinfo.component';
import { SerarchComponent } from './Component/serarch/serarch.component';
import { EditblogComponent } from './Component/editblog/editblog.component';
import { ForgotpassComponent } from './User/forgotpass/forgotpass.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [AuthgardGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthgardGuard] },
  { path: 'forgotpass', component: ForgotpassComponent, canActivate: [AuthgardGuard] },
  { path: 'user', component: UsersComponent, canActivate: [UsergurdGuard] },
  {
    path: 'addblog',
    component: AddBlogComponent,
    canActivate: [UsergurdGuard],
  },
  { path: '', component: HomeComponent },
  { path: 'blog/:id', component: BlogComponent, canActivate: [UsergurdGuard] },
  {
    path: 'hastags/:id',
    component: HastagComponent,
    canActivate: [UsergurdGuard],
  },
  {
    path: 'userinfo/:id/:name',
    component: UserinfoComponent,
    canActivate: [UsergurdGuard],
  },{
    path: 'search/:id',
    component: SerarchComponent,
    canActivate: [UsergurdGuard],
  },  {
    path: 'editblog/:userid/:blogid',
    component: EditblogComponent,
    canActivate: [UsergurdGuard],
  },
  { path: '*', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
