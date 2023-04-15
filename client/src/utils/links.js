import { FaUser } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { MdDashboard } from "react-icons/md";

const links = [
  { id: 1, text: "home", path: "/", icon: <MdDashboard /> },
  { id: 2, text: "stats", path: "stats", icon: <ImStatsBars /> },
  { id: 3, text: "profile", path: "profile", icon: <FaUser /> },
];

export default links;
