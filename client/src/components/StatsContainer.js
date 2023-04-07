import { useAppContext } from "../context/appContext";
import StatItem from "./StatItem";
import { FaBug } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiCheckDouble } from "react-icons/bi";
import Wrapper from "../assets/wrappers/StatsContainer";
import { useEffect } from "react";


const StatsContainer = () => {
  const { stats, user, showAlert, displayAlert, updateLocation, isLoading, getTotal,totalResponses } =
    useAppContext();
  useEffect(() => {
    getTotal(user)
    if (user){
    const interval = setInterval(() => {
      console.log('hi')
      getTotal(user);
    }, 10000);}
   
  },[] );
  let total=''
  if (totalResponses){
    total=(totalResponses["total"])
  }
  
  const defaultStats = [
    {
      title: "Class Code",
      count: user.code,
      icon: <BsFillPeopleFill />,
      color: "#e9b949",
      bcg: "#fcefc7",
    },
    {
      title: "Total Responses",
      count: total ,
      icon: <BiCheckDouble />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "hello",
      count: stats.declined || 0,
      icon: <FaBug />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
