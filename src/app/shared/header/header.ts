import { ChangeDetectionStrategy, Component, HostListener, signal, inject, OnInit, OnDestroy, computed, output } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSub?: Subscription;

  isMenuOpen = signal(false);
  isScrolled = signal(false);
  isHomePage = signal(true); 

  menuToggled = output<boolean>();

  isTransparent = computed(() => this.isHomePage() && !this.isScrolled() && !this.isMenuOpen());

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }

  ngOnInit(): void {
    // Check if on home page - adapt to new routing structure
    this.isHomePage.set(this.router.url === '/' || this.router.url === '/home');

    this.routerSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage.set(event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home');
      this.closeMenu();
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen.update(value => {
      const newState = !value;
      this.menuToggled.emit(newState);
      return newState;
    });
  }

  closeMenu() {
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(false);
      this.menuToggled.emit(false);
    }
  }
}
