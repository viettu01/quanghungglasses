import {Component, OnInit} from '@angular/core';
import {OriginDto} from "../../../../dto/origin.dto";
import {BrandDto} from "../../../../dto/brand.dto";
import {ShapeDto} from "../../../../dto/shape.dto";
import {MaterialDto} from "../../../../dto/material.dto";
import {Environment} from "../../../../environment/environment";
import {PaginationDTO} from "../../../../dto/pagination.dto";
import {ProductDto} from "../../../../dto/product.dto";
import {ActivatedRoute, Router} from "@angular/router";
import {OriginService} from "../../../../service/origin.service";
import {BrandService} from "../../../../service/brand.service";
import {MaterialService} from "../../../../service/material.service";
import {ShapeService} from "../../../../service/shape.service";
import {CategoryService} from "../../../../service/category.service";
import {ProductService} from "../../../../service/product.service";
import {Utils} from 'src/app/utils/utils';

@Component({
  selector: 'app-client-product-search',
  templateUrl: './client-product-search.component.html',
  styleUrls: ['./client-product-search.component.css']
})
export class ClientProductSearchComponent implements OnInit {
  protected readonly Utils = Utils;
  name: string = '';
  origins: OriginDto[] = [];
  brands: BrandDto[] = [];
  shapes: ShapeDto[] = [];
  materials: MaterialDto[] = [];
  timeWarranties: any[] = [];
  baseUrl = Environment.apiBaseUrl + "/images/";
  // products: ProductDto[] = [];
  paginationDTO: PaginationDTO<ProductDto> = PaginationDTO.createEmpty();
  valueFilterOrigins: string[] = [];
  valueFilterBrands: string[] = [];
  valueFilterMaterials: string[] = [];
  valueFilterShapes: string[] = [];
  valueFilterTimeWarranties: any[] = [];
  valueFilterPriceMin: any;
  valueFilterPriceMax: any;


