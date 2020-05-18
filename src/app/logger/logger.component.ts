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

  materialArray = [];
  warehouses = [];

  constructor(private http: HttpClient) {

    this.http.get('assets/SourceData.txt', { responseType: 'text' })
      .subscribe(data => {
        for (let line of data.split(/[\r\n]+/)) {
          this.data.push(line);
        }
        this.deleteIgnoredLines(this.data);
        this.getMaterials(this.data);
      });
  }

  deleteIgnoredLines(data) {
    let dataWithNoIgnoredLines = data
      .filter(row => !row.startsWith('#'));

    this.data = dataWithNoIgnoredLines;
  }

  getMaterials(data) {
    let material = data.map((material) => {
      let singleMaterial = {
        materialId: '',
        warehousesWithAmount: ''
      }

      let cutted = material.split(';');
      singleMaterial.materialId = cutted[1];
      singleMaterial.warehousesWithAmount = cutted[2];

      this.materialArray.push(singleMaterial);
    })
  }

}

