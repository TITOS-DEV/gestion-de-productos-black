import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  // Texto que el usuario escribe. Two-way binding con [(ngModel)] en el input.
  searchTerm = '';

  // Avisa al componente padre que el usuario confirmó la búsqueda.
  search = output<string>();

  onSubmit(): void {
    this.search.emit(this.searchTerm.trim());
  }
}
