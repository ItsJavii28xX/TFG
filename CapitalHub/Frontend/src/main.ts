import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {inject} from "@vercel/analytics"
import {injectSpeedInsights} from "@vercel/speed-insights"
import { provideAnimations } from '@angular/platform-browser/animations';

inject()
injectSpeedInsights()
provideAnimations(),
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
