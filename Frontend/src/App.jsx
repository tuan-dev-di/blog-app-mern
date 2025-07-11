import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  FooterComponent,
  HeaderComponent,
  PrivateRoute,
  AdminPrivateRoute,
  ScrollToTop,
} from "./components/_index";
import {
  Home,
  About,
  Project,
  SignIn,
  SignUp,
  Overview,
  ComingSoon,
  Search,
  Profile,
  CreatePost,
  UpdatePost,
  DetailPost,
  Post,
  User,
  Comment,
} from "./pages/_index";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <HeaderComponent />
      <Routes>
        {/* ---------------| COMMON |--------------- */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/project" element={<Project />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/coming-soon" element={<ComingSoon />}></Route>
        <Route
          path="/posts/get-posts/detail/:postSlug"
          element={<DetailPost />}
        ></Route>

        {/* ---------------| Profile |--------------- */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/comments/get-comments" element={<Comment />}></Route>
        </Route>

        <Route element={<AdminPrivateRoute allowedRoles={["admin"]} />}>
          {/* ---------------| OVERVIEW |--------------- */}
          <Route path="/overview" element={<Overview />}></Route>

          {/* ---------------| POSTS |--------------- */}
          <Route path="/posts/get-posts" element={<Post />}></Route>
          <Route path="/posts/create" element={<CreatePost />}></Route>
          <Route path="/posts/update/:postId" element={<UpdatePost />}></Route>

          {/* ---------------| USERS |--------------- */}
          <Route path="/users/get-users" element={<User />}></Route>
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}
