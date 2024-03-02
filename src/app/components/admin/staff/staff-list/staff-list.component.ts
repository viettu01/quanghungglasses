import {Component, OnInit} from '@angular/core';
import {PaginationDTO} from "../../../../dto/pagination.dto";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {Utils} from 'src/app/utils/utils';
import {StaffService} from "../../../../service/staff.service";
import {StaffDto} from "../../../../dto/staff.dto";
import {Environment} from "../../../../environment/environment";

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  protected readonly Utils = Utils;
  protected readonly baseUrl: string = `${Environment.apiBaseUrl}`;
  titleString: string = "Danh sách nhân viên";

  paginationDTO: PaginationDTO<StaffDto> = PaginationDTO.createEmpty();
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  sortDir: string = "ASC";
  sortBy: string = "";

  constructor(private title: Title, private staffService: StaffService,
              private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);

    this.activatedRoute.queryParams.subscribe(params => {
      const fullname = params['fullname'] || "";
      const status = params['status'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(fullname, status, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  findAll(fullname: string, status: any, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.staffService.findAll(fullname, status, pageSize, pageNumber, sortDir, sortBy).subscribe({
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
      error: () => {
      }
    });
  }

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/admin/staff'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/staff'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/staff'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/staff'], {
      queryParams: {"fullname": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }
}
