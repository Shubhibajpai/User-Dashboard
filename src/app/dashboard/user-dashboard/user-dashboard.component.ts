import {
  Component,
  ComponentRef,
  createNgModule,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  users: any[] = [];

  pageSize = 8;
  currentPage=1;
  paginatedUsers: any[] = [];
  showModal = false;
  formLoading = false;

  chart: any;
  private Chart: any;

  @ViewChild('formHost', { read: ViewContainerRef })
  formHost!: ViewContainerRef;

  private formRef?: ComponentRef<any>;

  constructor(
    private userService: UserService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((data) => {
      this.users = data;
      this.currentPage = 1;
      this.updatePaginatedUsers();

      setTimeout(() => {
        this.createChart();
      }, 100);
    });
  }
  updatePaginatedUsers(): void {
    const totalPages = this.getTotalPages();
  
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages || 1;
    }
  
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }
  
  getTotalPages(): number {
    return Math.ceil(this.users.length / this.pageSize) || 1;
  }
  
  goToPage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) {
      return;
    }
    this.currentPage = page;
    this.updatePaginatedUsers();
  }
  
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
  
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  openModal(): void {
    this.showModal = true;
    this.formLoading = true;

    import('../../user-form/user-form.module').then((module) => {
      setTimeout(() => {
        const moduleRef = createNgModule(module.UserFormModule, this.injector);

        this.formRef = this.formHost.createComponent(module.UserFormComponent, {
          ngModuleRef: moduleRef
        });

        this.formRef.instance.close.subscribe(() => {
          this.closeModal();
        });

        this.formLoading = false;
      });
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.formLoading = false;
    this.formRef?.destroy();
    this.formRef = undefined;
    this.formHost?.clear();
  }

  createChart(): void {
    const adminCount = this.users.filter(user => user.role === 'Admin').length;
    const editorCount = this.users.filter(user => user.role === 'Editor').length;
    const viewerCount = this.users.filter(user => user.role === 'Viewer').length;

    const chartData = {
      type: 'pie',
      data: {
        labels: ['Admin', 'Editor', 'Viewer'],
        datasets: [
          {
            data: [adminCount, editorCount, viewerCount]
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              boxWidth: 16,
              boxHeight: 16,
              font: {
                size: 16
              }
            }
          }
        }
      }
    };

    const renderChart = (Chart: any) => {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart('roleChart', chartData);
    };

    if (this.Chart) {
      renderChart(this.Chart);
      return;
    }

    import('chart.js/auto').then((chartModule) => {
      this.Chart = chartModule.default;
      renderChart(this.Chart);
    });
  }
}
