import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostComponent } from './post/post.component';
import { ActivityComponent } from './activity/activity.component';
import { TaskComponent } from './task/task.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
	{
    path: '',
    component: HomeComponent,
    children: [
      { component: PostComponent, path: 'post' },
      { component: ActivityComponent, path: 'activities' },
      { component: TaskComponent, path: 'task' },
      { component: ProfileComponent, path: 'profile/:username' },
      { component: ProfileComponent, path: 'myprofile/:username' },
    ]
  },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule { }
