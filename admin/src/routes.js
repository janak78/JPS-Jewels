import Index from "views/Index.js";
import Login from "views/Login/Login";
import User from "views/User/User";
import Stock from "views/Stock/Stock";
import Addcard from "views/Addcart/Addcard";
import Order from "views/Order/Order";
import Contact from "views/Contact/Contact";
import History from "views/History/History";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },  

  {
    path: "/User",
    name: "Users",
    icon: "fa-solid fa-user",
    component: <User />,
    layout: "/admin",
  },
  {
    path: "/Addcard",
    name: "Cart",
    icon: "fa-solid fa-clipboard-list",
    component: <Addcard />,
    layout: "/admin",
  },
  {
    path: "/Order",
    name: "Orders",
    icon: "fa-solid fa-cart-shopping",
    component: <Order />,
    layout: "/admin",
  },
  {
    path: "/Stock",
    name: "Stocks",
    icon: "fa-solid fa-money-bill-trend-up",
    component: <Stock />,
    layout: "/admin",
  },
  {
    path: "/Contact",
    name: "Contacts",
    icon: "fa-duotone fa-solid fa-envelope",
    component: <Contact />,
    layout: "/admin",
  },
  {
    path: "/History",
    name: "History",
    icon: "fa-solid fa-clock-rotate-left",
    component: <History />,
    layout: "/admin",
  },

  {
    path: "/login",
    component: <Login />,
    layout: "/auth",
    name: "Logout",
    icon: "fa-solid fa-right-from-bracket",
  },
];
export default routes;
