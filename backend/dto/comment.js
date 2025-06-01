// Class to format comment data for frontend
class CommentDTO {
  constructor(comment) {
    // Copy comment ID
    this._id = comment._id;
    // Copy comment content/text
    this.content = comment.content;
    // Copy when comment was created
    this.createdAt = comment.createdAt;
    // Copy author's username (from populated author object)
    this.authorUsername = comment.author.username;
  }
}

// Export the class so other files can use it
module.exports = CommentDTO;
