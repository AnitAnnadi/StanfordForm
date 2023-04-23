import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Loading from './Loading';
import ResponseGroup from './ResponseGroup';
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
    searchType,
    searchTeacher,
    numOfPages,
    showAlert,
  } = useAppContext();

  useEffect(() => {
    // use timeout to prevent multiple requests
    const timeout = setTimeout(() => {
      getResponseGroups();
    }, 500);

    return () => {
      clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [page, searchState, searchCounty, searchDistrict,
    searchCity, searchSchool, searchGrade, searchPeriod,
    searchBeforeAfter, searchType, searchTeacher]);

  if (isLoading) {
    return <Loading center />;
  }

  if (responseGroups.length === 0) {
    return (
      <Wrapper>
        <h2>No classes to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalResponseGroups} class{responseGroups.length > 1 && 'es'} found
      </h5>
      <div className='jobs'>
        {responseGroups.map((ResponseGroupItem, index) => {
          return <ResponseGroup key={index} {...ResponseGroupItem} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default SchoolsContainer;
