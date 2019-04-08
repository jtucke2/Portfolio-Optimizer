import { PortfolioComponent } from './portfolio/portfolio.component';
import { OptimizationComponent } from './optimization/optimization.component';
import { SelectJobMsgComponent } from './optimization/select-job-msg/select-job-msg.component';
import { JobViewerComponent } from './optimization/job-viewer/job-viewer.component';

export const dashboardRoutes = [
    {
        path: 'portfolio',
        component: PortfolioComponent
    },
    {
        path: 'optimization',
        component: OptimizationComponent,
        children: [
            {
                path: 'job',
                component: JobViewerComponent
            },
            {
                path: '',
                component: SelectJobMsgComponent
            }
        ]
    }
];
