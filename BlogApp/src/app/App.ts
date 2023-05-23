export class App {
    id: number;
  name: string = '';
  dob: string;
  place: string;

  constructor(values: Object = {}) {
  Object.assign(this, values);
  }
}