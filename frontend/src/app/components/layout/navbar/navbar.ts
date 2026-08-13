import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchBar } from '../../ui/search-bar/search-bar';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, SearchBar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  modal = inject(ModalService);
  auth = inject(AuthService);

  onSearch(term: string): void {
    this.router.navigate(['/'], { queryParams: { search: term || null } });
  }
}