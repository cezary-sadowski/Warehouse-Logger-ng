import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logger',
  template: `
    <ul>
      <li *ngFor="let row of data">
        {{ row }}
      </li>
    </ul>
  `,
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent {
  data: string[] = [];

  constructor(public http: HttpClient) {
    this.http.get('assets/SourceData.txt', {responseType: 'text'})
      .subscribe(data => {debugger;
        for (let line of data.split(/[\r\n]+/)){
          this.data.push(line);
        }
      });
  }

}
