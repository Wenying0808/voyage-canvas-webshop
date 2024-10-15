import * as dotenv from "dotenv";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { collections } from './database';
import { User } from './interfaces/user.interface';
import { ObjectId } from 'mongodb';

dotenv.config({ path: '../.env' });

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing required environment variables for authentication');
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
    }, 
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
        try {
            let user = await collections.users?.findOne({ providerId: profile.id, provider: 'google' });
            if (!user) {
                const newUser: User = {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'google',
                    providerId: profile.id
                };
                const result = await collections.users?.insertOne(newUser);
                if (result?.acknowledged) {
                    user = { ...newUser, _id: result.insertedId };
                }
                }
                done(null, user);

        } catch (error) {
            done(error as Error);
        }
    }
));


passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User)._id);
  });
  
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await collections.users?.findOne({ _id: new ObjectId(id)});
        done(null, user);
    } catch (error) {
        done(error as Error);
    }
});


export default passport;