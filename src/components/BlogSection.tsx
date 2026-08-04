import React, { useState } from 'react';
import { BlogPost, initialBlogPosts } from '../data/blogData';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  Share2, 
  Sparkles, 
  X, 
  ChevronLeft,
  MessageCircle,
  TrendingUp,
  Award
} from 'lucide-react';

import { Language } from '../types';
import { getTranslation, translations } from '../lib/translations';
import { SeeMoreButton } from './SeeMoreButton';

interface BlogSectionProps {
  onNavigateToAdmin?: () => void;
  onNavigateToMenu?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  currentLang?: Language;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onNavigateToAdmin,
  onNavigateToMenu,
  onOpenAuth,
  currentLang = 'ar'
}) => {
  const t = (key: keyof typeof translations.ar) => getTranslation((currentLang || 'ar') as Language, key);
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = ['الكل', 'تسويق المطاعم', 'المنيو الرقمي', 'تقنية وتكنولوجيا', 'أرباح وتشغيل'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'الكل' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.featured) || posts[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black tracking-wide">
          <BookOpen className="w-4 h-4" />
          <span>مدونة menuz • مقالات ونقاط نجاح المطاعم 📰</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          دليلك الشامل لنمو المطاعم والتحول الرقمي
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
          نشارككم أحدث الاستراتيجيات والتقنيات المجربة لزيادة المبيعات، تحسين تجربة الزبائن وتطوير منيو المطاعم والمقاهي.
        </p>

        {/* Search Bar & Categories */}
        <div className="pt-6 max-w-xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن موضوع، استراتيجية، أو نصيحة تسويقية..."
              className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Featured Main Article Card */}
        {featuredPost && searchQuery === '' && selectedCategory === 'الكل' && (
          <div 
            onClick={() => setActiveArticle(featuredPost)}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-orange-500/50 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> المقال المميز ⭐
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-orange-600 dark:text-orange-400 font-bold">
                  <span>{featuredPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-orange-600 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/30"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{featuredPost.author.name}</p>
                    <p className="text-[10px] text-slate-500">{featuredPost.author.role}</p>
                  </div>
                </div>

                <span className="text-xs font-black text-orange-600 dark:text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                  اقرأ التفاصيل <ChevronLeft className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>جميع المقالات والنصائح ({filteredPosts.length})</span>
            </h3>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">لم يتم العثور على مقالات تطابق البحث</p>
              <p className="text-xs text-slate-500 mt-1">جرب كلمات بحث أخرى أو اختر فئة مختلفة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActiveArticle(post)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-orange-500/40 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800">
                      <img
                        src={post.image}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-amber-300 text-[11px] font-black px-3 py-1 rounded-full border border-amber-300/30 shadow-md">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-right dir-rtl">
                      <div className="space-y-2.5">
                        {/* Meta info header */}
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span>{post.date}</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-orange-500 shrink-0" />
                            <span>{post.readTime}</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug tracking-tight text-right group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>

                        {/* Excerpt */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-medium text-right pt-0.5">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{post.author.name}</span>
                    </div>

                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      قراءة <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Uiverse See More Button for articles */}
          <div className="pt-6 flex justify-center">
            <SeeMoreButton
              label="عرض المزيد من المقالات والنصائح"
              onClick={() => alert('تم تحميل المزيد من المقالات والدراسات!')}
            />
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-black">
              انطلق مع menuz الآن 🚀
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">جاهز لترقية المنيو وزيادة مبيعات مطعمك؟</h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              أنشئ المنيو الرقمي الخاص بك في أقل من 3 دقائق مجاناً، واستمتع بالطلب التفاعلي والطباعة المباشرة للفواتير!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToAdmin}
              className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-xl shadow-orange-600/30 transition-all cursor-pointer active:scale-95"
            >
              افتح لوحة التحكم مجاناً ⚡
            </button>
            <button
              onClick={onNavigateToMenu}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all cursor-pointer"
            >
              تصفح الديمو المباشر 🍽️
            </button>
          </div>
        </div>

      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 dark:border-slate-800">
            
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content Area */}
            <div className="p-6 sm:p-10 space-y-6 max-h-[80vh] overflow-y-auto">
              
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {activeArticle.title}
                </h2>

                <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeArticle.author.avatar}
                      alt={activeArticle.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{activeArticle.author.name}</p>
                      <p className="text-[10px] text-slate-400">{activeArticle.author.role}</p>
                    </div>
                  </div>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </div>
              </div>

              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Markdown-like Content */}
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-slate-700 dark:text-slate-300">
                {activeArticle.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-lg font-black text-slate-900 dark:text-white pt-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={idx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" />
                {activeArticle.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
