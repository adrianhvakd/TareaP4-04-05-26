import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Usuario, UsuariosService } from "../../services/usuarios.service";

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './usuarios.admin.html'
})
export class UsuariosAdminComponent implements OnInit {
    private usuariosService = inject(UsuariosService);

    usuarios = signal<Usuario[]>([]);
    loading = signal(false);
    searchTerm = signal('');
    currentPage = signal(1);
    totalPages = signal(1);
    total = signal(0);

    showModal = signal(false);
    editingUsuario = signal<Usuario | null>(null);
    isEditing = signal(false);

    formData = {
        username: '',
        email: '',
        password: '',
        role: 'user' as 'admin' | 'user'
    };

    ngOnInit() {
        this.loadUsuarios();
    }

    loadUsuarios(page: number = 1) {
        this.loading.set(true);
        
        this.usuariosService.getAll(page, 10, this.searchTerm() || undefined).subscribe({
            next: (res) => {
                this.usuarios.set(res.data);
                this.total.set(res.total);
                this.totalPages.set(Math.ceil(res.total / res.limit));
                this.currentPage.set(page);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    search() {
        this.loadUsuarios(1);
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.loadUsuarios(this.currentPage() + 1);
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.loadUsuarios(this.currentPage() - 1);
        }
    }

    openCreateModal() {
        this.isEditing.set(false);
        this.editingUsuario.set(null);
        this.formData = { username: '', email: '', password: '', role: 'user' };
        this.showModal.set(true);
    }

    openEditModal(usuario: Usuario) {
        this.isEditing.set(true);
        this.editingUsuario.set(usuario);
        this.formData = {
            username: usuario.username,
            email: usuario.email,
            password: '',
            role: usuario.role
        };
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
        this.editingUsuario.set(null);
    }

    saveUsuario() {
        this.loading.set(true);
        
        if (this.isEditing() && this.editingUsuario()) {
            this.usuariosService.update(this.editingUsuario()!.id, {
                username: this.formData.username,
                email: this.formData.email,
                role: this.formData.role
            }).subscribe({
                next: () => {
                    this.loadUsuarios(this.currentPage());
                    this.closeModal();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else {
            this.usuariosService.create(this.formData).subscribe({
                next: () => {
                    this.loadUsuarios(1);
                    this.closeModal();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }

    deleteUsuario(usuario: Usuario) {
        if (confirm(`¿Estás seguro de eliminar al usuario "${usuario.username}"?`)) {
            this.loading.set(true);
            this.usuariosService.delete(usuario.id).subscribe({
                next: () => {
                    this.loadUsuarios(this.currentPage());
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }
}