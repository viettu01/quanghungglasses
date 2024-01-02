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
  paginationDTO: PaginationDTO<CategoryDto> = new PaginationDTO<CategoryDto>([], 0, 0, 0, 0, 0, 0, 0, "", "");
  countAll: number = 0;
  countStatusTrue: number = 0;
  countStatusFalse: number = 0;
  searchTemp: any = '';
  sizeSelected: any = [];
  selectAll: boolean = false;
  sortDir: string = "ASC";

  constructor(private title: Title, private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute, private router: Router) {
    this.title.setTitle("Quản lý danh mục");
    this.findByNonStatus();
    this.findAllByStatus(true);
    this.findAllByStatus(false);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['name'] || "";
      const status = params['status'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(name, status, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
  }

  findAll(name: string, status: boolean, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.categoryService.findAll(name, status, pageSize, pageNumber, sortDir, sortBy).subscribe({
      next: (response: any) => {
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
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  findAllByStatus(status: boolean) {
    this.categoryService.findAllByStatus(status).subscribe({
      next: (response: any) => {
        if (status)
          this.countStatusTrue = response.totalElements;
        else if (!status)
          this.countStatusFalse = response.totalElements;
        else
          this.countAll = response.totalElements;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  findByNonStatus() {
    this.categoryService.findAllNonStatus().subscribe({
      next: (response: any) => {
        this.countAll = response.totalElements;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  changePage(pageNumber: number): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  getVisiblePages(currentPage: number, totalPages: number, visibleCount: number): number[] {
    // start = Giá trị nhỏ nhất của trang hiển thị
    // end = Giá trị lớn nhất của trang hiển thị
    let start = Math.max(1, Math.min(currentPage - Math.floor(visibleCount / 2), totalPages - visibleCount + 1));
    let end = Math.min(totalPages, start + visibleCount - 1);

    return Array.from({length: end - start + 1}, (_, index) => start + index);
  }

  getListByStatus(status: boolean) {
    this.router.navigate(['/admin/category'], {queryParams: {"status": status}}).then(r => {
    });
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"page-size": pageSize},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
  }

  search() {
    this.router.navigate(['/admin/category'], {
      queryParams: {"name": this.searchTemp},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }
}
