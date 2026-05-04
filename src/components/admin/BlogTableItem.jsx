import { BlogItemActions } from './BlogItemActions'

export function BlogTableItem({ post }) {
  return (
    <>
      <tr>
        <td>
          <img
            loading="lazy"
            src={post?.image}
            alt={post?.excerpt}
            className="object-cover max-w-15 min-h-15 mx-auto transition duration-300 rounded-lg shadow-md hover:scale-110 transform hover:-translate-y-2"
          />
        </td>
        <td>{post?.title}</td>
        <td>{post?.excerpt}</td>
        <td>{new Date(post?.publishDate).toLocaleDateString()}</td>
        <td>{post?.visited || 0}</td>
        <td>
          {post?.status === 'published' && (
            <span className="text-green-600 font-semibold">Publié</span>
          )}
          {post?.status === 'archived' && (
            <span className="text-amber-600 font-semibold">Archivé</span>
          )}
        </td>
        <td>
          <BlogItemActions post={post} />
        </td>
      </tr>
    </>
  )
}
