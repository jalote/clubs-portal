import { useState, useEffect } from "react"
import { apiBaseUrl } from "../utils/baseUrl"
import { Link } from "react-router-dom"
import ClubForm from "../components/ClubForm"
import { useNavigate } from "react-router-dom"
import {useSelector} from "react-redux"

const Clubs = () => {
  const [clubs, setClubs] = useState([])
  const [form, setForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const handle = useSelector(state => state.user.handle)
  const loggedIn = useSelector(state => state.user.loggedIn)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(apiBaseUrl + '/clubs')
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setClubs(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (success) {
      return navigate(`/users/${handle}`, { replace: true })
    }
  }, [success])

  return (
    <>
      <div className="w-full flex justify-center my-4 space-x-4">
        <h1 className="font-bold text-2xl">Student Clubs at IIIT Delhi</h1>
        {loggedIn && <button className="p-2 font-bold text-white bg-blue-600 rounded-md cursor-pointer" onClick={() => setForm(!form)}>Propose a new club</button>}
      </div>
    <div className="w-full">
      {form && <ClubForm setForm={setForm} clubHandle={handle} setSuccess={setSuccess}/>}
    </div>
    <div class="mx-auto max-w-xs relative flex py-5 items-center">
        <div class="flex-grow border-t border-gray-300"></div>
    </div>
    <div className="mt-10 mx-auto flex flex-col items-center">
      {clubs.map(club => (
        <div className="flex flex-col align-center m-4 p-6 rounded-xl shadow-md hover:shadow-lg duration-200 focus:shadow-xs border-2">
          <Link to={`/clubs/${club.handle}`} className="font-bold">{club.name}</Link>
          <p>{club.description}</p>
        </div>
      ))}

    </div>
    </>
  )
}

export default Clubs
