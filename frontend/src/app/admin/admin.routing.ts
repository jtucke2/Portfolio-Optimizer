import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/admin/manage-users',
                pathMatch: 'full',
            },
            {
                path: 'manage-users',
                component: ManageUsersComponent
            }
        ]
    }
];

export const AdminRoutingModule = RouterModule.forChild(routes);
