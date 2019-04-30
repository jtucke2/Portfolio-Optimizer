import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService } from '../../services/user.service';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  public onDestroy$ = new Subject<null>();
  public percentMixers = [
    {
      aapl: 0.5,
      googl: 0.2,
      msft: 0.3,
    },
    {
      aapl: 0.1,
      googl: 0.8,
      msft: 0.1,
    },
    {
      aapl: 0.0,
      googl: 0.3,
      msft: 0.7,
    }
  ];
  public percentMixer = this.percentMixers[0];

  constructor(public userService: UserService) { }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  ngOnInit() {
    let counter = 1;
    interval(3000)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.percentMixer = this.percentMixers[counter % 3];
        counter++;
      });
  }

}
