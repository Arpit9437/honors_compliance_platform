import { useEffect, useState } from 'react'
import PostCard from './PostCard'

const DashBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchBookmarks = async ()=>{
      try {
        const res = await fetch('/api/user/bookmarks', { credentials: 'include' })
        const data = await res.json()
        if(res.ok){
          setBookmarks(data.bookmarks || [])
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false)
      }
    }
    fetchBookmarks()
  },[])

  if(loading) return <div className='p-4'>Loading bookmarks...</div>

  return (
    <div className='p-4 w-full'>
      <h2 className='text-xl mb-4'>Your Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <div>No bookmarks yet.</div>
      ) : (
        <div className='flex flex-wrap gap-5'>
          {bookmarks.map((post)=> (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DashBookmarks
