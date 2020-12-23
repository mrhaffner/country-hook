import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const didMount = useRef(false);

  useEffect(() => {
 
    if (didMount.current) {
      axios
      .get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
      .then(response => {
        setCountry({...response.data[0], found: true})
      })
      .catch((err) => {
        setCountry({})
      })
    } else {
      didMount.current = true;
    }
  
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  if (country) {
    return (
      <div>
        <h3>{country.name} </h3>
        <div>capital {country.capital} </div>
        <div>population {country.population}</div> 
        <img src={country.flag} height='100' alt={`flag of ${country.name}`}/>  
      </div>
    )
  }



}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    if (country) {
      country.found = false
    }
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />

      <button onClick={()=>console.log(country)}>log</button>
    </div>
  )
}

export default App