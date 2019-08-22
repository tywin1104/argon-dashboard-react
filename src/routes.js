/*!


=========================================================
* Mentr Website - v1.0.0
=========================================================

* Copyright 2019 Mentr Team 

* Coded by Mentr Team

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


*/
import Index from "views/Index.jsx";
import Profile from "views/examples/Profile.jsx";
import Register from "views/examples/Register.jsx";
import Login from "views/examples/Login.jsx";
import Tables from "views/examples/Tables.jsx";
import MentorDetails from "./components/Mentor/MentorDetails.jsx";
import Clubs from "./components/Clubs/Clubs.jsx";
import ClubDetails from './components/Clubs/ClubDetails'
import Election from './components/Election/Election'
import LunchMenu from './components/LunchMenu/LunchMenu'

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/lunch",
    name: "Lunch Menu",
    icon: "ni ni-basket text-warning",
    component: LunchMenu,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/mentor/:id",
    name: "MentorDetails",
    icon: "ni ni-bullet-list-67 text-red",
    component: MentorDetails,
    layout: "/admin"
  },
  {
    path: "/mentor",
    name: "Mentor",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin"
  },
  {
    path: "/clubs/:id",
    name: "ClubDetails",
    icon: "ni ni-bullet-list-67 text-red",
    component: ClubDetails,
    layout: "/admin"
  },
  {
    path: "/clubs",
    name: "Clubs",
    icon: "ni ni-atom text-red",
    component: Clubs,
    layout: "/admin"
  },
  {
    path: "/election",
    name: "Election",
    icon: "ni ni-chart-bar-32 text-green",
    component: Election,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
];
export default routes;
