import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, ArrowRight, Share2, Tag, 
  BookOpen, ChevronRight, MessageSquare, Send
} from 'lucide-react';
import { getBlogArticleBySlug, BLOG_ARTICLES_DATA, getServiceBySlug, getCaseStudyBySlug } from '../data/seoContent';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

export default function BlogDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const article = getBlogArticleBySlug(slug || '');

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Related services
  const relatedServices = (article.relatedServiceSlugs || [])
    .map(sSlug => getServiceBySlug(sSlug))
    .filter(Boolean);

  // Related projects
  const relatedProjects = (article.relatedProjectSlugs || [])
    .map(pSlug => getCaseStudyBySlug(pSlug))
    .filter(Boolean);

  // Structured Data Schema for Article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: article.featuredImage,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.authorName,
      jobTitle: article.authorRole
    },
    publisher: {
      '@type': 'Organization',
      name: 'SaroHub Technologies (Private) Limited',
      url: 'https://sarohub.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sarohub.com/assets/sarohub-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sarohub.com/blog/${article.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonicalUrl={`https://sarohub.com/blog/${article.slug}`}
        ogType="article"
        ogImage={article.featuredImage}
        structuredData={structuredData}
      />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: article.title, url: `/blog/${article.slug}`, isCurrent: true }
            ]}
          />
        </div>
      </div>

      {/* Article Header */}
      <article className="pt-12 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-6 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Tag className="h-3 w-3" /> {article.category}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2]">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-y border-slate-800/60 py-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  className="h-8 w-8 rounded-full object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <span className="block font-bold text-white">{article.authorName}</span>
                  <span className="block text-[10px] text-slate-500">{article.authorRole}</span>
                </div>
              </div>

              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                {new Date(article.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                {article.readingTime}
              </span>
            </div>

          </div>

          {/* Featured Image */}
          <div className="my-10 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-72 sm:h-[420px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Article Summary Lead */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm sm:text-base text-slate-200 leading-relaxed font-medium mb-12">
            {article.summary}
          </div>

          {/* Formatted Content */}
          <div className="prose prose-invert max-w-none space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            {article.contentMarkdown.split('\n\n').map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith('### ')) {
                return (
                  <h2 key={idx} className="font-display text-2xl font-bold text-white tracking-tight pt-6 border-t border-slate-800/80">
                    {trimmed.replace('### ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h3 key={idx} className="font-display text-lg font-bold text-cyan-400 pt-3">
                    {trimmed.replace('#### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('* ')) {
                const items = trimmed.split('\n* ').map(i => i.replace(/^\*\s*/, ''));
                return (
                  <ul key={idx} className="space-y-2 list-disc pl-5">
                    {items.map((item, i) => (
                      <li key={i} className="text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (trimmed.startsWith('1. ')) {
                const items = trimmed.split(/\n\d+\.\s*/).filter(Boolean);
                return (
                  <ol key={idx} className="space-y-2 list-decimal pl-5">
                    {items.map((item, i) => (
                      <li key={i} className="text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (trimmed === '---') {
                return <hr key={idx} className="border-slate-800/80 my-8" />;
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2">Topic Tags:</span>
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-cyan-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Services & Case Studies */}
          {(relatedServices.length > 0 || relatedProjects.length > 0) && (
            <div className="mt-16 pt-12 border-t border-slate-800 space-y-8">
              <h3 className="font-display text-xl font-bold text-white">
                Related Capabilities & Engineering Case Studies
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedServices.map((srv: any) => (
                  <Link
                    key={srv.slug}
                    to={`/services/${srv.slug}`}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
                  >
                    <span className="block text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                      Service Vertical
                    </span>
                    <span className="block text-sm font-bold text-white group-hover:text-cyan-300">
                      {srv.title}
                    </span>
                  </Link>
                ))}

                {relatedProjects.map((prj: any) => (
                  <Link
                    key={prj.slug}
                    to={`/projects/${prj.slug}`}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
                  >
                    <span className="block text-xs font-mono uppercase text-emerald-400 font-bold mb-1">
                      Case Study
                    </span>
                    <span className="block text-sm font-bold text-white group-hover:text-emerald-300">
                      {prj.clientName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>

      {/* Footer Navigation */}
      <section className="py-12 bg-slate-900/40 border-t border-slate-800/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/blog"
            className="text-xs font-mono font-bold text-slate-400 hover:text-white inline-flex items-center gap-1.5"
          >
            <span>← Back to Technical Bulletins</span>
          </Link>

          <Link
            to="/contact"
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
          >
            <span>Discuss Architecture With Our Team →</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
