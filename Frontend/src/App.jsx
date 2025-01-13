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
  Post,
} from "./pages/_index";

export default function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/project" element={<Project />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
        <Route element={<AdminPrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/posts" element={<Post />}></Route>
          <Route path="/posts/create-post" element={<CreatePost />}></Route>
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}
