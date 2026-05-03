import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-layout-user',
    standalone: true,
    templateUrl: './layout.user.html',
    imports: [RouterOutlet, RouterLink]
})
export class LayoutUserComponent{
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
    ]
}