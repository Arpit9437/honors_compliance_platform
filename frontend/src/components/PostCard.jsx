import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'

const PostCard = ({post}) => {
  const { currentUser } = useSelector((state) => state.user)
  const [bookmarked, setBookmarked] = useState(false)

  const toggleBookmark = async (e) => {
    e.preventDefault()
    if (!currentUser) return window.location.href = '/sign-in'
    try {
      const res = await fetch(`/api/user/bookmark/${post._id}`, { method: 'POST', credentials: 'include' })
      if (res.ok) {
        setBookmarked((b) => !b)
      }
    } catch (err) {
      console.log(err.message)
    }
  }
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[360px] transition-all'>
        <Link to={`/post/${post.slug}`}>
            <div className='h-[260px] w-full bg-gray-200 group-hover:h-[200px] transition-all duration-300 z-20 flex items-center justify-center'>
              {/* images removed for posts; placeholder block */}
              <button onClick={toggleBookmark} className='absolute top-2 right-2 z-30 p-2 rounded-full bg-white/80 hover:bg-white'>
                {bookmarked ? <FaBookmark className='text-indigo-600' /> : <FaRegBookmark className='text-gray-600' />}
              </button>
            </div>
        </Link>
        <div className='p-3 flex flex-col gap-2'>
            <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
            <span className='italic text-sm'>{post.category}</span>
            <Link to={`/post/${post.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'>Read article</Link>
        </div>
    </div>
  )
}

export default PostCard