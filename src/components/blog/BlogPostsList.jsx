import { Fragment } from 'react'
import { BlogPostCard } from './BlogPostCard'
import RevealOnScroll from '../decoratives/RevealOnScroll'

export function BlogPostsList({ blogPosts }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {blogPosts?.map((post, index) => (
        <RevealOnScroll key={post._id || index}>
          <BlogPostCard post={post} />
        </RevealOnScroll>
      ))}
    </div>
  )
}
