import {Component, OnInit} from '@angular/core';
import {ProductService} from 'src/app/service/product.service';
import {DomSanitizer, Title} from "@angular/platform-browser";
import {ProductDto} from "../../../../dto/product.dto";
import {ActivatedRoute} from "@angular/router";
import {Environment} from "../../../../environment/environment";
import {TokenService} from "../../../../service/token.service";

@Component({
  selector: 'app-details-product',
  templateUrl: './admin-product-details.component.html',
  styleUrls: ['./admin-product-details.component.css']
})
export class AdminProductDetailsComponent implements OnInit {
  roles: string[] = this.tokenService.getUserRoles();
  protected readonly Environment = Environment;
  titleString = 'Chi tiết sản phẩm';
  product: ProductDto = ProductDto.createEmpty();

  constructor(private productService: ProductService, private title: Title, private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);
    this.getProductById(this.activatedRoute.snapshot.params["id"]);
  }

  getProductById(id: number) {
    this.productService.findById(id).subscribe({
      next: (data: any) => {
        this.product = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getHtmlProductDescription() {
    return this.sanitizer.bypassSecurityTrustHtml(this.product.description);
  }
}
