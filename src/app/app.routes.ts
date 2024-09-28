import { Routes } from '@angular/router';
import {IndexComponent} from "./components/index/index.component";
import {RegisterComponent} from "./components/register/register.component";
import {EventsComponent} from "./components/events/events.component";
import {LoginComponent} from "./components/login/login.component";
import {tokenGuard} from "./guards/token.guard";

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
    canActivate: [tokenGuard]
  },
];
