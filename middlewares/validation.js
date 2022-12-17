const { check, validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

exports.UserValidation = [
  check("id", "아이디는 3자리이상 10자리 이하입니다.")
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 }),
  check("pw", "비밀번호는 숫자형식으로 3자리이상 입니다. ")
    .trim()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 3 }),
];
