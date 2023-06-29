import Redis from "redis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./express";
import userSchema from "./model";
import { helper } from "./helper/helper";
const Helper = new helper();
import { DatabaseConnection } from "./db";
import config from "./config";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import Facebook from "passport-facebook";
const FacebookStrategy = Facebook.Strategy;
dotenv.config({ path: "./.env" });
const port = process.env.port;

app.post("/createUser", async (req, res) => {
  // const red = getClient.set("name", req.params.name);
  try {
    console.log("req.body:- \t", req.body);
    const user = Helper.createname(req.body);
    console.log("user:- \t", user);
    res.status(200).send({ mes: "create user", data: user });
  } catch (error) {
    console.log("error:- ", error);
    res.status(500).send({ mes: "error in create user", data: error });
  }
});
// Passport session setup.
passport.serializeUser(function (user: any, done) {
  console.log("serializeUser\n");
  console.log("user:- ", user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("deserializeUser\n");
  console.log(`obj:- ${id}`);
  done(null, `${id}`);
});
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_api_key,
      clientSecret: config.facebook_api_secret,
      callbackURL: config.callback_url,
      profileFields: config.profileFields,
    },
    function (accessToken, refreshToken, profile, done) {
      try {
        process.nextTick(async function () {
          //Check whether the User exists or not using profile.id
          if (config.use_database) {
            // if sets to true
            const user = await userSchema.findOne({ sid: profile.id });
            if (!user) {
              console.log("There is no such user, adding now");
              const data = {
                sid: profile.id,
                email: String(
                  profile.emails?.map((d) => {
                    console.log("email:-  ", d.value);
                    return d.value;
                  })
                ),
                first_name: profile._json.first_name,
                last_name: profile._json.last_name,
              };
              await Helper.createname(data);
            } else {
              console.log("User already exists in database");
            }
          }
          return done(null, profile);
        });
      } catch (error) {
        throw new Error("error in nextTick fun.");
      }
    }
  )
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "keyboard cat", name: "sid" }));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", function (req, res) {
  res.render("index", { user: req.user });
});

app.get("/account", ensureAuthenticated, function (req, res) {
  console.log("account req- ", req);
  res.render("account", { user: req.user });
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/logout",
    failureRedirect: "/login",
  })
  // function (req, res) {
  //   console.log("auth/facebook/callback req:- ", req);
  //   res.redirect("/");
  // }
);

app.get("/logout", function (req, res) {
  console.log("logout");
  req.logout((err) => {
    if (err) {
      console.log("logout err:- ", err);
      throw err;
    }
  });
  res.redirect("/");
});

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("ensureAuthenticated");
  res.redirect("/login");
}

app.listen(port, () => {
  DatabaseConnection();
  console.log("server :- ", port);
});
