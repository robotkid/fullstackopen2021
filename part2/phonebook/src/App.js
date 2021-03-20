import React, { useState, useEffect } from 'react'
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom'
import personService from './services/persons'

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

const PersonList = ({ persons, deleteHandler }) => (
  persons.map(person =>
    <p key={person.name}>
      {person.name} {person.number}
      <button onClick={(e) => deleteHandler(person)}>Delete</button>
    </p>)
)

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '040-1234567'
    }
  ])

  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewPerson({ ...newPerson, name: event.target.value })
  }

  const handleNumberChange = (event) => {
    setNewPerson({ ...newPerson, number: event.target.value })
  }

  const handleSearchChange = (event => {
    setSearchTerm(event.target.value)
  })

  const updatePerson = () => {
    const existingIndex = persons.findIndex(p => p.name === newPerson.name)
    const person = persons[existingIndex]
    if (window.confirm(`Replace number for ${person.name}?`)) {
      personService
        .update(person.id, newPerson)
        .then(updatedPerson => {
          const newPersons = [...persons]
          newPersons[existingIndex] = updatedPerson
          setPersons(newPersons)
          setNewPerson({ name: '', number: '' })
          setSuccessMessage(`Number changed for ${updatedPerson.name}`)
          window.setTimeout(setSuccessMessage, 3000, null)
        })
        .catch(error => {
          setErrorMessage(`${newPerson.name} was already deleted from the server`)
          setPersons(persons.filter(p => p.name !== newPerson.name))
          setNewPerson({ name: '', number: '' })
          window.setTimeout(setErrorMessage, 3000, null)
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(p => p.name === newPerson.name)) {
      updatePerson()
    }
    else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewPerson({ name: '', number: '' })
          setSuccessMessage(`${returnedPerson.name} successfully added`)
          window.setTimeout(setSuccessMessage, 3000, null)
        })
    }
  }

  const peopleToShow = persons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleteItem(person.id)
        .then(() => {
          const newPersons = [...persons]
          const index = newPersons.indexOf(person)
          newPersons.splice(index, 1)
          setPersons(newPersons)
        })
    }
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage !== null &&
        <Notification message={successMessage} className="success" />
      }
      {errorMessage !== null &&
        <Notification message={errorMessage} className="error" />
      }
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
      <PersonList persons={peopleToShow} deleteHandler={deletePerson} />
    </div >
  )
}

export default App