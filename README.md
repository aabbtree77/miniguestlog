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

This MERN app shows the visitors of my homepage at aabbtree77.github.io. To see the list, one must click on the link "Guests". There is no "R" in this application, only plain Js. This code is hosted on render.com (with a free plan) and uses a free mongodb.com account to store data. The frontend code is at https://github.com/aabbtree77/aabbtree77.github.io. 

Tracking can be accomplished with [Google Analytics](https://en.wikipedia.org/wiki/Google_Analytics) (GA) for free, without coding. However, GA is banned in many European countries such as France, Finland, Sweden... It is not banned in Lithuania though.

## MERN

MERN is ideal for this kind of a simple CRUD app. A single language (Js) on the server and client, communication with JSON, no choice-induced paralysis.

The client side Js gave me one small headache with an "async double fetch" which had to be nested. 

I did not bother much with Fetch vs Axios, TanStack Query, Js vs Ts, also used ChatGPT whenever needed. Fixing Js and CSS problems with console.log() and Chrome F12 tools is a joy compared to working with OpenGL, or reading Weinberg's QFT, despite all the garbage called asynchrony, nested callbacks, and dynamic typing. 

## Testing with HTTP Requests

During the development, I learned from reddit that Postman API could be in the process of **[enshittification](https://www.reddit.com/r/webdev/comments/16tq1eh/now_that_postman_sucks_is_there_a_good_alternative/)**, and rushed to use VS Code with an extension called [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). The latter is simple and snappy, which I cannot say about VS Code.

## render.com

The cloud shuts down the nodes with the free plan after 15 minutes of any request inactivity: [1](https://community.render.com/t/cold-boot-start-of-the-server-for-first-request/15911), [2](https://docs.render.com/docs/free). Later on, the first request will take the whole minute or two to process (!), the things run smoothly again, until the next inactivity. **This is definitely not going to be a good user experience.** Concerning this web app specifically, I can wait for my personal list of guests to load, but there is no way for the free plan to work without some kind of a constant pinging.

## geoip-lite

It is not reliable with the city detection. It confuses Vilnius with Kaunas in Lithuania. Sometimes the returned city is an empty string. It is unclear if the geoip-lite database will be updated on render.com, and how often. This part needs to be totally rewritten.

## MongoDB Atlas

There are a lot of ways to set up and manage the database. I have used two: (i) The ATLAS cloud with the online GUI in my desktop browser, and (ii) the tool called MongoDB Compass which I have installed on Ubuntu 22.04.   

The online GUI occasionally is disfunctional with 

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

The shell does not support the right mouse click, and the selection with mouse is limited to a single line, ctrl+c works fine. 

One has to be extra-careful with connection URIs. Database -> Connect gives a generic URI, but one needs to append it with a specific database (collection) name set up during the creation, which may not be visible at all due to the retrieval error indicated above. Typing this in MongoDB Compass (with a proper username and password)

```
mongodb+srv://<username>:<password>@cluster0.0vbktln.mongodb.net/
```

does not display any errors, it connects and displays the collections, but MONGOSH would not work. I had to explicitly reconnect with the collection name "guests" appended

```
mongodb+srv://<username>:<password>@cluster0.0vbktln.mongodb.net/guests
```

for MONGOSH to work. 

Note the collection names, look into .env files in the server side code.

## Security

I have limited my MongoDB collection to 10MB and 200 documents (the free MongoDB Atlas plan provides a lot more, 512MB storage). This is a capped collection, the newest document overwrites the oldest one, so an attacker can only flood the server API, but it won't crash the server. The frontend is set to retrieve only 50 latest items, all at once, so it should not hang the browser. Typically, it will be less than 250KB of data to download. The log is visible to everyone as there is no sensitive data.

## Mermaid

Mermaid diagrams are only good for tiny simple diagrams, but I would no longer use them for anything. See the figure above, the automated node placement and styling are just plain horrid. Next time I will use Excalidraw or draw.io (app.diagrams.net).

## Conclusions

This mini web app runs for about a month continuously (January 2024). It takes one click to redeploy the newest github commit on render.com, but the free plan with cold starts is annoying. It solves the problem though, I can log my visitors. 

It is not clear if MERN is the way. It feels too low level, but so do all the newest frameworks. They all lack a built-in user sign-up and a standard to code things per user. Hunting for the 3rd party authentication solutions to save time [does not solve the problem.](https://blog.hyperknot.com/p/comparing-auth-providers?ref=felixvemmer.com) 

I am looking into [this self-hosted Payload CMS applied with Next.js 14 and Express](https://www.youtube.com/watch?v=06g6YJ6JCJU) now. A lot gets done in a short time, but it is not clear if this is reliable. I do not see much development on the github repository by the author (Josh) and his youtube followers. I will evaluate Payload CMS and Next.js, but most likely will stick to MERN. TBC...

## References

I have greatly benefited from these works:

[Web Dev Cody: TODO with Authentication.](https://www.youtube.com/watch?v=oJBu2k7OEk8) The React part feels rushed and convoluted, and I am not sure about authentication, but my web journey has begun with this code.

Net Ninja: [TODO-I](https://www.youtube.com/watch?v=98BzS5Oz5E4&t=2s), [TODO-II.](https://www.youtube.com/watch?v=WsRBmwNkv3Q&t=1s) The same thing, but also mildly styled and expanded. I am not sure if I should stick to pure MERN, or it should be [MERN+Next.js](https://www.youtube.com/watch?v=06g6YJ6JCJU).

[EdRoh: MERN Dashboard.](https://youtu.be/0cPCMIuDk2I?t=24251) Shows the deployment on render.com. Unlike some other tutorials, it does not miss an important step that demands whitelisting render.com IP addresses on mongodb.com.

The following two notes belong to frontend, but I will mention them here since I do not have a separate memo about my frontend code:

[Rajkumar Gaur: Beautiful Spinner in CSS.](https://medium.com/nerd-for-tech/beautiful-spinner-in-css-bce7a348f50f). I did not want to load any images, so this blog article solved the problem admirably. It had one bug visible when the spinner size was large. See my CSS code around "@keyframes rotate" inside spinner.css at https://github.com/aabbtree77/aabbtree77.github.io/miniguestlog, but I have also modified the way the spinner spins later on. These bugs are easy to fix with Chrome's F12 at runtime. Add a break point, click on "Elements", and then enable/disable various CSS properties while observing the result. Imagine we had such debuggability with 3D backends and Make files... I would take dynamic typing over the static any day.

[Josephine Loo: How to Overlay Text on an Image in HTML and CSS.](https://www.bannerbear.com/blog/how-to-overlay-text-on-an-image-in-html-and-css/) This is a useful note to center and overlay stuff. To display a loading message with a spinner, I did not go this way as it would rotate the message with the spinner. Instead, I made a separate div centered at the same place as the spinner, and then simply set a large z-index value of this message div.

[Capped Collections.](https://www.mongodb.com/docs/manual/core/capped-collections/)

[MongoServerError: user is not allowed to do action [collMod].](https://stackoverflow.com/questions/77071661/user-is-not-allowed-to-do-action-collmod-on-db-name-collection-name)

[Retrieve last mongodb entry in nodejs.](https://stackoverflow.com/questions/40769907/retrieve-last-mongodb-entry-in-nodejs)
 
