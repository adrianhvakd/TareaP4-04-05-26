import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EmpresaService, Empresa } from "../../services/empresa.service";

@Component({
    selector: 'app-empresas-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './empresas.admin.html'
})
export class EmpresasAdminComponent implements OnInit {
    private empresaService = inject(EmpresaService);

    empresas = signal<Empresa[]>([]);
    loading = signal(false);
    searchTerm = signal('');
    currentPage = signal(1);
    totalPages = signal(1);
    total = signal(0);

    selectedEmpresa = signal<Empresa | null>(null);

    ngOnInit() {
        this.loadEmpresas();
    }

    loadEmpresas(page: number = 1) {
        this.loading.set(true);
        const params: any = { page, limit: 12 };
        
        if (this.searchTerm()) {
            params.nombre = this.searchTerm();
        }

        this.empresaService.getAll(page, 12, this.searchTerm() || undefined).subscribe({
            next: (res) => {
                this.empresas.set(res.data);
                this.total.set(res.total);
                this.totalPages.set(Math.ceil(res.total / res.limit));
                this.currentPage.set(page);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    search() {
        this.loadEmpresas(1);
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.loadEmpresas(this.currentPage() + 1);
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.loadEmpresas(this.currentPage() - 1);
        }
    }

    openDetail(empresa: Empresa) {
        this.selectedEmpresa.set(empresa);
    }

    closeDetail() {
        this.selectedEmpresa.set(null);
    }
}