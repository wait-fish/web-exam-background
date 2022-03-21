const BACKSTAGE_TOKEN = 'WEB_EXAM_MANAGEMENT'

const getToken = () => JSON.parse(sessionStorage.getItem(BACKSTAGE_TOKEN))
const setToken = token => sessionStorage.setItem(BACKSTAGE_TOKEN, JSON.stringify(token))
const removeToken = () => sessionStorage.removeItem(BACKSTAGE_TOKEN)
const isAuth = () => !!getToken()

export { getToken, setToken, removeToken, isAuth }
