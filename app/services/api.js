// import wsRequest from '../helpers/ws-request'
import axios from 'axios'

export async function login (password) {
  return new Promise((resolve, reject) => {
    axios.post(`http://127.0.0.1:5000/login`, {
      password
    }, { withCredentials: true }).then((res) => {
      return resolve(true)
    }).catch((err) => {
      if (err.response) return resolve(false)
      else return reject(err)
    })
  })
}

export async function logout () {
  return new Promise((resolve, reject) => {
    axios.post(`http://127.0.0.1:5000/logout`, null, { withCredentials: true }).then((res) => {
      return resolve(true)
    }).catch((err) => {
      if (err.response) return resolve(false)
      else return reject(err)
    })
  })
}
