import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import {
  StatsContainer,
  Loading,
  ChartsContainer,
  Faq,
} from "../../components";

const Home = () => {
  const { user, showStats, isLoading, monthlyApplications } = useAppContext();


  if (isLoading) {
    return <Loading center />;
  }
  return (
    <>
      {user?.role === "Teacher" && <StatsContainer/>}
      <Faq />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};

export default Home;
