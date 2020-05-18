import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  template:`<app-logger></app-logger>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Warehouse-Logger-ng';
}
