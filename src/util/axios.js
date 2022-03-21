import axios from 'axios'

const BASE_URL = 'http://localhost:80'

const API = axios.create({ baseURL: BASE_URL });

export { BASE_URL, API }
