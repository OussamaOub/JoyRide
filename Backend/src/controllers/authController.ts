import { NextFunction, Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import {prisma} from "../utils/db"
import { JwtPayload } from 'jsonwebtoken';

interface DecodedJwtPayload extends JwtPayload {
  id: string;
}

interface AuthRequest extends Request {
  user?: DecodedJwtPayload;
  token?: string;
}


const SECRET_KEY = process.env.SECRET_KEY || 'yourSecretKey'; // Replace with your actual secret key

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, role, rating} = req.body;

    // console.log("Checking if user exists")
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
        // console.log("User already exists")
      return res.status(400).json({ message: 'User already exists' });
    }

    // console.log("Hashing password")
    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log("Creating user")
    const newUser = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        // role,
        // rating,
      },
    });
    
    // console.log("User Created Successfully")
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    // console.error('Error in signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // console.log("Checking if user exists")
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Email' });
    }

    // console.log("Hashing password for comparison")
    const passwordMatch = await bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      // console.log("Passwords don't match")
      return res.status(402).json({ message: 'Invalid password' });
    }

    // console.log("Creating the JWT")
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: '30d',
    });

    // console.log("Setting token as an HTTP-only cookie")
    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   // sameSite: 'strict',
    // });

    // console.log("Login complete")
    req.token = token
    req.user = user
    next();
  } catch (error) {
    // console.error('Error in signin:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createSession = async(req: AuthRequest, res: Response)=>{
  if (req.token && req.user) {
    try {
      // console.log("Creating a session");
      const user = req.user
      const decodedtoken = jwt.verify(req.token, SECRET_KEY) as DecodedJwtPayload; // Replace 'yourSecretKey' with your actual secret key

      // Check if the JWT contains a 'userId' claim
      if (decodedtoken && decodedtoken.userId) {
        const { userId } = decodedtoken;

        const session = await prisma.session.create({
          data: {
            jwt: req.token,
            revoked: false,
            userId: userId,
          }
        });
        const sessionId = session.id
          res.status(200).json({ message: 'Login successful', user, cookie:{jwt: req.token}, sessionId });
      } else {
        res.status(400).json({ message: 'JWT does not contain userId claim' });
      }
    } catch (error) {
      console.error('Error Creating a session:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.status(500).json({ message: 'no request token error' });
  }
}


export const logout = async(req: any, res: Response) =>{

  const cookieHeader = req.headers.cookie as string;
  if (!cookieHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  type Cookies = {
    [key: string]: string;
  };

  const cookies: Cookies = {};

  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = value;
  });
  const sessionId = cookies.sessionId; // Get the JWT token from the cookies
  if (!sessionId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const deleted = await prisma.session.deleteMany({
      where:{
        id: sessionId
      },
    })
    res.status(200).json({message: "Session Deleted. Logout Successful"})
  } catch (error) {
    return res.status(405).json({ message: 'Invalid token' });
  }

}


export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Define the type of cookies
  type Cookies = {
    [key: string]: string;
  };

  // Initialize an empty object for cookies
  const cookies: Cookies = {};

  // Parse the cookies from the "cookie" header
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = value;
  });

  const token = cookies.jwt; // Get the JWT token from the cookies
  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedJwtPayload; // Replace 'yourSecretKey' with your actual secret key
    req.user = decoded; // Store the user data in the request object
    next();
  } catch (error) {
    return res.status(405).json({ message: 'Invalid token' });
  }
};

export const isUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // console.log("Here")
    if (req.user?.userId) {
      const user = await prisma.user.findFirst({
        where: {
          id: req.user.userId
        }
      })
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid user ID' });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error })
  }
}

export async function changeuserpass(req: AuthRequest, res: Response){
  try{
    if (req.user?.id){
      // const user = await prisma.user.findFirst({
      //   where:{
      //     id: req.user.id
      //   }
      // })
      // if (user){
        const newpass = req.params.newpass
        const hashedPassword = await bcrypt.hash(newpass, 10);
        const updateduser = await prisma.user.update({
          where:{
            id: req.user.id
          },
          data:{
            password: hashedPassword
          }
        })
        res.status(201).json({message: "Password changed successfully"})
      // }
      // else{
        // res.status(404).json({message: "User not found"})
      // }
    }
    else{
      res.status(400).json({message: "Invalid user ID"})
    }
  }
  catch(error){
    res.status(500).json({message: "An error occurred", error})
  }
}

export async function checkpassword(req: AuthRequest, res: Response, next: NextFunction){
  try{
    if (req.user?.id){
      // console.log("Old pass: ", req.params.oldpass)
      // console.log("NewPass ", req.params.newpass)
      // console.log("User: ", req.user) 
      // const oldpass = await prisma.user.findFirstOrThrow({
      //   where:{
      //     id: req.user.id
      //   },
      //   select:{
      //     password: true
      //   }
      // })
      const isPasswordValid = await bcrypt.compare(req.params.oldpass, req.user.password);

      if (isPasswordValid) {
        next();
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    }
    else{
      res.status(400).json({message: "Invalid user ID"})
    }
  }
  catch(error){
    res.status(500).json({message: "An error occurred", error})
  }
}


export async function changeuserdata(req: AuthRequest, res: Response){
  try{
    if (req.user?.id){
      const {username, email, firstName, lastName} = req.body
      const updateduser = await prisma.user.update({
        where:{
          id: req.user.id
        },
        data:{
          username,
          email,
          firstName,
          lastName
        }
      })
      res.status(201).json({message: "User data changed successfully"})
    }
    else{
      res.status(400).json({message: "Invalid user ID"})
    }
  }
  catch(error){
    res.status(500).json({message: "An error occurred", error})
  }
}