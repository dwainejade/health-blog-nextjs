// Blog Card Component
function BlogCard({ post }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        <div className="aspect-video bg-gray-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          {post.category && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {post.category}
            </span>
          )}
          <time className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </time>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link
            href={`/post/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/post/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Read more →
          </Link>

          {post.views && (
            <span className="text-xs text-gray-500">{post.views} views</span>
          )}
        </div>
      </div>
    </article>
  );
}
