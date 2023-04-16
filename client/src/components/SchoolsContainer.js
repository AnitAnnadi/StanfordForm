import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Loading from './Loading';
import Job from './Job';
import Alert from './Alert';
import Wrapper from '../assets/wrappers/JobsContainer';
import PageBtnContainer from './PageBtnContainer';

const SchoolsContainer = () => {
  const {
    getResponseGroups,
    responseGroups,
    isLoading,
    page,
    totalResponseGroups,
    searchState,
    searchCounty,
    searchDistrict,
    searchCity,
    searchSchool,
    searchGrade,
    searchPeriod,
    searchBeforeAfter,
    numOfPages,
    showAlert,
  } = useAppContext();

  useEffect(() => {
    getResponseGroups();
    // eslint-disable-next-line
  }, [page, searchState, searchCounty, searchDistrict, searchCity, searchSchool, searchGrade, searchPeriod, searchBeforeAfter]);

  if (isLoading) {
    return <Loading center />;
  }

  if (responseGroups.length === 0) {
    return (
      <Wrapper>
        <h2>No Response Groups to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalResponseGroups} school{responseGroups.length > 1 && 's'} found
      </h5>
      <div className='jobs'>
        {responseGroups.map((ResponseGroup) => {
          return <Job key={ResponseGroup._id} {...ResponseGroup} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default SchoolsContainer;
