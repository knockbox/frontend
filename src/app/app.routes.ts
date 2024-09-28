import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import {RegisterComponent} from "./register/register.component";
import {EventsComponent} from "./events/events.component";

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
    title: "Events",
    path: "events",
    component: EventsComponent
  },
];
