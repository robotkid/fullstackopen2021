import React, { useState, useEffect } from 'react'
import axios from 'axios'


const SearchFilter = ({ searchTerm, callback }) => (
  <div>
    filter shown with <input
      value={searchTerm}
      onChange={callback}
    />
  </div>
)

const PersonForm = ({ newPerson, onNameChange, onNumberChange, onFormSubmit }) => {
  return (
    <form onSubmit={onFormSubmit}>
      <div>
        name: <input
          value={newPerson.name}
          onChange={onNameChange}
        />
      </div>
      <div>
        number: <input
          value={newPerson.number}
          onChange={onNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonList = ({ persons }) => (
  persons.map(person =>
    <p key={person.name}>
      {person.name} {person.number}
    </p>)
)

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '040-1234567'
    }
  ])

  const [newPerson, setNewPerson] = useState({ name: '', number: '' })

  const [searchTerm, setSearchTerm] = useState('')

  const handleNameChange = (event) => {
    setNewPerson({ ...newPerson, name: event.target.value })
  }

  const handleNumberChange = (event) => {
    setNewPerson({ ...newPerson, number: event.target.value })
  }

  const handleSearchChange = (event => {
    setSearchTerm(event.target.value)
  })

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(p => p.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat(newPerson))
      setNewPerson({ name: '', number: '' })
    }
  }

  const peopleToShow = persons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )


  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter
        searchTerm={searchTerm}
        callback={handleSearchChange}
      />
      <PersonForm
        newPerson={newPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onFormSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <PersonList persons={peopleToShow} />
    </div >
  )
}

export default App