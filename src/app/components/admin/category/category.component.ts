import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {Title} from "@angular/platform-browser";
import {PaginationDTO} from "../../../dto/pagination.dto";
import {CategoryDto} from "../../../dto/category.dto";
import {Environment} from "../../../environment/environment";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  protected readonly Environment = Environment;
  paginationDTO: PaginationDTO<CategoryDto> = new PaginationDTO<CategoryDto>([], 0, 0, 0, 0, 0, 0, 0);
  categoryDTO: CategoryDto = new CategoryDto(0, "", "", "", false, new Date(), new Date());

  constructor(private title: Title, private categoryService: CategoryService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.title.setTitle("Quản lý danh mục");
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['name'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sortDir'] || "";
      const sortBy = params['sortBy'] || "";

      this.findAll(name, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  private findAll(name: string, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.categoryService.findAll(name, pageSize, pageNumber, sortDir, sortBy).subscribe({
      next: (response: any) => {
        this.paginationDTO.content = response.content;
        this.paginationDTO.totalPages = response.totalPages;
        this.paginationDTO.totalElements = response.totalElements;
        this.paginationDTO.numberOfElements = response.numberOfElements;
        this.paginationDTO.pageSize = response.pageSize;
        this.paginationDTO.pageNumber = response.pageNumber;
        this.paginationDTO.firstElementOnPage = response.firstElementOnPage;
        this.paginationDTO.lastElementOnPage = response.lastElementOnPage;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  changePage(pageNumber: number): void {
    this.router.navigate(['/admin/category'], {queryParams: {"page-number": pageNumber}}).then(r => {
    });
  }

  nextPage(): void {
    this.router.navigate(['/admin/category'], {queryParams: {"page-number": this.paginationDTO.pageNumber + 1}}).then(r => {
    });
  }

  previousPage(): void {
    this.router.navigate(['/admin/category'], {queryParams: {"page-number": this.paginationDTO.pageNumber - 1}}).then(r => {
    });
  }

  getVisiblePages(currentPage: number, totalPages: number, visibleCount: number): number[] {
    // start = Giá trị nhỏ nhất của trang hiển thị
    // end = Giá trị lớn nhất của trang hiển thị
    let start = Math.max(1, Math.min(currentPage - Math.floor(visibleCount / 2), totalPages - visibleCount + 1));
    let end = Math.min(totalPages, start + visibleCount - 1);

    return Array.from({length: end - start + 1}, (_, index) => start + index);
  }

  countStatus(status: boolean): any {
    this.categoryService.countByStatus(status).subscribe({
      next: (response: any) => {
        return response;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
