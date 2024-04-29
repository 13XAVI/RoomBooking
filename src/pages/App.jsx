import {
  BookInputs,
  RoomInputs,
  UserInputs,
} from "../componets/DashboardComponents/components/FormSource";
import AddAuthority from "../componets/DashboardComponents/components/authority/AddAuthority";
import Role from "../componets/DashboardComponents/components/authority/Role";
import Landing from "../componets/DashboardComponents/home/Landing";
import AllList from "../componets/DashboardComponents/list/List";
import New from "../componets/DashboardComponents/new/New";
import NotFound from "../componets/ErrorPages/NotFound";
import Card from "../componets/cards/Card";
import RoomContainer from "../componets/cards/RoomAvailable";
import Home from "../componets/home/Home";
import Signin from "../componets/signupFiles/Signin";
import Signup from "../componets/signupFiles/signup";
import AdminRoute from "./AdminRoute";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import Setting from "../componets/DashboardComponents/single/settings";
import Table from "../componets/DashboardComponents/components/table/Table";
import RenderUsers from "../componets/DashboardComponents/components/table/RenderUsersList";
import { ContactPage } from "@mui/icons-material";
import ContactP from "../componets/signupFiles/ContactP";
import AddRoomName from "../componets/DashboardComponents/new/AddRoomName";
import RenderRoom from "../componets/DashboardComponents/components/table/RenderRoom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="Login" element={<Signin />} />
          <Route
            path="RequestRom"
            element={
              <UserRoutes>
                <RoomContainer />
              </UserRoutes>
            }
          />
          <Route path="signupPage" element={<Signup />} />
          <Route path="Contacts" element={<ContactPage />} />
          <Route
            index
            path="Dashboard"
            element={
              <AdminRoute>
                <Landing />
              </AdminRoute>
            }
          />

          <Route path="Users/*">
            <Route
              element={
                <AdminRoute>
                  <Landing />
                </AdminRoute>
              }
            />
            <Route
              path="ListAllusers"
              element={
                <AdminRoute>
                  <RenderUsers title="ListAllusers" />
                </AdminRoute>
              }
            />
            <Route path=":userId" element={<Setting />} />
            <Route
              path="new-user"
              element={
                <AdminRoute>
                  <Signup inputs={UserInputs} title="Add New user" />
                </AdminRoute>
              }
            />
          </Route>

          <Route path="Bookings/*">
            <Route
              element={
                <AdminRoute>
                  <Table title="Bookings Rooms" />
                </AdminRoute>
              }
            />
            <Route
              path="new-bookings"
              element={<Table inputs={BookInputs} title="Booking Rooms" />}
            />
          </Route>

          <Route path="Rooms/*">
            <Route
              path="List-Availble-Rooms"
              element={
                <AdminRoute>
                  <RenderRoom title="Available Some Rooms" />
                </AdminRoute>
              }
            />
            <Route
              path="List-Booked-Rooms"
              element={
                <AdminRoute>
                  <RenderRoom title="Booked  Rooms" />
                </AdminRoute>
              }
            />

            <Route
              path="new-rooms"
              element={<New inputs={RoomInputs} title="Add Some Rooms Here" />}
            />
            <Route
              path="addNewRoom"
              element={
                <AddRoomName inputs={RoomInputs} title="Add room Name" />
              }
            />
            {/* <New path="AddName-toRoomm" title="new Room Name"/> */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/ContactsPage" element={<ContactP />} />
      </Routes>
    </div>
  );
}

export default App;
