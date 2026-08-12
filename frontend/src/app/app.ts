import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/layout/navbar/navbar';
import { Sidebar } from './components/layout/sidebar/sidebar';
import { Footer } from './components/layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidebar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
