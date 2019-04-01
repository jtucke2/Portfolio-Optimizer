import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'po-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  constructor(public userService: UserService) { }
}
