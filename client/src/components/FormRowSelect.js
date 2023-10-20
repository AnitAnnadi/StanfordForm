import {useTranslation} from "react-i18next";

const FormRowSelect = ({ labelText, name, value, handleChange, list }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {t(labelText, labelText)}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className='form-select'
      >
        {list.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default FormRowSelect
