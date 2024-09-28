import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";

export const routes: Routes = [
  {
    title: "Index",
    path: "",
    pathMatch: "prefix",
    component: IndexComponent
  }
];
