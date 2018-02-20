import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { HomeComponent }  from './home.component';
import { DashboardComponent }  from './dashboard.component';
import { TeamSelectionComponent }  from './teamselection.component';
import { RulesComponent }  from './rules.component';
import { ScoringComponent }  from './scoring.component';
import { PerformanceComponent }  from './performance.component';
import { HomeService }  from './home.service';
import { SharedService } from './shared.service';
import { routing } from './app.routing';

@NgModule({
  imports:      [ BrowserModule,
                    FormsModule,
                    HttpModule,
                    routing ],
  declarations: [ AppComponent,
                    HomeComponent,
                    DashboardComponent,
                    TeamSelectionComponent,
                    RulesComponent,
                    ScoringComponent,
                    PerformanceComponent],
  providers: [
    HomeService,
    SharedService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
