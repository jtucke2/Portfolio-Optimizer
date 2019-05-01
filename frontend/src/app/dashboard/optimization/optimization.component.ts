import { Component, OnInit, OnDestroy } from '@angular/core';
import { merge, interval, of as observableOf, Subject } from 'rxjs';
import { debounceTime, switchMap, filter, tap, takeUntil, finalize, delay } from 'rxjs/operators';

import { DashboardService, CheckJobReturn } from '../dashboard.service';
import { CeleryState } from '../../models/celery';

@Component({
  selector: 'optimization',
  templateUrl: './optimization.component.html',
  styleUrls: ['./optimization.component.scss']
})
export class OptimizationComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();

  constructor(public dashboardService: DashboardService) { }

  ngOnDestroy() {
    this.onDestroy$.next(null);
  }

  ngOnInit() {
    const pollTasks$ = merge(
        interval(3000),
        observableOf(null).pipe(delay(500)),
        this.dashboardService.runPoller$
      )
      .pipe(
        finalize(() => console.log('Task poller shutting down')),
        takeUntil(this.onDestroy$),
        switchMap(() => {
          const tasksToCheck = this.dashboardService.portfolioTasks
            .filter(task => {
              // Only poll for tasks without a 'completed' state
              return ![CeleryState.SUCCESS, CeleryState.FAILURE].includes(task.state);
            })
            .map(task => task.task_id)
            .join(',');
          return tasksToCheck ? this.dashboardService.checkJobs(tasksToCheck) : observableOf(null);
        }),
        filter(res => !!res)
      )
      .subscribe((jobs: CheckJobReturn[]) => {
        jobs.forEach(job => {
          if (job.found && job.task) {
            const { task, result } = job;
            const taskIdx = this.dashboardService.portfolioTasks.findIndex(pTask => pTask.task_id === task._id);
            // Upadate task in list
            if (taskIdx > -1) {
              this.dashboardService.portfolioTasks[taskIdx].state = task.status;

              if (task.status === CeleryState.SUCCESS && result) {
                // This triggers the job list to rebuild
                this.dashboardService.retrievePortfolios$.next(null);
                const { _id: resultId } = result;
                this.dashboardService.listBadge[resultId] = { message: 'New', type: 'primary' };
                this.dashboardService.portfolioTasks[taskIdx].result_id = resultId;
              }
              // TODO handle failures
            }
          }
        });
      });
  }

}
