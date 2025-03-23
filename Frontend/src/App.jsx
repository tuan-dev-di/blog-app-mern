import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  FooterComponent,
  HeaderComponent,
  PrivateRoute,
  AdminPrivateRoute,
} from "./components/_index";
import {
  Home,
  About,
  Project,
  SignIn,
  SignUp,
  Dashboard,
  CreatePost,
  UpdatePost,
  Post,
  User,
} from "./pages/_index";

export default function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <Routes>
        {/* ---------------| COMMON |--------------- */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/project" element={<Project />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>

        {/* ---------------| DASHBOARD |--------------- */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>

        <Route element={<AdminPrivateRoute allowedRoles={["admin"]} />}>
          {/* ---------------| POSTS |--------------- */}
          <Route path="/posts/get-posts" element={<Post />}></Route>
          <Route path="/posts/create-post" element={<CreatePost />}></Route>
          <Route
            path="/posts/update-posts/:postId"
            element={<UpdatePost />}
          ></Route>

          {/* ---------------| USERS |--------------- */}
          <Route path="/users/get-users" element={<User />}></Route>
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}
