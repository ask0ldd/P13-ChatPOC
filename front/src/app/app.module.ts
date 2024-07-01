import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from './module/shared.module';
import { MessageComponent } from './chat/message/message.component';
import { AppRoutingModule } from './app-routing.module';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { JoiningAlertComponent } from './chat/joining-alert/joining-alert.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    MessageComponent,
    DateFormatPipe,
    JoiningAlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
