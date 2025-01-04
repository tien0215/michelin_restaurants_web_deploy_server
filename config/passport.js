let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").user;
// JwtStrategy
// 這段程式碼使用了 passport-jwt 提供的策略來處理基於 JWT 的身份驗證：

// ExtractJwt.fromAuthHeaderWithScheme("jwt")：
// 從請求的標頭中提取帶有 jwt 標識的 Token。
// opts.secretOrKey：
// 使用你的密鑰（PASSPORT_SECRET）來驗證 JWT 的有效性。
// 驗證流程：

// 當請求攜帶一個 JWT 時，JwtStrategy 會：
// 解碼 JWT 並提取其中的 payload（例如使用者 ID）。
// 根據 payload 中的 _id，在資料庫中查找對應的使用者。
// 如果找到使用者，則認為驗證成功，並將使用者資料 (foundUser) 存入 req.user。
// 如果未找到，則驗證失敗，後續的路由處理會被攔截。

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          return done(null, foundUser); // req.user <= foundUser
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
