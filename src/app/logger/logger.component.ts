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

  materials = [];
  warehouses = [];

  constructor(private http: HttpClient) {

    this.http.get('assets/SourceData.txt', { responseType: 'text' })
      .subscribe(data => {
        for (let line of data.split(/[\r\n]+/)) {
          this.data.push(line);
        }
        this.deleteIgnoredLines(this.data);
        this.getMaterials(this.data);
        this.getWarehouses(this.materials);
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

      let cuttedMaterial = material.split(';');
      singleMaterial.materialId = cuttedMaterial[1];
      singleMaterial.warehousesWithAmount = cuttedMaterial[2];

      this.materials.push(singleMaterial);
    })
  }

  getWarehouses(data) {
    //material "COM-123906c"; "WH-A,10|WH-B,11"
    data.forEach(el => {
      let cuttedWarehouseInfo = el.warehousesWithAmount.split('|');

      cuttedWarehouseInfo.forEach(cutted => {
        let warehouse = {
          warehouseName: '',
          materialId: '',
          materialAmount: ''
        }
        let cuttedWarehouseWithAmount = cutted.split(',');

        warehouse.warehouseName = cuttedWarehouseWithAmount[0];
        warehouse.materialId = el.materialId;
        warehouse.materialAmount = cuttedWarehouseWithAmount[1];

        this.warehouses.push(warehouse);
      })
    });

    var tmp = this.warehouses;
  };
}

