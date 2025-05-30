class BlogDTO {
  constructor(blog) {
    this.author = blog.author;
    this.title = blog.title;
    this.content = blog.content;
    this.photo = blog.photoPath;
  }
}

module.exports = BlogDTO;
