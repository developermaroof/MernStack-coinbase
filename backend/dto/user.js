// Class to format user data for frontend (removes sensitive info like password)
class UserDTO {
  constructor(user) {
    // Copy user ID
    this._id = user._id;
    // Copy username
    this.username = user.username;
    // Copy email address
    this.email = user.email;
    // Note: Password is NOT included for security
  }
}

// Export the class so other files can use it
module.exports = UserDTO;
