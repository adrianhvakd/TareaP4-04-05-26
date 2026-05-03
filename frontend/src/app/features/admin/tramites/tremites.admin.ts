import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TramiteService, Tramite, EstadoType } from "../../services/tramite.service";

@Component({
    selector: 'app-tramites-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tramites.admin.html'
})
export class TramitesAdminComponent implements OnInit {
    private tramiteService = inject(TramiteService);

    tramites = signal<Tramite[]>([]);
    loading = signal(false);
    currentPage = signal(1);
    totalPages = signal(1);
    total = signal(0);

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

    getMontoTotal(): number {
        return this.tramites().reduce((sum, t) => sum + Number(t.monto), 0);
    }

    getCountByEstado(estado: string): number {
        return this.tramites().filter(t => t.estado === estado).length;
    }
}