  constructor(protected activatedRoute: ActivatedRoute, private router: Router,
              private originService: OriginService, private brandService: BrandService,
              private materialService: MaterialService, private shapeService: ShapeService,
              private categoryService: CategoryService, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.findAllOrigin();
    this.findAllBrand();
    this.findAllShape()
    this.findAllMaterial();
    this.activatedRoute.queryParams.subscribe(params => {
      const pageSize = +params['page-size'] || 12;
      const pageNumber = +params['trang'] || 1;
      this.name = params['ten-san-pham'] || "";

      let originNames: string[] = [];
      let brandNames: string[] = [];
      let materialNames: string[] = [];
      let shapeNames: string[] = [];
      let timeWarranties: any[] = [];

      params['xuat-xu']?.split(',').forEach((originName: any) => {
        originNames.push(originName);
      });
      params['thuong-hieu']?.split(',').forEach((brandName: any) => {
        brandNames.push(brandName);
      });
      params['chat-lieu']?.split(',').forEach((materialName: any) => {
        materialNames.push(materialName);
      });
      params['hinh-dang']?.split(',').forEach((shapeName: any) => {
        shapeNames.push(shapeName);
      });
      params['bao-hanh']?.split(',').forEach((timeWarranty: any) => {
        timeWarranties.push(timeWarranty);
      });
      const priceMin = +params['gia-thap-nhat'] || "";
      const priceMax = +params['gia-cao-nhat'] || "";

      this.search(params["ten-san-pham"], pageSize, pageNumber, originNames, brandNames, materialNames, shapeNames, timeWarranties, priceMin, priceMax);
    });
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

  search(name: string, pageSize: number, pageNumber: number, originName: string[], brandName: string[], materialName: string[], shapeName: string[], timeWarranty: any[],
         priceMin: any, priceMax: any) {
    this.productService.search(name, pageSize, pageNumber, originName, brandName, materialName, shapeName, timeWarranty, priceMin, priceMax).subscribe(
      (response: any) => {
        this.paginationDTO.content = response.content;
        this.paginationDTO.totalPages = response.totalPages;
        this.paginationDTO.totalElements = response.totalElements;
        this.paginationDTO.numberOfElements = response.numberOfElements;
        this.paginationDTO.pageSize = response.pageSize;
        this.paginationDTO.pageNumber = response.pageNumber;
        this.paginationDTO.firstElementOnPage = response.firstElementOnPage;
        this.paginationDTO.lastElementOnPage = response.lastElementOnPage;
        this.paginationDTO.sortBy = response.sortBy;
        this.paginationDTO.sortDirection = response.sortDirection;
        // lay thoi gian bao hanh tu cac san pham va loai bo cac gia tri trung nhau de hien thi ra view
        response.content.forEach((product: ProductDto) => {
          if (!this.timeWarranties.includes(product.timeWarranty))
            this.timeWarranties.push(product.timeWarranty);
        });
        this.timeWarranties.sort((a, b) => a - b);
      }
    );
  }

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/tim-kiem'], {
      queryParams: {"trang": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  filter(key: string, event: any): void {
    let values: any;
    if (event.target.checked) {
      if (key === 'xuat-xu') {
        this.valueFilterOrigins.push(event.target.value);
        values = this.valueFilterOrigins;
      } else if (key === 'thuong-hieu') {
        this.valueFilterBrands.push(event.target.value);
        values = this.valueFilterBrands;
      } else if (key === 'chat-lieu') {
        this.valueFilterMaterials.push(event.target.value);
        values = this.valueFilterMaterials;
      } else if (key === 'hinh-dang') {
        this.valueFilterShapes.push(event.target.value);
        values = this.valueFilterShapes;
      } else if (key === 'bao-hanh') {
        this.valueFilterTimeWarranties.push(event.target.value);
        values = this.valueFilterTimeWarranties;
      }
    } else {
      if (key === 'xuat-xu') {
        this.valueFilterOrigins = this.valueFilterOrigins.filter((value) => value !== event.target.value);
        values = this.valueFilterOrigins;
      } else if (key === 'thuong-hieu') {
        this.valueFilterBrands = this.valueFilterBrands.filter((value) => value !== event.target.value);
        values = this.valueFilterBrands;
      } else if (key === 'chat-lieu') {
        this.valueFilterMaterials = this.valueFilterMaterials.filter((value) => value !== event.target.value);
        values = this.valueFilterMaterials;
      } else if (key === 'hinh-dang') {
        this.valueFilterShapes = this.valueFilterShapes.filter((value) => value !== event.target.value);
        values = this.valueFilterShapes;
      } else if (key === 'bao-hanh') {
        this.valueFilterTimeWarranties = this.valueFilterTimeWarranties.filter((value) => value !== event.target.value);
        values = this.valueFilterTimeWarranties;
      }
    }
    this.router.navigate(['/tim-kiem'], {
      queryParams: {[key]: values.toString()},
      queryParamsHandling: 'merge'
    }).then();
  }

  filterPrice(): void {
    this.router.navigate(['tim-kiem'], {
      queryParams: {"gia-thap-nhat": this.valueFilterPriceMin, "gia-cao-nhat": this.valueFilterPriceMax},
      queryParamsHandling: 'merge'
    }).then();
  }

  clearFilter(): void {
    // clear all filter
    this.router.navigate(['/tim-kiem'], {
      queryParams: {"ten-san-pham": this.name},
    }).then();
    // clear all value filter
    this.valueFilterOrigins = [];
    this.valueFilterBrands = [];
    this.valueFilterMaterials = [];
    this.valueFilterShapes = [];
    this.valueFilterTimeWarranties = [];
    this.valueFilterPriceMin = "";
    this.valueFilterPriceMax = "";

    // bỏ chọn tất cả các checkbox
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });
  }

  showClearFilter(): boolean {
    return this.valueFilterOrigins.length > 0 || this.valueFilterBrands.length > 0 || this.valueFilterMaterials.length > 0 || this.valueFilterShapes.length > 0 || this.valueFilterTimeWarranties.length > 0;
  }
}
