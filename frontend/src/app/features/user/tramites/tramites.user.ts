import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TramiteService, Tramite, EstadoType, CreateTramiteDto } from "../../services/tramite.service";
import { EmpresaService, Empresa } from "../../services/empresa.service";

@Component({
    selector: 'app-tramites-user',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tramites.user.html'
})
export class TramitesUserComponent implements OnInit {
    private tramiteService = inject(TramiteService);
    private empresaService = inject(EmpresaService);

    tramites = signal<Tramite[]>([]);
    empresas = signal<Empresa[]>([]);
    loading = signal(false);
    currentPage = signal(1);
    totalPages = signal(1);
    total = signal(0);

    showModal = signal(false);
    showEstadoModal = signal(false);
    selectedTramite = signal<Tramite | null>(null);

    formData: CreateTramiteDto = {
        empresaId: '',
        monto: 0,
        estado: EstadoType.EN_PROCESO
    };

    estados = Object.values(EstadoType);

    getEstadoColor(estado: string): string {
        const colors: Record<string, string> = {
            'En proceso': 'badge-warning',
            'Terminado': 'badge-success',
            'Declarado': 'badge-info',
            'Para cobro': 'badge-error',
            'Cobrado': 'badge-success',
            'Archivo': 'badge-ghost',
            'Inactivo': 'badge-error'
        };
        return colors[estado] || 'badge-ghost';
    }

    ngOnInit() {
        this.loadTramites();
        this.loadEmpresas();
    }

    loadTramites(page: number = 1) {
        this.loading.set(true);
        this.tramiteService.getAll(page, 10).subscribe({
            next: (res) => {
                this.tramites.set(res.data);
                this.total.set(res.total);
                this.totalPages.set(Math.ceil(res.total / res.limit));
                this.currentPage.set(page);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadEmpresas() {
        this.empresaService.getAll(1, 100).subscribe({
            next: (res) => this.empresas.set(res.data),
            error: () => {}
        });
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.loadTramites(this.currentPage() + 1);
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.loadTramites(this.currentPage() - 1);
        }
    }

    openCreateModal() {
        this.formData = { empresaId: '', monto: 0, estado: EstadoType.EN_PROCESO };
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
    }

    saveTramite() {
        this.loading.set(true);
        this.tramiteService.create(this.formData).subscribe({
            next: () => {
                this.loadTramites(1);
                this.closeModal();
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    openEstadoModal(tramite: Tramite) {
        this.selectedTramite.set(tramite);
        this.showEstadoModal.set(true);
    }

    closeEstadoModal() {
        this.showEstadoModal.set(false);
        this.selectedTramite.set(null);
    }

    updateEstado(estado: EstadoType) {
        if (!this.selectedTramite()) return;
        
        this.loading.set(true);
        this.tramiteService.update(this.selectedTramite()!.id, { estado }).subscribe({
            next: () => {
                this.loadTramites(this.currentPage());
                this.closeEstadoModal();
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    deleteTramite(tramite: Tramite) {
        if (confirm('¿Estás seguro de eliminar este trámite? También se eliminarán los pagos asociados.')) {
            this.loading.set(true);
            this.tramiteService.delete(tramite.id).subscribe({
                next: () => {
                    this.loadTramites(this.currentPage());
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }
}