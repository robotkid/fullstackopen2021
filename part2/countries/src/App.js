import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [city])

  return (
    <div>
      <h2>Weather</h2>
      { (weather !== null) &&
        <>
          <p><strong>temperature: </strong> {weather.main.temp} ℃</p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
          <p><strong>wind: </strong>{`${weather.wind.speed} ${weather.wind.deg}`}</p>
        </>
      }
    </div>
  )
}

const Country = ({ country }) => (
  <div>
    <h1>
      {country.name}
    </h1>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h2>languages</h2>
    <ul>
      {country.languages.map(lang => <li key={lang.iso639_1}>{lang.name}</li>)}
    </ul>
    <img src={country.flag} width="300" alt={`Flag of ${country.name}`} />
    <Weather city={country.capital} />
  </div>
)

const Countries = ({ countries, buttonCallback }) => {
  if (countries.length === 0) {
    return null
  }
  else if (countries.length === 1) {
    return <Country country={countries[0]} />
  }
  else if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  else {
    return countries.map(c =>
      <p key={c.name}>
        {c.name}
        <button onClick={(e) => buttonCallback(c.name)} >show</button>
      </p>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')

  const countriesToShow = countries.filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleSearchChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleShowButton = (country) => {
    setSearchText(country)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
        // console.log(response.data)
      })
  }, [])

  return (
    <div>
      <p>find countries <input value={searchText} onChange={handleSearchChange} /></p>
      <Countries countries={countriesToShow} buttonCallback={handleShowButton} />
    </div>
  );
}

export default App;
