import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../service/category.service";
import {ProductService} from "../../../../service/product.service";
import {BrandService} from "../../../../service/brand.service";
import {BrandDto} from "../../../../dto/brand.dto";
import {MaterialService} from "../../../../service/material.service";
import {OriginService} from "../../../../service/origin.service";
import {ShapeService} from "../../../../service/shape.service";
import {OriginDto} from "../../../../dto/origin.dto";
import {ShapeDto} from "../../../../dto/shape.dto";
import {MaterialDto} from "../../../../dto/material.dto";

@Component({
  selector: 'app-client-product-by-category',
  templateUrl: './client-product-by-category.component.html',
  styleUrls: ['./client-product-by-category.component.css']
})
export class ClientProductByCategoryComponent implements OnInit {
  origins: OriginDto[] = [];
  brands: BrandDto[] = [];
  shapes: ShapeDto[] = [];
  materials: MaterialDto[] = [];

  constructor(private originService: OriginService, private brandService: BrandService,
              private materialService: MaterialService, private shapeService: ShapeService,
              private categoryService: CategoryService, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.findAllOrigin();
    this.findAllBrand();
    this.findAllShape()
    this.findAllMaterial();
  }

  findAllOrigin() {
    this.originService.findAll().subscribe(
      (data: any) => {
        this.origins = data;
      }
    );
  }

  findAllBrand() {
    this.brandService.findAll().subscribe({
      next: (data: any) => {
        this.brands = data;
      }
    });
  }

  findAllShape() {
    this.shapeService.findAll().subscribe(
      (data: any) => {
        this.shapes = data;
      }
    );
  }

  findAllMaterial() {
    this.materialService.findAll().subscribe(
      (data: any) => {
        this.materials = data;
      }
    );
  }
}
