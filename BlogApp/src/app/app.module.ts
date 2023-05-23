import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatTabsModule} from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './User/login/login.component';
import { SignupComponent } from './User/signup/signup.component';
import { HomeComponent } from './Component/home/home.component';
import { DialogComponent } from './Component/dialog/dialog.component';
import { ForgotpassComponent } from './User/forgotpass/forgotpass.component';
import { PagenotFoundComponent } from './pagenot-found/pagenot-found.component';
import { UsersComponent } from './Component/users/users.component';
import { AddBlogComponent } from './Component/add-blog/add-blog.component';
import { BlogComponent } from './Component/blog/blog.component';
import { HastagComponent } from './Component/hastag/hastag.component';
import { BlogsPipe } from './pipes/blogs.pipe';
import { UserinfoComponent } from './Component/userinfo/userinfo.component';
import { FdialogComponent } from './Component/fdialog/fdialog.component';
import { SerarchComponent } from './Component/serarch/serarch.component';
import { EditblogComponent } from './Component/editblog/editblog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    DialogComponent,
    ForgotpassComponent,
    PagenotFoundComponent,
    UsersComponent,
    AddBlogComponent,
    BlogComponent,
    HastagComponent,
    BlogsPipe,
    UserinfoComponent,
    FdialogComponent,
    SerarchComponent,
    EditblogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    NgbModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot({
      extendedTimeOut: 3000,
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      enableHtml: true,
      tapToDismiss: false,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
