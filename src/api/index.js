import {Router} from 'express'

import alert from './alert'
// import notification from './notification'
// import update from './update'

const router = new Router()

router.use('/alert', alert)
// router.use('/notification', notification)
// router.use('/update', update)

export default router
