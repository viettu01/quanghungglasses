import {Component} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {CategoryDto} from "../../../dto/category.dto";

@Component({
  selector: 'app-client-menu',
  templateUrl: './client-menu.component.html',
  styleUrls: ['./client-menu.component.css']
})
export class ClientMenuComponent {
  categoryDto: CategoryDto[] = [];
  constructor(private categoryService: CategoryService) {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.findAllNonBy().subscribe({
      next: (data: any) => {
        console.log(data.content);
        this.categoryDto = data.content;
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
