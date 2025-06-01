// Class to format blog data with author details for frontend
class BlogDetailsDTO {
  constructor(blog) {
    // Copy blog ID
    this._id = blog._id;
    // Copy blog content
    this.content = blog.content;
    // Copy blog title
    this.title = blog.title;
    // Copy blog photo path
    this.photo = blog.photoPath;
    // Copy when blog was created
    this.createdAt = blog.createdAt;
    // Copy author's name (from populated author object)
    this.authorName = blog.author.name;
    // Copy author's username (from populated author object)
    this.authorUsername = blog.author.username;
  }
}

// Export the class so other files can use it
module.exports = BlogDetailsDTO;
