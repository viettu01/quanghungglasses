import {Component} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {CategoryDto} from "../../../dto/category.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client-menu',
  templateUrl: './client-menu.component.html',
  styleUrls: ['./client-menu.component.css']
})
export class ClientMenuComponent {
  categoryDto: CategoryDto[] = [];

  constructor(private router: Router, private categoryService: CategoryService) {
    this.getCategories();
  }

  isExactRoute(route: string): boolean {
    return this.router.url == route;
  }

  getCategories() {
    this.categoryService.findAllCategoryAndProduct().subscribe({
      next: (response: any) => {
        this.categoryDto = response;
      }
    });
  }
}
