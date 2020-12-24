import React from 'react';


const Users = React.lazy(() => import('./views/Users/Users'));

const Config = React.lazy(() => import('./views/Config/Config'));
const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const Notification = React.lazy(() => import('./views/Notifications/notification'))

let routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: process.env.PUBLIC_URL + '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: process.env.PUBLIC_URL + '/users', exact: true, name: 'Users', component: Users },

  { path: process.env.PUBLIC_URL + '/config', exact: true, name: 'Config', component: Config },

  { path: process.env.PUBLIC_URL + '/business', exact: true, name: 'Business', component: Users },

  { path: process.env.PUBLIC_URL + '/notification', exact: true, name: 'Notification', component: Notification },

  { path: process.env.PUBLIC_URL + '/bulk-notification', exact: true, name: 'Bulk Notification', component: Notification },




];

export default routes;
