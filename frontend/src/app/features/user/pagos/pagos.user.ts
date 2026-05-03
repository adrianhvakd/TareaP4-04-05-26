import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PagoService, Pago, MetodoPagoType, CreatePagoDto } from "../../services/pago.service";
import { TramiteService, Tramite, EstadoType } from "../../services/tramite.service";

@Component({
    selector: 'app-pagos-user',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pagos.user.html'
})
export class PagosUserComponent implements OnInit {
    private pagoService = inject(PagoService);
    private tramiteService = inject(TramiteService);

    pagos = signal<Pago[]>([]);
    tramites = signal<Tramite[]>([]);
    loading = signal(false);
    currentPage = signal(1);
    totalPages = signal(1);
    total = signal(0);

    showModal = signal(false);
    formData: CreatePagoDto = {
        tramiteId: '',
        montoPagado: 0,
        metodoPago: MetodoPagoType.QR,
        comprobante: ''
    };

    metodos = Object.values(MetodoPagoType);

    private estadosParaPagar = [
        EstadoType.EN_PROCESO,
        EstadoType.TERMINADO,
        EstadoType.DECLARADO,
        EstadoType.PARA_COBRO
    ];

    tramitesParaPagar = computed(() => 
        this.tramites().filter(t => this.estadosParaPagar.includes(t.estado))
    );

    getMetodoColor(metodo: string): string {
        return metodo === 'QR' ? 'badge-info' : 'badge-success';
    }

    ngOnInit() {
        this.loadPagos();
        this.loadTramites();
    }

    loadPagos(page: number = 1) {
        this.loading.set(true);
        this.pagoService.getAll(page, 10).subscribe({
            next: (res) => {
                this.pagos.set(res.data);
                this.total.set(res.total);
                this.totalPages.set(Math.ceil(res.total / res.limit));
                this.currentPage.set(page);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadTramites() {
        this.tramiteService.getAll(1, 100).subscribe({
            next: (res) => this.tramites.set(res.data),
            error: () => {}
        });
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.loadPagos(this.currentPage() + 1);
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.loadPagos(this.currentPage() - 1);
        }
    }

    openCreateModal() {
        this.formData = {
            tramiteId: '',
            montoPagado: 0,
            metodoPago: MetodoPagoType.QR,
            comprobante: ''
        };
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
    }

    savePago() {
        this.loading.set(true);
        this.pagoService.create(this.formData).subscribe({
            next: () => {
                this.loadPagos(1);
                this.loadTramites();
                this.closeModal();
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    deletePago(pago: Pago) {
        if (confirm('¿Estás seguro de eliminar este pago?')) {
            this.loading.set(true);
            this.pagoService.delete(pago.id).subscribe({
                next: () => {
                    this.loadPagos(this.currentPage());
                    this.loadTramites();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }

    getTotalMonto(): number {
        return this.pagos().reduce((sum, p) => sum + Number(p.montoPagado), 0);
    }
}