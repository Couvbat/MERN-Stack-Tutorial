import { useState, useEffect } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

// components
import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const [ csrfToken, setCsrfToken ] = useState("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try{
        const response = await fetch("/api/csrf-token", {
          credentials: "same-origin"
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        console.log('CSRF token:', data.csrfToken);
      } catch (err) {
        console.error('Failed to catch CSRF Token', err)
      }
    };

    fetchCsrfToken(); //call the fetch function

    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts')
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    fetchWorkouts()
  }, [dispatch])

  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} csrf={csrfToken}/>
        ))}
      </div>
      <WorkoutForm csrf={csrfToken}/>
    </div>
  )
}

export default Home