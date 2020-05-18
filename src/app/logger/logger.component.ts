import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})

export class LoggerComponent {
  data: string[] = [];

  materials = [];
  warehouses = [];
  groupedWarehouses = [];
  warehouseWithTotal = [];

  constructor(private http: HttpClient) {

    this.http.get('assets/SourceData.txt', { responseType: 'text' })
      .subscribe(data => {
        for (let line of data.split(/[\r\n]+/)) {
          this.data.push(line);
        }
        this.deleteIgnoredLines(this.data);
        this.getMaterials(this.data);
        this.getWarehouses(this.materials);
        this.groupWarehouses(this.warehouses);
        this.getRelevantSortedData(this.groupWarehouses);
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
        materialId: String,
        warehousesWithAmount: String
      }

      let cuttedMaterial = material.split(';');
      singleMaterial.materialId = cuttedMaterial[1];
      singleMaterial.warehousesWithAmount = cuttedMaterial[2];

      this.materials.push(singleMaterial);
    })
  }

  getWarehouses(data) {
    data.forEach(el => {
      let cuttedWarehouseInfo = el.warehousesWithAmount.split('|');

      cuttedWarehouseInfo.forEach(cutted => {
        let warehouse = {
          warehouseName: String,
          materialId: String,
          materialAmount: String
        }
        let cuttedWarehouseWithAmount = cutted.split(',');

        warehouse.warehouseName = cuttedWarehouseWithAmount[0];
        warehouse.materialId = el.materialId;
        warehouse.materialAmount = cuttedWarehouseWithAmount[1];

        this.warehouses.push(warehouse);
      })
    });
  };

  groupWarehouses(warehouses) {
    let groupedWarehouses = warehouses.reduce(function (pvalue, cvalue) {
      pvalue[cvalue.warehouseName] = pvalue[cvalue.warehouseName] || [];
      pvalue[cvalue.warehouseName].push(cvalue);
      return pvalue;
    }, Object.create(null));

    this.groupWarehouses = groupedWarehouses;
  }

  getRelevantSortedData(warehouses) {
    for (let current in warehouses) {
      let warehouseWithTotal = {
        warehouseName: '',
        warehouse: Object,
        totalAmount: 0
      }
      let totalAmount: number = 0;
      let currentWarehouse = warehouses[current];

      currentWarehouse.sort((a, b) =>
        (a.materialId > b.materialId) ? 1 : ((b.materialId > a.materialId) ? -1 : 0));

      currentWarehouse.forEach(el => {
        totalAmount += parseInt(el.materialAmount);
      })

      warehouseWithTotal.warehouseName = current;
      warehouseWithTotal.warehouse = currentWarehouse;
      warehouseWithTotal.totalAmount = totalAmount;

      this.warehouseWithTotal.push(warehouseWithTotal);

      this.warehouseWithTotal
        .sort((a, b) =>
          (a.totalAmount < b.totalAmount) ? 1 : ((b.totalAmount < a.totalAmount) ? -1 : 0))
        .sort((a, b) =>
          (a.totalAmount === b.totalAmount) ? -1 : ((b.warehouseName > a.warehouseName) ? 1 : 0));;

      this.warehouseWithTotal;
      debugger;
    }
  }
}

