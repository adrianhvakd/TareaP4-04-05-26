import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { LayoutAdminComponent } from './features/admin/layout/layout.admin';
import { LayoutUserComponent } from './features/user/layout/layout.user';
import { UsuariosAdminComponent } from './features/admin/usuarios/usuarios.admin';
import { EmpresasAdminComponent } from './features/admin/empresas/empresas.admin';
import { TramitesAdminComponent } from './features/admin/tramites/tremites.admin';
import { DashboardAdminComponent } from './features/admin/dashboard/dashboard.admin';
import { DashboardUserComponent } from './features/user/dashboard/dashboard.user';
import { EmpresasUserComponent } from './features/user/empresas/empresas.user';
import { TramitesUserComponent } from './features/user/tramites/tramites.user';
import { PagosUserComponent } from './features/user/pagos/pagos.user';
import { adminGuard, userGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';


export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [publicGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: LayoutAdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardAdminComponent,
      },
      {
        path: 'usuarios',
        component: UsuariosAdminComponent,
      },
      {
        path: 'empresas',
        component: EmpresasAdminComponent,
      },
      {
        path: 'tramites',
        component: TramitesAdminComponent,
      },
    ],
  },
  {
    path: 'user',
    canActivate: [userGuard],
    component: LayoutUserComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardUserComponent,
      },
      {
        path: 'empresas',
        component: EmpresasUserComponent,
      },
      {
        path: 'tramites',
        component: TramitesUserComponent,
      },
      {
        path: 'pagos',
        component: PagosUserComponent,
      },
    ],
  },
];
