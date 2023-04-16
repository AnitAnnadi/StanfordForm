import moment from 'moment'
import { FaChalkboardTeacher} from 'react-icons/fa'
import { TbListNumbers, TbNumbers } from 'react-icons/tb'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { AiOutlineForm, AiOutlineNumber } from 'react-icons/ai'
import {json, Link} from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'

const ResponseGroup = ({
  school,
  teacherName,
  uniqueResponseType,
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
          <JobInfo icon={<AiOutlineNumber />} text={uniqueResponseType.formCode} />
          <JobInfo icon={<TbListNumbers />} text=
          {uniqueResponseType?.period ? 'Period ' + uniqueResponseType.period:
            'No specified period'}
          />
          <JobInfo icon={<TbNumbers />} text={'Grade ' + uniqueResponseType.grade} />
          <JobInfo icon={<AiOutlineForm />} text={uniqueResponseType.formType} />
          <JobInfo icon={<FaRegCalendarAlt />} text={uniqueResponseType.When} />
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
