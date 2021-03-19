import React from 'react'

const Header = ({ courseName }) => (
    <h2>
        {courseName}
    </h2>
)

const Part = ({ part }) => (
    <p>
        {part.name} {part.exercises}
    </p>
)

const Content = ({ parts }) => (
    <div>
        {parts.map(part =>
            <Part part={part} key={part.id} />
        )}
    </div>
)

const Total = ({ parts }) => (
    <p><strong>
        Number of exercises {
            parts.reduce((acc, val) => acc + val.exercises, 0)
        }
    </strong></p>
)

const Course = ({ course }) => (
    <div>
        <Header courseName={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

export default Course