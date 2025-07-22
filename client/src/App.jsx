import { Route, Routes, useLocation } from "react-router-dom";
import { NavProvider } from "./NavContext";
import { UserProvider } from "./LoginContext";
import Navbar from "./components/Navbar";
import AddHome from "./components/AddHome";
import MyHomes from "./pages/MyHomes";
import HomeDetails from "./pages/HomeDetails";
import Checkout from "./pages/Checkout";
import CheckoutButton from "./components/CheckoutButton";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Profile from "./pages/Profile";
import HomeUserDetails from "./pages/HomeUserDetails";
import Experiences from "./pages/Experiences";
import Services from "./pages/Services";
import HomePage from "./pages/HomePage";
import AddExperience from "./pages/AddExperience";
import AddService from "./pages/AddService";
import ExperiencesDetails from "./pages/ExperiencesDetails";
import MyExperiences from "./pages/MyExperiences";
import ExperienceUserDetails from "./pages/ExperienceUserDetails";
import ServiceDetails from "./pages/ServiceDetails";
import MyServices from "./pages/MyServices";
import ServiceUserDetails from "./pages/ServiceUserDetails";
import SuccessExperience from "./pages/successexperience";
import SuccessService from "./pages/SuccessService";
import Upcoming from "./pages/Upcoming";

export default function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/addexperience", "/addservice"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <UserProvider>
      <NavProvider>
        {!shouldHideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addhome" element={<AddHome />} />
          <Route path="/addexperience" element={<AddExperience />} />
          <Route path="/addservice" element={<AddService />} />
          <Route path="/myhomes" element={<MyHomes />} />
          <Route path="myexperiences" element={<MyExperiences/>}/>
          <Route path="/myservices" element={<MyServices/>}/>
          <Route path="/home/:id" element={<HomeDetails />} />
          <Route path="/experiences/:id" element={<ExperiencesDetails/>} />
          <Route path="/services/:id" element={<ServiceDetails/>} />
          <Route path="/home/user/:id" element={<HomeUserDetails />} />
          <Route path="/experience/user/:id" element={<ExperienceUserDetails/>}/>
          <Route path="/service/user/:id" element={<ServiceUserDetails/>}/>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/stripe" element={<CheckoutButton />} />
          <Route path="/success" element={<Success />} />
          <Route path="/successexperience" element={<SuccessExperience/>}/>
          <Route path="/successservice" element={<SuccessService/>}/>
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/services" element={<Services />} />
          <Route path="/upcoming" element={<Upcoming/>}/>
        </Routes>
      </NavProvider>
    </UserProvider>
  );
}
