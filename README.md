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

This MERN app shows the visitors of my homepage at aabbtree77.github.io. To see the list, one must click on the link "Guests" there. There is no "R" in this application, only plain Js. This code is hosted on render.com (with a free plan) and uses a free mongodb.com account to store data. The frontend code is at https://github.com/aabbtree77/aabbtree77.github.io. 

There is nothing safeguarded here as it is hard with raw MERN, but I do not store any sensible information anyway. Only a visitor's time and city is logged. An attacker could easily flood the server endpoint, but I share this code just in case someone would want to build a minimal personal guest log. Do not follow this path to make things run on any paid serverless platforms that price every request and every bit of memory.

Tracking can be accomplished with [Google Analytics](https://en.wikipedia.org/wiki/Google_Analytics) (GA) much quicker and reliably. However, GA stores sensitive data and is banned in many European countries such as France, Finland, Sweden... It is not banned in Lithuania though. The GA interface is bureaucratic and takes time digging, while with this code one can monitor only what is needed in any place without a VPN.

The TunnelBear VPN helps to vary the client IP/location and see if the code reports correct country codes. I use ipify.org with the geoip-lite npm library to detect and convert the IP to the city and country names. It is unclear if the geoip-lite database will be updated on render.com, and how often. One could find some free 3rd party services that detect and convert the IP to location more directly.

All the tools that I have listed in this section are totally free, for now (December 2023).

## MERN

MERN feels a bit low level, but there are a lot of tutorials and hosting is easy thanks to render.com. [Next.js with Supabase](https://www.youtube.com/watch?v=zut46AB8DHQ&t=227s) could be more productive for real business apps with authentication and data relations. 

The client side Js gave me one small headache with an "async double fetch" which had to be nested. 

I did not bother much with Fetch vs Axios, Js vs Ts, also used ChatGPT whenever needed. Fixing Js and CSS problems with console.log() and Chrome F12 tools is a joy compared to working with OpenGL, or reading Weinberg's QFT, despite all the mess with asynchrony, nested callbacks, and dynamic typing. 

The error handling is not tested much. I was only content to make the code work when things run as they should.

During the development, I learned from reddit that Postman API could be in the process of **[enshittification](https://www.reddit.com/r/webdev/comments/16tq1eh/now_that_postman_sucks_is_there_a_good_alternative/)**, and rushed to use VS Code with an extension called [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). The latter is simple and snappy, which I cannot say about VS Code.

## render.com

It is amazing how quickly one can get a fully deployed web app with an HTTPS address when using render.com, but there is a caveat. The cloud shuts down the nodes with the free plan after 15 minutes of any request inactivity: [1](https://community.render.com/t/cold-boot-start-of-the-server-for-first-request/15911), [2](https://docs.render.com/docs/free). Later on, the first request will take the whole minute or two to process (!), the things run smoothly again, until the next inactivity. **This is definitely not going to be a good user experience.** Concerning this web app, I am still content with render.com as it saves a lot of time. I can wait for my personal list of guests to load, but there is no way for the free plan to work in any mission critical scenario.

Deployment is a big factor in the choice of a technology stack.

## References

I have greatly benefited from these works:

[Web Dev Cody: TODO with Authentication.](https://www.youtube.com/watch?v=oJBu2k7OEk8) The React part feels rushed and convoluted, and I am not sure about authentication, but my web journey has begun with this code.

Net Ninja: [TODO-I](https://www.youtube.com/watch?v=98BzS5Oz5E4&t=2s), [TODO-II.](https://www.youtube.com/watch?v=WsRBmwNkv3Q&t=1s) The same thing, but also mildly styled and expanded, with my similar reservations about the authentication part. 

[EdRoh: MERN Dashboard.](https://youtu.be/0cPCMIuDk2I?t=24251) Shows the deployment on render.com. Unlike some other tutorials, it does not miss an important step that demands whitelisting render.com IP addresses on mongodb.com.

The following two notes belong to frontend, but I will mention them here since I do not have a separate memo about my frontend code:

[Rajkumar Gaur: Beautiful Spinner in CSS.](https://medium.com/nerd-for-tech/beautiful-spinner-in-css-bce7a348f50f). I did not want to load any images, so this blog article solved the problem admirably. It had one bug visible when the spinner size was large. See my CSS code around "@keyframes rotate" inside spinner.css at https://github.com/aabbtree77/aabbtree77.github.io/miniguestlog. These bugs are easy to fix with Chrome's F12 at runtime. Add a break point, click on "Elements", and then enable/disable various CSS properties while observing the result. Imagine we had such debuggability with 3D backends and Make files... I would take dynamic typing over the static any day.

[Josephine Loo: How to Overlay Text on an Image in HTML and CSS.](https://www.bannerbear.com/blog/how-to-overlay-text-on-an-image-in-html-and-css/) This is a useful note to center and overlay stuff. To display a loading message with a spinner, I did not go this way as it would rotate the message with the spinner. Instead, I made a separate div centered at the same place as the spinner, and then simply set a large z-index value of this message div.
 
