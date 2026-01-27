import { Component, signal, Renderer2, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Disclaimer, SESSION_KEY } from '../app/pages/disclaimer/disclaimer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Disclaimer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private renderer = inject(Renderer2);
  
  title = signal('law-website');
  agreed = signal<boolean>(this.readConsent());
  isMenuOpen = signal(false);

  private readConsent(): boolean {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  }

  onAgreed() {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch { }
    this.agreed.set(true);
  }

  onMenuToggle(isOpen: boolean): void {
    this.isMenuOpen.set(isOpen);
    if (isOpen) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }
}