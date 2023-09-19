import links from '../utils/links';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { MdDashboard } from "react-icons/md";

const NavLinks = ({ toggleSidebar }) => {
  const user=JSON.parse((localStorage.getItem("user")))
  console.log(user.role+' nav')
  let adminroles = ["Site Admin", "District Admin", "County Admin", "State Admin", "Stanford Staff"];
  let adminbool=false
  let links=[]
  adminroles.map((role=>{
    if (role==user?.["role"]){
      adminbool=true
    }
  }))



  if (adminbool===true && !user?.adminTeacher){
    links.push({ id: 2, text: "metrics", path: "metrics", icon: <ImStatsBars /> })
    links.push ({ id: 4, text: "profile", path: "profile", icon: <FaUser /> })
    
  }
  else{
    links = [
      { id: 1, text: "home", path: "/", icon: <MdDashboard /> },
      { id: 2, text: "metrics", path: "metrics", icon: <ImStatsBars /> },
      { id: 4, text: "profile", path: "profile", icon: <FaUser /> },
    ];
  
  }

  if (user.role=="Stanford Staff"){
    links.push({ id: 3, text: "Location Requests", path: "/locationRequests", icon: <MdDashboard /> },)
  }

  return (
    <div className='nav-links'>
      {links.map((link) => {
        const { text, path, id, icon } = link;

        return (
          <NavLink
            to={path}
            key={id}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            end
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
