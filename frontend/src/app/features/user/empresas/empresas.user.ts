import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EmpresaService, Empresa, CreateEmpresaDto, UpdateEmpresaDto } from "../../services/empresa.service";

@Component({
    selector: 'app-empresas-user',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './empresas.user.html'
})
export class EmpresasUserComponent implements OnInit {
    private empresaService = inject(EmpresaService);

    empresas = signal<Empresa[]>([]);
    loading = signal(false);
    searchTerm = signal('');
    currentPage = signal(1);
    totalPages = signal(1);
    total = signal(0);

    showModal = signal(false);
    editingEmpresa = signal<Empresa | null>(null);
    isEditing = signal(false);

    formData: CreateEmpresaDto = {
        nombre: '',
        direccion: '',
        telefono: ''
    };

    ngOnInit() {
        this.loadEmpresas();
    }

    loadEmpresas(page: number = 1) {
        this.loading.set(true);
        const params: any = { page, limit: 10 };
        
        if (this.searchTerm()) {
            params.nombre = this.searchTerm();
        }

        this.empresaService.getAll(page, 10, this.searchTerm() || undefined).subscribe({
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

    openCreateModal() {
        this.isEditing.set(false);
        this.editingEmpresa.set(null);
        this.formData = { nombre: '', direccion: '', telefono: '' };
        this.showModal.set(true);
    }

    openEditModal(empresa: Empresa) {
        this.isEditing.set(true);
        this.editingEmpresa.set(empresa);
        this.formData = {
            nombre: empresa.nombre,
            direccion: empresa.direccion,
            telefono: empresa.telefono
        };
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
        this.editingEmpresa.set(null);
    }

    saveEmpresa() {
        this.loading.set(true);
        
        if (this.isEditing() && this.editingEmpresa()) {
            this.empresaService.update(this.editingEmpresa()!.id, this.formData).subscribe({
                next: () => {
                    this.loadEmpresas(this.currentPage());
                    this.closeModal();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else {
            this.empresaService.create(this.formData).subscribe({
                next: () => {
                    this.loadEmpresas(1);
                    this.closeModal();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }

    deleteEmpresa(empresa: Empresa) {
        if (confirm(`¿Estás seguro de eliminar la empresa "${empresa.nombre}"?`)) {
            this.loading.set(true);
            this.empresaService.delete(empresa.id).subscribe({
                next: () => {
                    this.loadEmpresas(this.currentPage());
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }
}