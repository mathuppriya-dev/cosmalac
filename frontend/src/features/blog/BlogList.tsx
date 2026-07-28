import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, Search, BookOpen } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

const MOCK_BLOGS = [
  {
    id: 'blog_0',
    title: 'The Science Behind Niacinamide and Alpha Arbutin',
    slug: 'science-behind-niacinamide-and-alpha-arbutin',
    excerpt: 'Discover why combining Vitamin B3 (Niacinamide) and Alpha Arbutin is the gold standard for clinical skin brightening and hyperpigmentation control.',
    author: 'Dr. Evelyn Carter, R&D Director',
    bannerImage: '/images/scientific_skincare_lab.png',
    tags: ['Science', 'Ingredients', 'Brightening'],
    publishedAt: new Date().toISOString()
  },
  {
    id: 'blog_1',
    title: 'Building a Skincare Routine for Hyperpigmentation',
    slug: 'building-skincare-routine-hyperpigmentation',
    excerpt: 'A dermatologist-approved step-by-step guide to layers, products, and SPF protection for fading dark marks.',
    author: 'Cosmalac Skincare Team',
    bannerImage: '/images/luxury_skincare_hero.png',
    tags: ['Routine', 'Safety', 'SPF'],
    publishedAt: new Date().toISOString()
  }
];

export const BlogList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Load articles via React Query
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs-list'],
    queryFn: async () => {
      const response = await axiosInstance.get('/blogs');
      return response.data;
    },
    retry: false,
    initialData: MOCK_BLOGS
  });

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(blogs.flatMap((b: any) => b.tags || [])))];

  const filteredBlogs = blogs.filter((blog: any) => {
    const matchTag = selectedTag === 'All' || (blog.tags || []).includes(selectedTag);
    const matchSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchSearch;
  });

  const featuredBlog = filteredBlogs.find((b: any) => b.isFeatured) || filteredBlogs[0];
  const standardBlogs = filteredBlogs.filter((b: any) => b.id !== featuredBlog?.id);

  return (
    <>
      <SEO
        title="Skincare Science & Guides"
        description="Read educational articles written by skin chemists and dermatologists at Cosmalac. Learn about skin whitening science, hyperpigmentation treatments, and active ingredient layers."
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-body">
        {/* Header */}
        <div class="text-center max-w-xl mx-auto space-y-3">
          <BookOpen class="text-rose-gold mx-auto" size={40} />
          <h1 class="text-4xl font-extrabold text-text-primary font-heading">Cosmalac Science Lab</h1>
          <p class="text-sm text-text-secondary leading-relaxed">
            Educational articles written by clinical researchers and dermatologists to demystify active skincare science.
          </p>
        </div>

        {/* Filters bar */}
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-border-pink p-5 rounded-2xl shadow-sm">
          <div class="relative flex-grow max-w-md">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search scientific articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              class="w-full pl-10 pr-4 py-2 bg-bg-primary/20 border border-border-pink/70 rounded-xl text-xs focus:outline-none focus:border-rose-gold placeholder:text-muted"
            />
          </div>

          <div class="flex flex-wrap gap-1.5 overflow-x-auto max-w-lg scrollbar-none">
            {allTags.map((tag: any) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                class={`px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  selectedTag === tag ? 'bg-rose-gold text-white' : 'bg-bg-primary/30 text-text-secondary hover:text-text-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div class="h-60 bg-white border border-border-pink animate-pulse rounded-3xl" />
        ) : filteredBlogs.length === 0 ? (
          <div class="text-center py-20 text-sm text-text-secondary">
            No scientific publications found matching your selection.
          </div>
        ) : (
          <div class="space-y-12">
            {/* Featured Post Card */}
            {featuredBlog && (
              <div class="bg-white border border-border-pink rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 group">
                <div class="lg:col-span-7 aspect-video lg:aspect-auto bg-bg-secondary flex items-center justify-center overflow-hidden">
                  <img
                    src={featuredBlog.bannerImage || '/images/blog-placeholder.jpg'}
                    alt={featuredBlog.title}
                    class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                  />
                </div>
                <div class="lg:col-span-5 p-6 md:p-8 flex flex-col justify-center text-left space-y-4">
                  <div class="flex items-center gap-3 text-xs text-text-secondary">
                    <span class="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(featuredBlog.publishedAt).toLocaleDateString()}
                    </span>
                    <span class="flex items-center gap-1">
                      <User size={12} /> {featuredBlog.author}
                    </span>
                  </div>
                  
                  <h2 class="text-2xl sm:text-3xl font-bold font-heading text-text-primary group-hover:text-rose-gold transition-colors duration-300">
                    <Link to={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                  </h2>
                  <p class="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>

                  <div class="pt-2">
                    <Link
                      to={`/blog/${featuredBlog.slug}`}
                      class="px-6 py-2.5 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors inline-block"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Posts Grid */}
            {standardBlogs.length > 0 && (
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {standardBlogs.map((blog: any) => (
                  <article key={blog.id || blog._id} class="bg-white border border-border-pink rounded-2xl overflow-hidden shadow-sm hover:shadow transition-all duration-300 flex flex-col text-left group">
                    <div class="aspect-video bg-bg-secondary overflow-hidden">
                      <img
                        src={blog.bannerImage || '/images/blog-placeholder.jpg'}
                        alt={blog.title}
                        class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
                      <div class="space-y-2">
                        <span class="text-[10px] text-rose-gold font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={10} /> {new Date(blog.publishedAt).toLocaleDateString()}
                        </span>
                        <h3 class="text-base font-bold font-heading text-text-primary group-hover:text-rose-gold transition-colors duration-300 line-clamp-2">
                          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h3>
                        <p class="text-xs text-text-secondary leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>
                      
                      <div class="pt-3 border-t border-border-pink/40 flex items-center justify-between mt-auto">
                        <span class="text-[10px] text-text-secondary">By {blog.author.split(',')[0]}</span>
                        <Link to={`/blog/${blog.slug}`} class="text-xs font-bold text-rose-gold hover:text-text-primary">
                          Read Info →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogList;
