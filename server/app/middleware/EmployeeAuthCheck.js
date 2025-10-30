const jwt = require('jsonwebtoken');
const employeeAuthCheck = async (req, res, next) => {
  try {
    const token = req.cookies.employeeToken;
    if (!token) {
      return res.status(401).json({ message: 'Employee token is required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_EMPLOYEE || "hellowelcomeEmployee123456");
    req.employee = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
module.exports = employeeAuthCheck;


