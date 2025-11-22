> [“Enshittification, also known as platform decay,[1] is the pattern of decreasing quality of online platforms that act as two-sided markets.”](https://en.wikipedia.org/wiki/Enshittification)<br>


<table align="center">
    <tr>
    <th align="center"> What It Takes To Store Visitor Location</th>
    </tr>
    <tr>
    <td>
    <img src="./mermaid/mermaid-diagram-2023-12-18-190827.png"  alt="Guestlog implementation." width="100%" >
    </td>
    </tr>
</table>

## Introduction

This MERN app monitors my homepage [aabbtree77.github.io](https://aabbtree77.github.io/). The visitor time, city, and country are displayed by clicking on the link `Guests` inside the `CV` tab on the landing page. 

The problem looks trivial, but the simplest solution I have come up with uses:

- Github Pages to host frontend at [aabbtree77/aabbtree77.github.io](https://github.com/aabbtree77/aabbtree77.github.io).

- github.com to develop backend (this repo at [aabbtree77/miniguestlog](https://github.com/aabbtree77/miniguestlog)).

- render.com (free plan) to CI/CD/host backend.

- mongodb.com Atlas (free plan) to store visitor's time, city, country.

- MongoDB Compass dekstop app to clean DB occasionally.

- ipify.org to get the visitor's IP.  

- maxmind.com GeoLite2 free DB to infer the city and country based on the IP.

- BearVPN (free plan) to test different geolocations.

Tracking can be accomplished much much easier with [Google Analytics](https://en.wikipedia.org/wiki/Google_Analytics) (GA) for free, without coding. However, GA is bloated and banned in many European countries such as France, Finland, Sweden...

## MERN

MERN (Mongo, Express, React, Node) is ideal here, but it will lack authentication and structure for anything bigger. The client side introduced a challenge with an async double fetch which had to be nested. No React was applied in this code. 

I did not bother whether to apply Fetch or Axios, TanStack Query, Js vs Ts, also used ChatGPT whenever needed.

During the development, I learned from Reddit that the Postman API could be in the process of **[enshittification](https://www.reddit.com/r/webdev/comments/16tq1eh/now_that_postman_sucks_is_there_a_good_alternative/)**, and rushed to use VS Code with an extension called [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). The latter is simple and snappy.

## render.com

The app is deployed on render.com. The service allows to `git push origin main` to this repo and see the changes instantly 
deployed as a complete web app without quagmire. The render.com GUI is intuitive, everything works reliably.

However, the fees are Vercel-alike, and one needs to watch out for the use limits, DDoS!

The free plan on render.com is rather horrid:

- It shuts down the nodes after 15 minutes of any request inactivity: [1](https://community.render.com/t/cold-boot-start-of-the-server-for-first-request/15911), [2](https://docs.render.com/docs/free). Later on, the first request will take the whole minute or two to process, the things run smoothly again, until the next inactivity.

- It disables shell, so any quick testing can only be done via app's index.js reuploaded. `postinstall` bash script in `package.json` runs fine.

- 1 GB of SSD storage for PostgreSQL databases, which expire after 30 days, this is why I also must use MongoDB Atlas.

It is not entirely clear how well render handles complex fast moving projects like Bun.js, Next.js. [Web Dev Cody](https://youtu.be/ixCEmwH1D8c?t=821) prefers Vercel for his Next.js deployments.

The free plan is only good for testing external DBs and personal web apps, such as this one.

## MongoDB Atlas

One can access MongoDB Atlas in two ways: (i) Chrome, and (ii) MongoDB Compass on Ubuntu 22.04.   

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

The MongoDB's free tier is only 500MB, but it seems to be free forever, not for 30 days.

## MaxMind Geolocation

At first, I have used the NPM package

```js
const geoip = require("geoip-lite");
```

It worked for several years reliably. Note the following though:

- geoip-lite uses MaxMind’s free GeoLite2 database without requiring any registrations, keys, it is hassle-free.

- It bundles the free database at publish-time, which eventually sadly gets outdated and needs manual version updates and redeployment.

- [The code](https://www.npmjs.com/package/geoip-lite?activeTab=dependencies) is not actively maintained anymore.

Therefore, the switch was made to use MaxMind's free GeoLite2 database properly with registration and

```js
const { Reader } = require('@maxmind/geoip2-node');
```

geoip2-node takes some effort to setup. One needs to:

- register at maxmind.com, login there, generate the key, 

- put it inside `.env` with the latter in .gitignore on github,

- set the key also as an environment variable on render.com, 

- set up the postinstall script in package.json to download and untar a free version of 
DB (into 64MB). 

Make sure to set `.gitignore` not to commit .env and any DB files on github as it imposes 
the limit of 100MB and GeoLite2 may exceed that. Moreover, the DB files may contain the generated key.

Removing a large file from an erroneous commit (exceeding limits) is doable, 
but also a hassle. Downloading large files (100MB) on render.com with scripts is perfectly fine.

Make sure to inform ChatGPT about the latest changes of the [MaxMind API.](https://dev.maxmind.com/) The path to GeoLite2-City and the code API.

Once the setup is finished, the code no longer confuses Vilnius with Kaunas, the two Lithuanian cities 100km apart. 

GeoLite2 gets automatically 
updated/downloaded every time the code is git pushed to render.com, via

```js
"postinstall": "bash scripts/fetchdb.sh"
```

It is possible to use MaxMind via http fetch directly, but I believe this is more reliable, despite the automated download of GeoLite2.

The free GeoLite2 version is sufficiently accurate and also provides the accuracy radius, but I do not use the latter.

The commercial version adds more accuracy and location granularity (district and postal code). It can also detect a VPN/Tor/Hosting Provider/Data Center. This is seriously applied in fraud prevention, regional content tailoring, blocking access from sanctioned countries, Tax/VAT calculation by customer location, alcohol/tobacco ads regulation, banking/compliance.

## **Security!**

I have limited my MongoDB collection to 10MB and 200 documents (the free MongoDB Atlas plan provides a lot more, 512MB storage). 

This is a capped collection, the newest document overwrites the oldest one, so an attacker can only flood the server API, but it won't crash the server. 

The frontend is set to retrieve only 50 latest items, all at once, so it should not hang the browser. 

Typically, it will be less than 250KB of data to download. The log is visible to everyone as there is no sensitive data.

If .env leaks/is commited by accident, MaxMind's generated key is compromised. In the worst case scenario, someone can start 
downloading free data from MaxMind building some kind of DDoS on them, resulting in the blocking of the account. 

I doubt a single lost key can DDoS them, and closing a single free plan-account is not a big deal for me either, but it is good to regenerate the key sometimes, at least this is why all this hassle with keys is created there. Downloading their DB puts some pressure on their servers, they do control/monitoring via those keys.

Still unclear what to do with authentication, still no solid answer to DDoS in the commercial setting.

## Debugging Js

Hit F12 in Chrome, set the break points in files and proceed checking `fetch`es and whether their `catch` code paths are reached. The files are:

Frontend: [aabbtree77.github.io/miniguestlog
/sendGuestTimeLoc.js](aabbtree77.github.io/miniguestlog
/sendGuestTimeLoc.js)

Backend: [https://github.com/aabbtree77/miniguestlog/blob/main/src/routes/createGuestRoute.js](https://github.com/aabbtree77/miniguestlog/blob/main/src/routes/createGuestRoute.js)

[VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) is useful when writing Js, i.e. testing the HTTP(S) requests in VS Code. 

Typical timings when everything goes well:

```bash
GET /guests 304 - - 41.458 ms
GET /guests 304 - - 24.816 ms
POST /guest 200 115 - 97.330 ms
POST /guest 200 112 - 26.526 ms
POST /guest 200 112 - 28.124 ms
POST /guest 200 112 - 28.546 ms
POST /guest 200 112 - 28.865 ms
GET /guests 200 3516 - 23.670 ms
```

The MongoDB GUI updates may take several minutes.

## Mermaid

Mermaid diagrams look good for simple diagrams, but I would no longer use them much. See the figure above, the automated node placement is very suboptimal, styling tedious and buggy/nontrivial/non-fun. 

Next time I will use Excalidraw or draw.io (app.diagrams.net). On the other hand, ChatGPT might be able to style and optimize Mermaid diagrams, maybe even generate them.

## A Year Later: 2004

This small web app runs for over a year continuously (since January 2024). It takes one click to redeploy the newest github commit on render.com, but the free plan with cold starts is somewhat annoying. It solves the problem though, I can log my visitors. After all, 
this is for me to see visitor data, not for the masses, I can wait.

MERN (Express) is simpler than metaframeworks, but they all lack built-in authentication and inexpensive hassle-free hosting. [MongoDB](https://www.mongodb.com/pricing) starts at 8 cents/hour for 10GB, while render.com is at least 20$/month just like Vercel. Going serverless is not viable for an indie developer due to the possibility to mess up payment caps. 

~~I plan to go with [Better Auth](https://www.better-auth.com/) and SQLite, all self-hosted on Hetzner. [Turso](https://turso.tech/pricing) looks generous enough at the moment. PocketBase?~~

## Two Years Later: 2025

November 18, 2025, the app got broken. Chrome shows that a fetch from render.com does not work, the log on render.com indicates 
two errors: 

- Newer TLS version is now required by MongoDB Atlas, but it is not supported by the Mongoose ORM deployed on render.com a year or two ago. Here I had to play with the Mongoose connection options in index.js, and nothing worked there. The solution turned out to be not to specify anything TLS related. Remove package-lock.json, rm -rf node_modules, npm install, git push origin main, `clean cache and redeploy manually` on render.com (one button click).

- render.com has managed to add two new IP addresses along with the old ones, which broke the connectivity to Atlas! The solution was to whitelist those new IPs from render.com on MongoDB Atlas.

- Replaced geoip-lite with maxmind/geoip2-node which now downloads a large file on render.com before running the app, a fragile part to watch out.

## Conclusion

One can see why the web is so problematic. Maintaining a small list of visitor locations leads to a lot of moving pieces: 

- MaxMind have changed their API once, which is visible from the ChatGPT hallucination, they might do it again.

- render.com adds new IPs which break MongoDB Atlas. 

- Broken Mongoose ODM due to updated TLS version. 

- Manual "clear build cache and deploy" sometimes is needed on render.com.

Would I recommend this stack, use it commercially? 

Sadly no, as I see no definitive way to protect myself against the DDoS bills.

DDoS is scary, see the case of [Web Dev Cody](https://www.youtube.com/watch?v=-lNpF0ACe1Y).

## To Do?

The code still lacks (left as an exercise to the reader): 

- Authentication, which needs yet another service. [Clerk](https://clerk.com/pricing) looks like a solid option. Beware that it quickly becomes very expensive beyond 10K users. If one is too popular too soon, those two cents per monthly active user can be worse than any DDoS.

- Throttle (request rate limiting).

- Progressive loading (if the list is large).

- Abstraction into a service to be used like Google Analytics.

## References

I have greatly benefited from these works:

[Web Dev Cody: TODO with Authentication.](https://www.youtube.com/watch?v=oJBu2k7OEk8) The React part feels convoluted, and I am not sure about authentication, but my web journey has begun with this code.

[Web Dev Cody: Save Your Time - I deployed Next.js to different services (so you don't have to).](https://youtu.be/ixCEmwH1D8c?t=821)
render.com is completely fine here. Web Dev Cody has a lot of good videos about deployment and SWE. Most of the tools are changing perpetually and this non-convergence and constant exploration become a nightmare. At the moment (November 2025), Hetzner with Dokploy is gaining traction, but something tells me this is not it. I would now go manually with raw VPS + ChatGPT, be it Hetzner or something else.

[Web Dev Cody: I got my first DDoS (and what you can do to help prevent it).](https://www.youtube.com/watch?v=-lNpF0ACe1Y)

Net Ninja: [TODO-I](https://www.youtube.com/watch?v=98BzS5Oz5E4&t=2s), [TODO-II.](https://www.youtube.com/watch?v=WsRBmwNkv3Q&t=1s) MERN with manual bare-bones auth. I like it, but it is probably no longer relevant. Most of the frontend jobs (LT, 2025) demand React with Next.ts.

[EdRoh: MERN Dashboard.](https://youtu.be/0cPCMIuDk2I?t=24251) Shows the deployment on render.com. Unlike some other tutorials, it does not miss an important step that demands whitelisting render.com IP addresses on mongodb.com.

[Rajkumar Gaur: Beautiful Spinner in CSS.](https://medium.com/nerd-for-tech/beautiful-spinner-in-css-bce7a348f50f). It allows to avoid loading images. It had one bug visible when the spinner size was large. See my frontend CSS code around "@keyframes rotate" inside spinner.css at [https://github.com/aabbtree77/aabbtree77.github.io/miniguestlog](https://github.com/aabbtree77/aabbtree77.github.io/miniguestlog). 

Frontend bugs can be located with Chrome's F12 at runtime. Add a break point, click on "Elements", and then enable/disable various CSS properties while observing the result. Imagine we had such debuggability with 3D backends and Make files... I would take dynamic typing over the static any day.

[Josephine Loo: How to Overlay Text on an Image in HTML and CSS.](https://www.bannerbear.com/blog/how-to-overlay-text-on-an-image-in-html-and-css/) If applied directly, it would rotate the message with the spinner. Instead, make a separate div centered at the spinner, and then set a large z-index value of the message div.

[Capped Collections.](https://www.mongodb.com/docs/manual/core/capped-collections/)

[MongoServerError: user is not allowed to do action [collMod].](https://stackoverflow.com/questions/77071661/user-is-not-allowed-to-do-action-collmod-on-db-name-collection-name)

[Retrieve last mongodb entry in nodejs.](https://stackoverflow.com/questions/40769907/retrieve-last-mongodb-entry-in-nodejs)
 
