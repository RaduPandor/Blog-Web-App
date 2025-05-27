import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import ViewPost from "./Pages/ViewPost";
import EditPost from "./Pages/EditPost";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ManageUsers from "./Pages/ManageUsers";
import EditProfile from "./Pages/EditProfile"
import AddPost from "./Pages/AddPost"

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "post/:id", Component: ViewPost },
      { path: "post/:id/edit", Component: EditPost },
      { path: "register", Component: Register },
      { path: "login", Component: Login },
      { path: "manage-users", Component: ManageUsers },
      { path: "edit-profile", Component: EditProfile },
      { path: "add-post", Component: AddPost },
    ],
  },
]);

export default router;
