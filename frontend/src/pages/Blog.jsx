import { useEffect } from "react"
import { BlogPostsList } from "../components/blog/BlogPostsList"
import { useBlog } from "../store/BlogContext"


export default function Blog() {
    const { blogPosts } = useBlog();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-background">
            <section className="py-8">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Notre Blog</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-base md:text-lg">
                        Aperçus, histoires et mises à jour du monde de l'art numérique africain
                    </p>
                </div>
            </section>
            <div className="max-w-6xl mx-auto px-4">
                {blogPosts?.length >= 1 ? (
                    <BlogPostsList blogPosts={[...blogPosts].reverse()} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 border border-gray-800 border-dashed rounded-xl w-full bg-background/60">
                        <h3 className="font-medium text-base text-gray-400 mb-1">Aucun article pour le moment.</h3>
                        <p className="text-xs text-gray-500">Revenez bientôt pour découvrir nos dernières histoires.</p>
                    </div>
                )}
            </div>
        </div>
    );
}