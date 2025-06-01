// Class to format basic blog data for frontend
class BlogDTO {
  constructor(blog) {
    // Copy blog ID
    this.id = blog._id;
    // Copy author ID
    this.author = blog.author;
    // Copy blog title
    this.title = blog.title;
    // Copy blog content
    this.content = blog.content;
    // Copy blog photo path
    this.photo = blog.photoPath;
  }
}

// Export the class so other files can use it
module.exports = BlogDTO;
