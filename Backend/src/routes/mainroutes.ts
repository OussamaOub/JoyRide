import express from 'express';
import {userrouter} from './auth.routes';
import { postrouter } from './post.routes';
import { ridesrouter } from './rides.routes';
import { issuerouter } from './issue.routes';
import {conversationsRouter} from './conversation.routes';
import {messagesRouter} from './message.routes';

const mainrouter = express.Router();

mainrouter.use("/user", userrouter)
mainrouter.use("/posts", postrouter)
mainrouter.use("/rides", ridesrouter)
mainrouter.use("/issues", issuerouter)
mainrouter.use("/conversations", conversationsRouter)
mainrouter.use("/messages", messagesRouter)



export default mainrouter
