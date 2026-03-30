import { Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserById } from "../../api/useAuth";


export function BlogPostCard({ post }) {
    const [author, setAuthor] = useState({});
    useEffect(() => {
        const getArtist = async () => {
            const data = await getUserById(post?.authorId);
            if (data?.id) {
                setAuthor(prev => ({ ...prev, ...data }));
            }
        };
        getArtist();
    }, [post?.authorId]);

    return (
      <div className="group relative overflow-hidden rounded-[4px] bg-kcb-ardoise border border-white/[0.06] shadow-md hover:shadow-lg transition">
        <Link to={`/blog/${post?._id}`} className="block">
          <div className="overflow-hidden rounded-t-[4px]">
            <img
              src={post?.image}
              alt={post?.title}
              className="w-full h-40 object-cover rounded-t-[4px] transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-2 text-xs text-kcb-pierre mb-1">
              <Calendar className="w-4 h-4" />
              {new Date(post?.publishDate).toLocaleDateString()}
            </div>
            <h4 className="font-serif font-semibold text-base text-white mb-1 truncate">{post?.title}</h4>
            <p className="text-xs text-kcb-sable mt-1 line-clamp-3">{post?.excerpt}</p>
            {author?._id && (
              <div className="flex items-center gap-2 text-xs text-kcb-pierre mt-2">
                <User className="w-4 h-4" />
                {author?.name || author?.username}
              </div>
            )}
            {post?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="rounded-full text-xs border border-white/[0.06] px-2 py-0.5 text-kcb-pierre bg-kcb-noir/60">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </div>
    );
}
