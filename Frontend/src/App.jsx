import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FooterComponent, HeaderComponent } from "./components/index";
import { Home, About, Project, SignIn, SignUp } from "./pages/index";

export default function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/project" element={<Project />}></Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}
