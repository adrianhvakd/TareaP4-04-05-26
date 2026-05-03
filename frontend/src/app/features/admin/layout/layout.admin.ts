import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";

@Component({
    selector: 'app-layout-admin',
    standalone: true,
    templateUrl: './layout.admin.html',
    imports: [RouterOutlet, RouterLink]
})
export class LayoutAdminComponent {
    private authService = inject(AuthService);
    
    menuNav = [
        {
            name: 'Dashboard',
            route: 'dashboard',
            icon: 'dashboard'
        },
        {
            name: 'Usuarios',
            route: 'usuarios',
            icon: 'groups'
        },
        {
            name: 'Empresas',
            route: 'empresas',
            icon: 'apartment'
        },
        {
            name: 'Tramites',
            route: 'tramites',
            icon: 'folder_copy'
        }
    ];

    logout() {
        this.authService.logout().subscribe();
    }
}