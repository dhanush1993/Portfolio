import { Injectable, ModuleWithProviders } from '@angular/core';
import { SharedServiceService } from './shared-service.service';

@Injectable({providedIn: 'root'})
export class EventsService {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EventsService,
      providers: [ SharedServiceService ]
    }
  }
  
}
