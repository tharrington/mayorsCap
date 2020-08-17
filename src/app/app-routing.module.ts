import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./tutorial/tutorial.module').then( m => m.TutorialPageModule) },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule) },
  // {
  //   path: 'meeting-list',
  //   loadChildren: () => import('./meeting-list/meeting-list.module').then( m => m.MeetingListPageModule)
  // },
  // {
  //   path: 'agenda',
  //   loadChildren: () => import('./agenda/agenda.module').then( m => m.AgendaPageModule)
  // },
  // {
  //   path: 'committees',
  //   loadChildren: () => import('./committees/committees.module').then( m => m.CommitteesPageModule)
  // },
  // {
  //   path: 'committees-detail',
  //   loadChildren: () => import('./committees-detail/committees-detail.module').then( m => m.CommitteesDetailPageModule)
  // },
  // {
  //   path: 'resolutions',
  //   loadChildren: () => import('./resolutions/resolutions.module').then( m => m.ResolutionsPageModule)
  // },
  // {
  //   path: 'resolutions-detail',
  //   loadChildren: () => import('./resolutions-detail/resolutions-detail.module').then( m => m.ResolutionsDetailPageModule)
  // },
  // {
  //   path: 'attendees',
  //   loadChildren: () => import('./attendees/attendees.module').then( m => m.AttendeesPageModule)
  // },
  // {
  //   path: 'sponsors',
  //   loadChildren: () => import('./sponsors/sponsors.module').then( m => m.SponsorsPageModule)
  // },
  // {
  //   path: 'sponsors-detail',
  //   loadChildren: () => import('./sponsors-detail/sponsors-detail.module').then( m => m.SponsorsDetailPageModule)
  // },
  // {
  //   path: 'notices',
  //   loadChildren: () => import('./notices/notices.module').then( m => m.NoticesPageModule)
  // },
  // {
  //   path: 'assistance',
  //   loadChildren: () => import('./assistance/assistance.module').then( m => m.AssistancePageModule)
  // },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  // },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: 'policies',
  //   loadChildren: () => import('./policies/policies.module').then( m => m.PoliciesPageModule)
  // },
  // {
  //   path: 'policies-detail',
  //   loadChildren: () => import('./policies-detail/policies-detail.module').then( m => m.PoliciesDetailPageModule)
  // },
  // {
  //   path: 'news',
  //   loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  // },
  
  // {
  //   path: 'news-detail',
  //   loadChildren: () => import('./news-detail/news-detail.module').then( m => m.NewsDetailPageModule)
  // },
  // {
  //   path: 'policies-list',
  //   loadChildren: () => import('./policies-list/policies-list.module').then( m => m.PoliciesListPageModule)
  // },
  // {
  //   path: 'verify',
  //   loadChildren: () => import('./verify/verify.module').then( m => m.VerifyPageModule)
  // },
  // {
  //   path: 'metro',
  //   loadChildren: () => import('./metro/metro.module').then( m => m.MetroPageModule)
  // },
  // {
  //   path: 'mayors-update',
  //   loadChildren: () => import('./mayors-update/mayors-update.module').then( m => m.MayorsUpdatePageModule)
  // },
  // {
  //   path: 'mayors-update-detail',
  //   loadChildren: () => import('./mayors-update-detail/mayors-update-detail.module').then( m => m.MayorsUpdateDetailPageModule)
  // },
  // {
  //   path: 'activities-list',
  //   loadChildren: () => import('./activities-list/activities-list.module').then( m => m.ActivitiesListPageModule)
  // },
  // {
  //   path: 'activities-detail',
  //   loadChildren: () => import('./activities-detail/activities-detail.module').then( m => m.ActivitiesDetailPageModule)
  // },
  // {
  //   path: 'resolution-categories',
  //   loadChildren: () => import('./resolution-categories/resolution-categories.module').then( m => m.ResolutionCategoriesPageModule)
  // },
  // {
  //   path: 'notifications',
  //   loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  // },
  // {
  //   path: 'notifications-detail',
  //   loadChildren: () => import('./notifications-detail/notifications-detail.module').then( m => m.NotificationsDetailPageModule)
  // },
  // {
  //   path: 'resolution-cities',
  //   loadChildren: () => import('./resolution-cities/resolution-cities.module').then( m => m.ResolutionCitiesPageModule)
  // },
  // {
  //   path: 'submitted-resolutions',
  //   loadChildren: () => import('./submitted-resolutions/submitted-resolutions.module').then( m => m.SubmittedResolutionsPageModule)
  // }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
