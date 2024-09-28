import { Routes } from '@angular/router';
import {IndexComponent} from "./components/index/index.component";
import {RegisterComponent} from "./components/register/register.component";
import {EventsComponent} from "./components/events/events.component";
import {LoginComponent} from "./components/login/login.component";
import {tokenGuard} from "./guards/token.guard";
import {EventCreateComponent} from "./components/event-create/event-create.component";
import {EventDetailsComponent} from "./components/event-details/event-details.component";
import {EventConfigureComponent} from "./components/event-configure/event-configure.component";

export const routes: Routes = [
  {
    title: "Homepage",
    path: "",
    component: IndexComponent
  },
  {
    title: "User Registration",
    path: "register",
    component: RegisterComponent
  },
  {
    title: "Login",
    path: "login",
    component: LoginComponent
  },
  {
    title: "Events",
    path: "events",
    component: EventsComponent,
    canActivate: [tokenGuard],
  },
  {
    title: "Event Create",
    path: "events/create",
    component: EventCreateComponent,
    canActivate: [tokenGuard],
  },
  {
    title: "Event Details",
    path: "events/:event_id",
    component: EventDetailsComponent,
    canActivate: [tokenGuard],
  },
  {
    title: "Event Configuration",
    path: "events/:event_id/configure",
    component: EventConfigureComponent,
    canActivate: [tokenGuard],
  },
];
