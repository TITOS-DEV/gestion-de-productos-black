import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchBar } from '../../ui/search-bar/search-bar';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, SearchBar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);

  // El home lee "search" de la query param para filtrar el listado.
  onSearch(term: string): void {
    this.router.navigate(['/'], { queryParams: { search: term || null } });
  }
}
