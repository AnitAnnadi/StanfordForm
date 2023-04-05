import { useState } from 'react'
import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { v4 as uuid } from 'uuid';
import {narrowCities, narrowSchools} from "../../utils/schoolDataFetch";

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext()

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [role, setRole] = useState(user?.role)
  const [state, setState] = useState(user?.state ?? "default")
  const [city, setCity] = useState(user?.city ?? "default")
  const [school, setSchool] = useState(user?.school ?? "default")

  const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California",
      "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida",
      "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
      "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
      "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
      "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
      "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  const [cities, setCities] = useState(state !== "default" ? narrowCities(state) : []);
  const [schools, setSchools] = useState(city !== "default" ? narrowSchools(state, city) : []);

  const handleChange = (field, value) => {
    if (field === 'state') {
      setState(value);
      setCity('default')
      setSchool('default')

      console.log(city, school)

      if (value !== 'default') {
        setCities(narrowCities(value));
      }
    } else if (field === 'city') {
      setCity(value);
      setSchool('default')

      if (value !== 'default') {
        setSchools(narrowSchools(state, value));
      }
    } else if (field === 'school') {
      setSchool(value);
    }
  };

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
                onChange={(e) => handleChange("state", e.target.value)}
                className="form-select">
               <option value={"default"}>
                    Choose your State
              </option>
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
                onChange={(e) => handleChange("city", e.target.value)}
                className="form-select">
               <option value={"default"}>
                   Choose your City
              </option>
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
                onChange={(e) => handleChange("school", e.target.value)}
                className="form-select">
                <option value={"default"}>
                    Choose your School
                </option>
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
