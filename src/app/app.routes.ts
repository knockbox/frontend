import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import {RegisterComponent} from "./register/register.component";

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
  }
];
