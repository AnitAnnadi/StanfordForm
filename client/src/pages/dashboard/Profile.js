import { useState } from 'react'
import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { v4 as uuid } from 'uuid';

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext()

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [role, setRole] = useState(user?.role)
  const [state, setState] = useState(user?.state)
  const [city, setCity] = useState(user?.city)
  const [school, setSchool] = useState(user?.school)
  let states = ["CA","FL","AL","MO"]
  let cities = ["San Francisco","Dublin","Los Angeles","Miami"]
  let schools = ["Dublin High School","SF High","Los Angeles Prep","Miami Middle School"]
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !role || !state || !city || !school) {
      displayAlert()
      return
    }
    updateUser({ name, email, role, state, city, school })
  }

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type='text'
            name='name'
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type='email'
            name='email'
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <div className="form-row">
          <label htmlFor="stateSelect" className="form-label">
                State
              </label>
           <select name="stateSelect"
                value={state}
                onChange={(e) => setState(e.target.value)}
                defaultValue
                className="form-select">
              {states.map((state,index) => {
                    return (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    );
                  })}
          </select>
          </div>
          {/* <h3>City</h3> */}
          <div className="form-row">
          <label htmlFor="citySelect" className="form-label">
                City
              </label>
           <select name="citySelect"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-select">
            {cities.map((city,index) => {
                  return (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  );
                })}</select>
            </div>
          <div className="form-row">
          <label htmlFor="schoolSelect" className="form-label">
                School
              </label>
            <select name="schoolSelect"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="form-select">
        
                {schools.map((school,index) => {
                          return (
                            <option key={index} value={school}>
                              {school}
                            </option>
                          );
                        })}
            </select> 
            </div>
          <button className='btn btn-block' type='submit' disabled={isLoading}>
            {isLoading ? 'Please Wait...' : 'save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile
