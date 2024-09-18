import { Component, Output, EventEmitter  } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  template: `
    <ul class="sidebar">
      <li class="sidebar-tab" [class.active]="selectedTab === 'account'" (click)="selectTab('account')">My Account</li>
      <li class="sidebar-tab" [class.active]="selectedTab === 'orders'" (click)="selectTab('orders')">My Orders</li>
    </ul>
  `,
  styleUrl: `./sidebar.component.scss`
})
export class SidebarComponent {
  @Output() tabSelected = new EventEmitter<string>(); // for child components to communicate "upwards" to their parents

  selectedTab = "account"; // default

  selectTab(tab: string){
    console.log('Tab clicked:', tab);
    this.selectedTab = tab;
    this.tabSelected.emit(tab); // emits the selected tab (as a string) to the parent component
    console.log('Tab click event emitted:', tab);
  }
}
