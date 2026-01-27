import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { BLOGS } from '../../data/blogs';
import { Blog } from '../../data/blogs';

@Component({
  selector: 'app-blog-page',
  imports: [RouterLink],
  templateUrl: './blog-page.html'
})
export class BlogPage implements OnInit {
  blogs: Blog[] = BLOGS;
  currentBlog: Blog | null = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const slug = params['slug'];
      this.currentBlog = this.blogs.find((b) => b.slug === slug) || null;
      
      // Scroll to top when navigating to a new blog
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  goToBlog(blog: Blog): void {
    this.router.navigate(['/blog', blog.slug]);
  }

  /**
   * Calculate estimated reading time based on word count
   * Average reading speed: 200-250 words per minute
   */
  getReadingTime(text: string): number {
    const wordsPerMinute = 225;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, minutes); // Minimum 1 minute
  }

  /**
   * Get related blogs based on category/tags
   * Returns up to 3 related articles
   */
  getRelatedBlogs(currentBlog: Blog): Blog[] {
    if (!currentBlog) return [];

    // Filter out current blog and get related ones
    const relatedBlogs = this.blogs
      .filter(blog => blog.id !== currentBlog.id)
      .slice(0, 3);

    return relatedBlogs;
  }
}
