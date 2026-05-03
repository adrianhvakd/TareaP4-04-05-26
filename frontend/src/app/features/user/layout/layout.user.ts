import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";

@Component({
    selector: 'app-layout-user',
    standalone: true,
    templateUrl: './layout.user.html',
    imports: [RouterOutlet, RouterLink]
})
export class LayoutUserComponent{
    private authService = inject(AuthService);
    
    menuNav = [
        {
            name: 'Dashboard',
            route: 'dashboard',
            icon: 'dashboard'
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
        },
        {
            name: 'Pagos',
            route: 'pagos',
            icon: 'attach_money'
        }
    ];

    logout() {
        this.authService.logout().subscribe();
    }
}