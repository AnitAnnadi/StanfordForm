import moment from 'moment'
import { FaChalkboardTeacher} from 'react-icons/fa'
import { TbListNumbers, TbNumbers } from 'react-icons/tb'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { AiOutlineForm, AiOutlineNumber } from 'react-icons/ai'
import {json, Link} from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/ResponseGroup'
import ResponseGroupInfo from './ResponseGroupInfo'

const ResponseGroup = ({
  school,
  teacherName,
  uniqueResponseType,
  numberOfResponses,
}) => {

  const formCode = uniqueResponseType.formCode

  const queryParams = new URLSearchParams({
    noCode: uniqueResponseType?.noCode ? 'true' : 'false',
    teacherId: school.teacher,
    schoolId: school?._id,
    period: uniqueResponseType.period,
    grade: uniqueResponseType.grade,
    formType: uniqueResponseType.formType,
    when: uniqueResponseType.when,
    school: school.school,
    state: school.state,
    city: school.city,
    county: school.county,
    district: school.district,
  });

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
          <ResponseGroupInfo icon={<FaChalkboardTeacher />} text={teacherName} />
          <ResponseGroupInfo icon={<AiOutlineNumber />} text={`${numberOfResponses} response(s)`} />
          <ResponseGroupInfo icon={<TbListNumbers />} text=
          {uniqueResponseType?.period ? 'Period ' + uniqueResponseType.period:
            'No specified period'}
          />
          <ResponseGroupInfo icon={<TbNumbers />} text={'Grade ' + uniqueResponseType.grade} />
          <ResponseGroupInfo icon={<AiOutlineForm />} text={uniqueResponseType.formType} />
          <ResponseGroupInfo icon={<FaRegCalendarAlt />} text={uniqueResponseType.when} />
        </div>
        <footer>
          <div className='actions'>
            <Link className='btn edit-btn' to={`/api/v1/form/${formCode}?${queryParams.toString()}`}>
              View Breakdown
            </Link>
          </div>
        </footer>
      </div>
    </Wrapper>
  )
}

export default ResponseGroup
