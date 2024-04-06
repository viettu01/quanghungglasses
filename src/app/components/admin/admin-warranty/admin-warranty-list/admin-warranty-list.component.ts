import {Component, OnInit} from '@angular/core';
import {PaginationDTO} from "../../../../dto/pagination.dto";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {Utils} from "../../../../utils/utils";
import {WarrantyService} from "../../../../service/warranty.service";
import {WarrantyDto} from "../../../../dto/warranty.dto";

@Component({
  selector: 'app-admin-warranty-list',
  templateUrl: './admin-warranty-list.component.html',
  styleUrls: ['./admin-warranty-list.component.css']
})
export class AdminWarrantyListComponent implements OnInit {
  protected readonly Utils = Utils;
  titleString: string = 'Danh sách phiếu bảo hành';

  paginationDTO: PaginationDTO<WarrantyDto> = PaginationDTO.createEmpty();
  searchTemp: any = this.activatedRoute.snapshot.queryParams['fullname'] || "";
  sortDir: string = "ASC";
  sortBy: string = "";

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private router: Router,
              private warrantyService: WarrantyService) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);
    this.activatedRoute.queryParams.subscribe(params => {
      const fullname = params['fullname'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(fullname, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  findAll(fullname: string, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.warrantyService.findAll(fullname, pageSize, pageNumber, sortDir, sortBy).subscribe({
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
      }
    });
  }

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/admin/warranty'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/warranty'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/warranty'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/warranty'], {
      queryParams: {"fullname": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }
}
