import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-welcome-image',
  template: `
  <div class="bg-no-repeat bg-contain bg-center flex h-full w-full">
    <img src="assets/img/illu.jpg" alt="" width="90%">
  </div>
  `,
  // styleUrls: ['../admin/components/welcome-image/welcome-image.component.scss']
})
export class WelcomeImageComponent {

}
