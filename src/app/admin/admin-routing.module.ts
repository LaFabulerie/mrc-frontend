import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { HomeComponent } from './home/home.component';
import { DebugComponent } from './debug/debug.component';
import {authGuard} from "../common/auth.guard";
import { QuestionsComponent } from './feedback/questions/questions.component';
import { AnswersComponent } from './feedback/answers/answers.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: '', redirectTo: 'catalogue', pathMatch: 'full'},
    { path: 'catalogue', component: CatalogComponent },
    { path: 'feedback', children: [
      { path: 'questions', component: QuestionsComponent },
      { path: 'answers', component: AnswersComponent },
      ]
    },
    { path: 'debug', component: DebugComponent },
  ], canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
