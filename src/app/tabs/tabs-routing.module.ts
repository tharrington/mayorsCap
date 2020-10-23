import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { 
        path: 'meetings', 
        children : [
          { path : '', loadChildren: () => import('../meeting-detail/meeting-detail.module').then(m => m.MeetingDetailPageModule) },
          { path : 'session/:id', loadChildren: () => import('../sessions-detail/sessions-detail.module').then( m => m.SessionsDetailPageModule) },
          { path : 'attendees', loadChildren: () => import('../attendees/attendees.module').then( m => m.AttendeesPageModule) },
          { path : 'notices', loadChildren: () => import('../notices/notices.module').then( m => m.NoticesPageModule) },
          { path : 'assistance', loadChildren: () => import('../assistance/assistance.module').then( m => m.AssistancePageModule) },
          { path : 'list', loadChildren: () => import('../meeting-list/meeting-list.module').then( m => m.MeetingListPageModule) },
          { path : 'agenda', loadChildren: () => import('../agenda/agenda.module').then( m => m.AgendaPageModule) },
          { path : 'mayors/:id', loadChildren: () => import('../mayors-detail/mayors-detail.module').then(m => m.MayorsDetailPageModule) },
          { path : 'sponsors', loadChildren: () => import('../sponsors/sponsors.module').then(m => m.SponsorsPageModule) },
          { path : 'sponsors/:id', loadChildren: () => import('../sponsors-detail/sponsors-detail.module').then(m => m.SponsorsDetailPageModule) },
          { path : 'committees', loadChildren: () => import('../committees/committees.module').then(m => m.CommitteesPageModule) },
          { path : 'committees/:id', loadChildren: () => import('../committees-detail/committees-detail.module').then(m => m.CommitteesDetailPageModule) },
          { path : 'resolutions', loadChildren: () => import('../resolutions/resolutions.module').then(m => m.ResolutionsPageModule) },
          { path : 'resolutions/:id', loadChildren: () => import('../resolutions-detail/resolutions-detail.module').then(m => m.ResolutionsDetailPageModule) },
          { path : 'resolution-categories', loadChildren: () => import('../resolution-categories/resolution-categories.module').then(m => m.ResolutionCategoriesPageModule) },
          { path : 'activities', loadChildren: () => import('../activities-list/activities-list.module').then(m => m.ActivitiesListPageModule) },
          { path : 'activities/:id', loadChildren: () => import('../activities-detail/activities-detail.module').then(m => m.ActivitiesDetailPageModule) },
        ] 
      },
      { 
        path: 'mayors',
        children : [
          { path : '', loadChildren: () => import('../mayors/mayors.module').then(m => m.MayorsPageModule) },
          { path : ':id', loadChildren: () => import('../mayors-detail/mayors-detail.module').then(m => m.MayorsDetailPageModule) },
        ] 
      },
      { 
        path: 'news',
        children : [
          { path : '', loadChildren: () => import('../news/news.module').then(m => m.NewsPageModule) },
          { path : ':id', loadChildren: () => import('../news-detail/news-detail.module').then(m => m.NewsDetailPageModule) }
        ] 
      },
      { 
        path: 'policies',
        children : [
          { path : '', loadChildren: () => import('../policies/policies.module').then(m => m.PoliciesPageModule) },
          { path : 'policy-list', loadChildren: () => import('../policies-list/policies-list.module').then(m => m.PoliciesListPageModule) },
          { path : 'policy/:id', loadChildren: () => import('../policies-detail/policies-detail.module').then(m => m.PoliciesDetailPageModule) }
        ] 
      },
      { 
        path: 'home',
        children : [
          { path : '', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
          { path : 'profile', loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule) },
          { path : 'verify', loadChildren: () => import('../verify/verify.module').then( m => m.VerifyPageModule) },
          { path : 'notifications', loadChildren: () => import('../notifications/notifications.module').then( m => m.NotificationsPageModule) },
          { path : 'notifications/:id', loadChildren: () => import('../notifications-detail/notifications-detail.module').then( m => m.NotificationsDetailPageModule) },
          { path : 'mayors-update', loadChildren: () => import('../mayors-update/mayors-update.module').then( m => m.MayorsUpdatePageModule) },
          { path : 'mayors-update/:id', loadChildren: () => import('../mayors-update-detail/mayors-update-detail.module').then( m => m.MayorsUpdateDetailPageModule) },
        ] 
      }
    ]
  },
  { path: '', redirectTo: 'tabs/meetings', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

