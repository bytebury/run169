import { Component, ViewChild, computed } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn = computed(() => this.authenticationService.isLoggedIn());
  currentUser = computed(() => this.authenticationService.currentUser());

  @ViewChild('drawer') drawerRef!: MatDrawer;

  constructor(private authenticationService: AuthenticationService) {}

  logout(): void {
    this.drawerRef.close();
    this.authenticationService.logout();
  }
}
