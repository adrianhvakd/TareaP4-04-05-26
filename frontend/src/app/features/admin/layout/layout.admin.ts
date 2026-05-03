import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-layout-admin',
    standalone: true,
    templateUrl: './layout.admin.html',
    imports: [RouterOutlet, RouterLink]
})
export class LayoutAdminComponent {
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
    ]
}