import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

const MOCK_BLOGS = [
  {
    id: 'blog_0',
    title: 'The Science Behind Niacinamide and Alpha Arbutin',
    slug: 'science-behind-niacinamide-and-alpha-arbutin',
    excerpt: 'Discover why combining Vitamin B3 (Niacinamide) and Alpha Arbutin is the gold standard for clinical skin brightening and hyperpigmentation control.',
    content: '<h3>Understanding Skin Brightening</h3><p>Uneven skin tone and hyperpigmentation are common skin concerns caused by sun exposure, aging, and inflammation. To combat these issues, skincare scientists look at the melanin pathway. Melanin is the pigment that gives skin its color, and its overproduction leads to dark spots.</p><h3>How Alpha Arbutin Works</h3><p>Alpha Arbutin is a natural skin brightener derived from the bearberry plant. It works by inhibiting <em>tyrosinase</em>, the primary enzyme responsible for melanin production. Unlike hydroquinone, Alpha Arbutin releases its active components slowly, making it extremely gentle and safe for long-term use without risk of cell damage.</p><h3>The Role of Niacinamide</h3><p>Niacinamide (Vitamin B3) tackles hyperpigmentation from a different angle. It does not stop melanin production; instead, it prevents the melanosomes (pigment packets) from transferring into the surrounding skin cells (keratinocytes). Furthermore, Niacinamide stimulates ceramides, bolstering the skin barrier.</p><h3>Why They Work Best Together</h3><p>By pairing Alpha Arbutin (which blocks pigment creation) with Niacinamide (which blocks pigment distribution), you create a multi-level defense system. Clinical tests show that using both active ingredients simultaneously results in significantly faster pigment fading and overall brightening than using either alone.</p>',
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
    content: '<p>Fading dark spots requires consistency, patience, and the right sequence of active ingredients. A proper skincare routine is structured to maximize product absorption and protect newly brightened skin from UV rays.</p><h3>Step 1: Cleanse</h3><p>Start with a mild, pH-balanced cleanser to remove dirt and prep the skin barrier without drying it out.</p><h3>Step 2: Hydrate with Serum</h3><p>Apply a lightweight hydrating serum containing Hyaluronic Acid. Serum molecules are small and deliver deep hydration, plumping the skin cells.</p><h3>Step 3: Target and Brighten</h3><p>Apply your target treatment, like the Cosmalac Glow Cream. The Niacinamide and Alpha Arbutin will work in tandem to prevent dark spots from appearing.</p><h3>Step 4: Protect (Crucial Step!)</h3><p>UV radiation triggers melanin production immediately. If you do not apply a broad-spectrum SPF 30+ daily, any brightening treatments will be ineffective. Protection is key to maintaining your glow.</p>',
    author: 'Cosmalac Skincare Team',
    bannerImage: '/images/luxury_skincare_hero.png',
    tags: ['Routine', 'Safety', 'SPF'],
    publishedAt: new Date().toISOString()
  }
];

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch blog from API
  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/blogs/${slug}`);
      return response.data;
    },
    retry: false,
    initialData: MOCK_BLOGS.find((b) => b.slug === slug)
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-rose-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-body">
        <h2 className="text-2xl font-bold font-heading text-text-primary">Article Not Found</h2>
        <p className="text-sm text-text-secondary">The scientific publication you requested is unavailable.</p>
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-rose-gold font-semibold uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to Publications
        </Link>
      </div>
    );
  }

  // Breadcrumb JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': window.location.origin
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Science Blog',
        'item': `${window.location.origin}/blog`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': blog.title,
        'item': window.location.href
      }
    ]
  };

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt}
        schema={breadcrumbSchema}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-body text-left">
        {/* Breadcrumbs visually */}
        <nav className="flex items-center space-x-1.5 text-xs text-text-secondary mb-6 font-medium">
          <Link to="/" className="hover:text-rose-gold">Home</Link>
          <ChevronRight size={12} />
          <Link to="/blog" className="hover:text-rose-gold">Science Blog</Link>
          <ChevronRight size={12} />
          <span className="text-text-primary truncate max-w-[200px]">{blog.title}</span>
        </nav>

        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-rose-gold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Publications
        </Link>

        {/* Article Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {blog.tags?.map((tag: string) => (
              <span key={tag} className="px-2.5 py-0.5 bg-brand-primary/10 border border-border-pink/40 text-[10px] uppercase font-bold text-rose-gold rounded">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text-primary leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-text-secondary pt-2 border-b border-border-pink/40 pb-4">
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-rose-gold" /> {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-rose-gold" /> {new Date(blog.publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-rose-gold" /> 5 min read
            </span>
          </div>
        </div>

        {/* Banner Image */}
        <div className="aspect-video w-full rounded-3xl bg-bg-secondary border border-border-pink overflow-hidden shadow-sm flex items-center justify-center">
          <img
            src={blog.bannerImage || '/images/blog-placeholder.jpg'}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* HTML Rich Text Content */}
        <div
          className="prose prose-pink max-w-none text-sm text-text-secondary leading-relaxed space-y-4
            prose-headings:text-text-primary prose-headings:font-bold prose-headings:font-heading
            prose-h3:text-lg prose-h3:pt-4 prose-p:leading-relaxed prose-strong:text-text-primary"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </>
  );
};

export default BlogPost;
