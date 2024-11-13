import {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {useParams} from "react-router-dom"
import {apiBaseUrl} from "../utils/baseUrl"
import { useNavigate } from "react-router-dom"

const Event = () => {
  const params = useParams()
  const { handle } = params
  const token = useSelector(state => state.user.token)
  const loggedIn = useSelector(state => state.user.loggedIn)
  const [aboutInfo, setAboutInfo] = useState(null)
  const navigate = useNavigate()
  const userHandle = useSelector(state => state.user.handle)

  useEffect(() => {
    fetch(apiBaseUrl + '/events/' + handle, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setAboutInfo(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleClick = () => {
    fetch(apiBaseUrl + '/events/' + handle + '/registrations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        navigate('/users/' + userHandle, { replace: true })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="w-1/2 mx-auto mt-24">
      {aboutInfo && (
        <div>
          <h1>Name: {aboutInfo.name}</h1>
          <p>Description: {aboutInfo.description}</p>
          <p>Start: {aboutInfo.start}</p>
          <p>End: {aboutInfo.end}</p>
        </div>
      )}
      {loggedIn && <button className="border-2 p-4" onClick={handleClick}>Register</button>}
    </div>
  )
}

export default Event
