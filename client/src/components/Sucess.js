import { useAppContext } from "../context/appContext";
import StatItem from "./StatItem";
import { FaBug } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiCheckDouble } from "react-icons/bi";
import Wrapper from "../assets/wrappers/StatsContainer";

const Success = () => {
  

  return (
    <Wrapper>
      <h1>Sucessfully Filled out Forrm</h1>
    </Wrapper>
  );
};

export default Success;
