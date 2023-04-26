import { FaUser } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { MdDashboard } from "react-icons/md";

const user=JSON.parse((localStorage.getItem("user")))
let adminroles = ["Site Admin", "District Admin", "County Admin", "State Admin", "Standford Staff"];
let adminbool=false
let links=[]
adminroles.map((role=>{
  if (role==user?.["role"]){
    adminbool=true
  }
}))

if (adminbool===true){
  links = [
    // { id: 1, text: "home", path: "/", icon: <MdDashboard /> },
    { id: 2, text: "metrics", path: "metrics", icon: <ImStatsBars /> },
    { id: 3, text: "profile", path: "profile", icon: <FaUser /> },
  ];
}
else{
  links = [
    { id: 1, text: "home", path: "/", icon: <MdDashboard /> },
    { id: 2, text: "metrics", path: "metrics", icon: <ImStatsBars /> },
    { id: 3, text: "profile", path: "profile", icon: <FaUser /> },
  ];
}

console.log(adminbool)

export default links;
