import express from 'express'
import { deleteUser, test, updateUser, signout, getUsers, getUser, toggleBookmark, getBookmarks } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)
router.get('/getusers', verifyToken, getUsers)
// Bookmarks routes before the catch-all route
router.get('/bookmarks', verifyToken, getBookmarks)
router.post('/bookmark/:postId', verifyToken, toggleBookmark)
// Catch-all route for user profiles should be last
router.get('/:userId', getUser)

export default router

