import { Component, Input } from '@angular/core';
import { IChatMessage } from 'src/app/interfaces/IChatMessage';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
   @Input() message! : IChatMessage
}
