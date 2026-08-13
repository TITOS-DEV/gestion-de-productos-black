import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/layout/navbar/navbar';
import { Sidebar } from './components/layout/sidebar/sidebar';
import { Footer } from './components/layout/footer/footer';
import { AuthModal } from './components/auth-modal/auth-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidebar, Footer, AuthModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
