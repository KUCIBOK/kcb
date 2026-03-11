import { useEffect } from "react"
import { BlogPostsList } from "../components/blog/BlogPostsList"
import { useBlog } from "../store/BlogContext"
import RevealOnScroll from "../components/landing/RevealOnScroll"
import SectionLabel from "../components/landing/SectionLabel"

export default function Blog() {
    const { blogPosts } = useBlog();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-kcb-noir-deep pb-16">
            <section className="py-14">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <RevealOnScroll>
                        <SectionLabel text="Blog" />
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.1}>
                        <h1 className="font-playfair font-bold text-[clamp(28px,3.5vw,48px)] text-white mt-4 mb-3">Notre Blog</h1>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.2}>
                        <p className="text-kcb-pierre text-[15px] max-w-2xl mx-auto">
                            Aperçus, histoires et mises à jour du monde de l'art numérique africain
                        </p>
                    </RevealOnScroll>
                </div>
            </section>
            <div className="max-w-6xl mx-auto px-4">
                <RevealOnScroll delay={0.25}>
                    {blogPosts?.length >= 1 ? (
                        <BlogPostsList blogPosts={[...blogPosts].reverse()} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 border border-white/[0.06] border-dashed rounded-[4px] w-full bg-kcb-ardoise/30">
                            <h3 className="font-medium text-base text-kcb-pierre mb-1">Aucun article pour le moment.</h3>
                            <p className="text-xs text-kcb-pierre/60">Revenez bientôt pour découvrir nos dernières histoires.</p>
                        </div>
                    )}
                </RevealOnScroll>
            </div>
        </div>
    );
}
