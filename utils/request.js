import axios from 'axios'
import https from 'https'

const baseURL = 'https://10.10.13.89:6443'
const service = axios.create({
  baseURL,
  timeout: 10000,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization': 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImhsbTB5V0JzTmhWMUtsalVqczRpdVRfUFVjYkRTYktHdHNfazZtOFg2X2cifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJjdXJsLXVzZXItdG9rZW4tdzU5aGYiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiY3VybC11c2VyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiZDRiNjM5ZGEtZDE1MS00NjFlLTk4N2MtZGNhMTM0ZGVkNzBjIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmN1cmwtdXNlciJ9.gXf4xGNKOTZ3auNwDWJodTMeSrLpT2w1KVKx1fgRRlUPCaCZUwqmVKkySXGj6O-skLdOM-z4VRJ3ORS1B-ODHLBpfHgEEc7VlzTTuhwnmKWfW7wZQk8IDHkc4trIRLgjqu7vHXFSCqD_QszyZiBuyuk2kXp7wyoNRk1nHFh5V8AVSJ5OxdJQZblylCqpTED7IkkEmxsMEdKo1atrkEiy8vUxG2NHmlY2e1TmXXo7r8lldroiShqDoHEdH12mlxL5FzDCahXe3DMtV915C4Q9AqjxGIUaeHRxRZAL04pjjhmVvLDc_GAQg2AxdyCdYyo26o8JQw8VqIUT1ApcCh3klA'
  }
})

service.interceptors.request.use(config => {
  // console.log(`output->config`,config)
  return config
}, err => {
  Promise.reject(err)
})

export default service