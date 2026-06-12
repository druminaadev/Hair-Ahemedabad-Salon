module.exports = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No credentials provided' })
    }
    
    const userRole = req.user.role || 'customer' // default to customer role if not specified
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' })
    }
    
    next()
  }
}
