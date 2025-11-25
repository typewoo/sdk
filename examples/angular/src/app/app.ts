import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { StoreSdk } from '@store-sdk/core';

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  async ngOnInit(): Promise<void> {
    // const data = await StoreSdk.store.products.list();
    const data = await StoreSdk['store'].products.list();
    console.log(data);
  }
}
