import moment from 'moment'
import { FaChalkboardTeacher} from 'react-icons/fa'
import { TbListNumbers } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'

const ResponseGroup = ({
  school,
  teacherName,
  period,
  studentResponsesByPeriod,
}) => {
  const { setEditJob, deleteJob } = useAppContext()

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{school.school.charAt(0)}</div>
        <div className='info'>
          <h5>{school.school}</h5>
          <p>{school.city}, {school.state}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <JobInfo icon={<FaChalkboardTeacher />} text={teacherName} />
          <JobInfo icon={<TbListNumbers />} text={period ? 'Period ' + period: 'No specified period'} />
        </div>
        <footer>
          {/*<div className='actions'>*/}
          {/*  <Link*/}
          {/*    to='/add-job'*/}
          {/*    className='btn edit-btn'*/}
          {/*    onClick={() => setEditJob(_id)}*/}
          {/*  >*/}
          {/*    Edit*/}
          {/*  </Link>*/}
          {/*  <button*/}
          {/*    type='button'*/}
          {/*    className='btn delete-btn'*/}
          {/*    onClick={() => deleteJob(_id)}*/}
          {/*  >*/}
          {/*    Delete*/}
          {/*  </button>*/}
          {/*</div>*/}
        </footer>
      </div>
    </Wrapper>
  )
}

export default ResponseGroup
