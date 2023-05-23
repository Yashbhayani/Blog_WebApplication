import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}
  db1: any;

  ngOnInit() {
    console.log('oninit');
    this.db1 = (<any>window).openDatabase(
      'mydb',
      '',
      'my first database',
      2 * 1024 * 1024
    );
  }

  save(model: any): AppService {
    console.log('service');
    this.ngOnInit();
    this.db1.transaction(function (tx: any) {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS people (id integer, Firstname text, surname text, email text, Mobile text, Birthdate text, Followers integer, BlogPost integer, Following integer)'
      );
      console.log(model.dob);
    });
    this.db1.transaction(function (tx: any) {
      tx.executeSql(
        'INSERT INTO people (id, Firstname, surname, email, Mobile, Birthdate, Followers, BlogPost, Following) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          1,
          model.Firstname,
          model.surname,
          model.email,
          model.Mobile,
          model.Birthdate,
          model.Followers,
          model.BlogPost,
          model.Following,
        ]
      );
      console.log(model);
    });

    return this;
  }
  delete(model: any): AppService {
    this.ngOnInit();
    console.log(model.id);
    this.db1.transaction(function (tx: any) {
      tx.executeSql('delete from people where id=' + model.id);
    });
    return this;
  }
  view(model: any): AppService {
    this.ngOnInit();
    console.log(JSON.stringify(model));
    return this;
  }

  update(model): AppService {
    this.ngOnInit();
    console.log(model.id);
    this.db1.transaction(function (tx: any) {
      tx.executeSql('delete from people where id=' + model.id);
      tx.executeSql(
        'INSERT INTO people (id, name, dob, place) VALUES (?,?,?,?)',
        [model.id, model.name, model.dob, model.place]
      );
    });
    return this;
  }
}
