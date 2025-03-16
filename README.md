> [“Enshittification, also known as platform decay,[1] is the pattern of decreasing quality of online platforms that act as two-sided markets.”](https://en.wikipedia.org/wiki/Enshittification)<br>

<table align="center">
    <tr>
    <th align="center"> A Simple MERN App to Track Visitors</th>
    </tr>
    <tr>
    <td>
    <img src="./mermaid/mermaid-diagram-2023-12-18-190827.png"  alt="Guestlog implementation." width="100%" >
    </td>
    </tr>
</table>

## Introduction

This MERN app monitors [aabbtree77.github.io](https://aabbtree77.github.io/). To see the list of visitors, one must click on the link `Guests` inside the `CV` tab on the landing page. This code is hosted on render.com (with a free plan) and uses a free mongodb.com account to store data. The frontend code is at [https://github.com/aabbtree77/aabbtree77.github.io](https://github.com/aabbtree77/aabbtree77.github.io). 

Tracking can be accomplished with [Google Analytics](https://en.wikipedia.org/wiki/Google_Analytics) (GA) for free, without coding. However, GA is banned in many European countries such as France, Finland, Sweden...

## Technology Stack

MERN is ideal here, but it will lack authentication and structure for anything bigger. The client side Js gave me one small headache with an async double fetch which had to be nested. 

I did not bother much with Fetch vs Axios, TanStack Query, Js vs Ts, also used ChatGPT whenever needed. Fixing Js and CSS problems with console.log() and Chrome F12 tools is a joy compared to working with OpenGL.

During the development, I learned from Reddit that Postman API could be in the process of **[enshittification](https://www.reddit.com/r/webdev/comments/16tq1eh/now_that_postman_sucks_is_there_a_good_alternative/)**, and rushed to use VS Code with an extension called [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). The latter is simple and snappy.

render.com shuts down the nodes with a free plan after 15 minutes of any request inactivity: [1](https://community.render.com/t/cold-boot-start-of-the-server-for-first-request/15911), [2](https://docs.render.com/docs/free). Later on, the first request will take the whole minute or two to process, the things run smoothly again, until the next inactivity.

geoip-lite requires updates or even paid plans. It may confuse Vilnius with Kaunas in Lithuania. Sometimes the returned city is an empty string. This part needs some rethinking.

## MongoDB Atlas

I have used two ways to access MongoDB Atlas: (i) Chrome, and (ii) MongoDB Compass on Ubuntu 22.04.   

The Chrome GUI occasionally is disfunctional with 

```
"Request invalid. Please visit your Clusters and try again."
```

after clicking on Database -> Cluster0 -> Collections, despite the IP being whitelisted. Googling does not help much, but the error does not happen often.

MongoDB Compass solves this problem, but it is an extra desktop app with its own GUI and shell. It works well though.

Deleting multiple entries (documents) is not possible in the online GUI. In MongoDB Compass, one needs to get into MONGOSH shell, and then execute the commands such as

```
> db.guests.deleteMany({city:"Kaunas"})

> {
   acknowledged: true,
   deletedCount: 19
  }
```

The shell does not support the right mouse click, mouse selection is limited to a single line, ctrl+c works fine. 

One has to be extra-careful with connection URIs. Database -> Connect gives a generic URI, but one needs to append it with a specific database (collection) name set up during the creation, which may not be visible due to the retrieval error indicated above. Typing this in MongoDB Compass (with a proper username and password)

```
mongodb+srv://<username>:<password>@cluster0.0vbktln.mongodb.net/
```

does not display any errors, it connects and displays the collections, but MONGOSH would not work. 

I had to explicitly reconnect with the collection name "guests" appended

```
mongodb+srv://<username>:<password>@cluster0.0vbktln.mongodb.net/guests
```

for MONGOSH to work. 

Note the collection names, look into .env files set up on render.com.

## Security

I have limited my MongoDB collection to 10MB and 200 documents (the free MongoDB Atlas plan provides a lot more, 512MB storage). This is a capped collection, the newest document overwrites the oldest one, so an attacker can only flood the server API, but it won't crash the server. The frontend is set to retrieve only 50 latest items, all at once, so it should not hang the browser. Typically, it will be less than 250KB of data to download. The log is visible to everyone as there is no sensitive data.

## Mermaid

Mermaid diagrams look good for simple diagrams, but I would no longer use them for anything. See the figure above, the automated node placement and styling are horrid. Next time I will use Excalidraw or draw.io (app.diagrams.net).

## Conclusions (A Year Later)

This small web app runs for over a year continuously (since January 2024). It takes one click to redeploy the newest github commit on render.com, but the free plan with cold starts is somewhat annoying. It solves the problem though, I can log my visitors. 

MERN is better than metaframeworks, but they all lack built-in authentication and inexpensive hassle-free hosting. [MongoDB](https://www.mongodb.com/pricing) starts at 8 cents/hour for 10GB, while render.com is at least 20$/month just like Vercel, and the caps or their lack is always scary for a solo developer. 

I plan to go with [Better Auth](https://www.better-auth.com/) and SQLite, all self-hosted on Hetzner, but it is not clear how to achieve the productivity and ease of managed clouds. [Turso](https://turso.tech/pricing) looks generous enough at the moment. PocketBase is also worth trying to avoid coding everything from scratch, with some chance to keep everything under control.

## References

I have greatly benefited from these works:

[Web Dev Cody: TODO with Authentication.](https://www.youtube.com/watch?v=oJBu2k7OEk8) The React part feels convoluted, and I am not sure about authentication, but my web journey has begun with this code.

Net Ninja: [TODO-I](https://www.youtube.com/watch?v=98BzS5Oz5E4&t=2s), [TODO-II.](https://www.youtube.com/watch?v=WsRBmwNkv3Q&t=1s) The same thing, but also mildly styled and expanded.

[EdRoh: MERN Dashboard.](https://youtu.be/0cPCMIuDk2I?t=24251) Shows the deployment on render.com. Unlike some other tutorials, it does not miss an important step that demands whitelisting render.com IP addresses on mongodb.com.

[Rajkumar Gaur: Beautiful Spinner in CSS.](https://medium.com/nerd-for-tech/beautiful-spinner-in-css-bce7a348f50f). It allows to avoid loading images. It had one bug visible when the spinner size was large. See my frontend CSS code around "@keyframes rotate" inside spinner.css at [https://github.com/aabbtree77/aabbtree77.github.io/miniguestlog](https://github.com/aabbtree77/aabbtree77.github.io/miniguestlog). 

Frontend bugs can be located with Chrome's F12 at runtime. Add a break point, click on "Elements", and then enable/disable various CSS properties while observing the result. Imagine we had such debuggability with 3D backends and Make files... I would take dynamic typing over the static any day.

[Josephine Loo: How to Overlay Text on an Image in HTML and CSS.](https://www.bannerbear.com/blog/how-to-overlay-text-on-an-image-in-html-and-css/) If applied directly, it would rotate the message with the spinner. Instead, make a separate div centered at the spinner, and then set a large z-index value of the message div.

[Capped Collections.](https://www.mongodb.com/docs/manual/core/capped-collections/)

[MongoServerError: user is not allowed to do action [collMod].](https://stackoverflow.com/questions/77071661/user-is-not-allowed-to-do-action-collmod-on-db-name-collection-name)

[Retrieve last mongodb entry in nodejs.](https://stackoverflow.com/questions/40769907/retrieve-last-mongodb-entry-in-nodejs)
 
