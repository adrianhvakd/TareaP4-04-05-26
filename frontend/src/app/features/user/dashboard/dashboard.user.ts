import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import { TramiteService, Tramite, EstadoType } from "../../services/tramite.service";
import { EmpresaService } from "../../services/empresa.service";
import { PagoService, Pago } from "../../services/pago.service";

@Component({
    selector: 'app-dashboard-user',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './dashboard.user.html'
})
export class DashboardUserComponent implements OnInit {
    private tramiteService = inject(TramiteService);
    private empresaService = inject(EmpresaService);
    private pagoService = inject(PagoService);

    loading = signal(true);
    tramites = signal<Tramite[]>([]);
    empresas = signal<any[]>([]);
    pagos = signal<Pago[]>([]);

    totalTramites = signal(0);
    totalEmpresas = signal(0);
    totalPagos = signal(0);
    montoTotal = signal(0);
    montoCobrado = signal(0);

    doughnutChartLabels: string[] = [];
    doughnutChartData: number[] = [];
    doughnutChartType: ChartType = 'doughnut';

    barChartLabels: string[] = [];
    barChartData: number[] = [];
    barChartType: ChartType = 'bar';

    cobrosLabels: string[] = ['Pendiente', 'Cobrado'];
    cobrosData: number[] = [0, 0];

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        
        this.tramiteService.getAll(1, 1000).subscribe({
            next: (res) => {
                this.tramites.set(res.data);
                this.totalTramites.set(res.total);
                this.montoTotal.set(res.data.reduce((sum, t) => sum + Number(t.monto), 0));
                this.updateCharts();
            }
        });

        this.empresaService.getAll(1, 1000).subscribe({
            next: (res) => {
                this.empresas.set(res.data);
                this.totalEmpresas.set(res.total);
            }
        });

        this.pagoService.getAll(1, 1000).subscribe({
            next: (res) => {
                this.pagos.set(res.data);
                this.totalPagos.set(res.total);
                this.montoCobrado.set(res.data.reduce((sum, p) => sum + Number(p.montoPagado), 0));
                this.updateCobrosChart();
                this.loading.set(false);
            }
        });
    }

    updateCharts() {
        const estadoCounts: Record<string, number> = {};
        this.tramites().forEach(t => {
            const estado = t.estado || 'Sin estado';
            estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
        });

        this.doughnutChartLabels = Object.keys(estadoCounts);
        this.doughnutChartData = Object.values(estadoCounts);

        const topEmpresas = this.tramites()
            .reduce((acc, t) => {
                const nombre = t.empresa?.nombre || 'Sin empresa';
                acc[nombre] = (acc[nombre] || 0) + Number(t.monto);
                return acc;
            }, {} as Record<string, number>);

        const sorted = Object.entries(topEmpresas)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        this.barChartLabels = sorted.map(([k]) => k);
        this.barChartData = sorted.map(([, v]) => v);
    }

    updateCobrosChart() {
        const pendiente = this.montoTotal() - this.montoCobrado();
        this.cobrosData = [Math.max(0, pendiente), this.montoCobrado()];
    }

    getEstadoColor(estado: string): string {
        const colors: Record<string, string> = {
            'En proceso': '#f59e0b',
            'Terminado': '#10b981',
            'Declarado': '#3b82f6',
            'Para cobro': '#ef4444',
            'Cobrado': '#22c55e',
            'Archivo': '#6b7280',
            'Inactivo': '#dc2626'
        };
        return colors[estado] || '#6b7280';
    }

    getChartColors(): string[] {
        return this.doughnutChartLabels.map(label => this.getEstadoColor(label));
    }
}