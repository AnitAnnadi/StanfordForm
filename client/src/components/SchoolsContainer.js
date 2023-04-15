import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Loading from './Loading';
import Job from './Job';
import Alert from './Alert';
import Wrapper from '../assets/wrappers/JobsContainer';
import PageBtnContainer from './PageBtnContainer';

const SchoolsContainer = () => {
  const {
    getSchools,
    schools,
    isLoading,
    page,
    totalSchools,
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
    getSchools();
    // eslint-disable-next-line
  }, [page, searchState, searchCounty, searchDistrict, searchCity, searchSchool, searchGrade, searchPeriod, searchBeforeAfter]);

  if (isLoading) {
    return <Loading center />;
  }

  if (schools.length === 0) {
    return (
      <Wrapper>
        <h2>No schools to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalSchools} school{schools.length > 1 && 's'} found
      </h5>
      <div className='jobs'>
        {schools.map((school) => {
          return <Job key={school._id} {...school} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default SchoolsContainer;
