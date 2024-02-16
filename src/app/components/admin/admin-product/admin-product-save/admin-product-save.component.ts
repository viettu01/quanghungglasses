import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../../../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../../service/category.service";
import {OriginService} from "../../../../service/origin.service";
import {BrandService} from "../../../../service/brand.service";
import {ShapeService} from 'src/app/service/shape.service';
import {MaterialService} from "../../../../service/material.service";
import {CategoryDto} from "../../../../dto/category.dto";
import {OriginDto} from "../../../../dto/origin.dto";
import {BrandDto} from "../../../../dto/brand.dto";
import {ShapeDto} from "../../../../dto/shape.dto";
import {MaterialDto} from "../../../../dto/material.dto";

@Component({
  selector: 'app-save',
  templateUrl: './admin-product-save.component.html',
  styleUrls: ['./admin-product-save.component.css']
})
export class AdminProductSaveComponent implements OnInit {
  titleString: string = "";
  selectedImageUrl: string = "";
  selectedImageFile: File = new File([""], "filename");
  categories: CategoryDto[] = [];
  origins: OriginDto[] = [];
  brands: BrandDto[] = [];
  shapes: ShapeDto[] = [];
  materials: MaterialDto[] = [];
  editorConfig = {
    height: 280,
    selector: 'textarea',
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'link image table fullscreen',
    menubar: 'insert format tools table',
    toolbar: 'undo redo | cut copy paste  | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fullscreen',
  };

  productForm: FormGroup = new FormGroup(
    {
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      price: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^-?\d+\.?\d*$/)
      ]),
      thumbnailFile: new FormControl(null),
      slug: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9-]*$/)
      ]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('false', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      materialId: new FormControl('', [Validators.required]),
      originId: new FormControl('', [Validators.required]),
      shapeId: new FormControl('', [Validators.required]),
      brandId: new FormControl('', [Validators.required]),
      productDetails: new FormArray([
        new FormGroup({
          color: new FormControl(''),
          imageFile: new FormArray([])
        })
      ], Validators.required)
    }
  );

  constructor(private title: Title,
              private categoryService: CategoryService, private originService: OriginService,
              private brandService: BrandService, private shapeService: ShapeService,
              private materialService: MaterialService, private productService: ProductService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.productForm.get('id')?.value === null)
      this.titleString = "Thêm sản phẩm";
    else
      this.titleString = "Cập nhật sản phẩm";
    this.title.setTitle(this.titleString);
    this.findAllCategory();
    this.findAllOrigin();
    this.findAllBrand();
    this.findAllShape();
    this.findAllMaterial();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedImageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // get productDetails() {
  //   return this.productForm.get('productDetails') as FormArray;
  // }

  addProductDetails() {
    const productDetails = this.productForm.get('productDetails') as FormArray;
    productDetails.push(
      new FormGroup({
        color: new FormControl(''),
      })
    );
  }

  findAllCategory() {
    this.categoryService.findAllByName("", true, 100, 1, "ASC", "name").subscribe(
      (data: any) => {
        this.categories = data.content;
      }
    );
  }

  findAllOrigin() {
    this.originService.findAll().subscribe(
      (data: any) => {
        this.origins = data;
      }
    );
  }

  findAllBrand() {
    this.brandService.findAll().subscribe(
      (data: any) => {
        this.brands = data;
      }
    );
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
