import {useTranslation} from "react-i18next";

const FormRow = ({ type, name, value, handleChange, labelText }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {t((labelText || name), (labelText || name))}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className='form-input'
      />
    </div>
  )
}

export default FormRow
