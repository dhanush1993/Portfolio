import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BackgroundComponentComponent } from './components/background-component/background-component.component'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InteractComponent } from './components/interact/interact.component';
import { QuestionComponent } from './components/question/question.component';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponentComponent,
    InteractComponent,
    QuestionComponent,
    HeaderButtonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
