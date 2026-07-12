# Sprint Review Transcript — Week 6

**Date:** 2026-07-11

**Participants:** Iaroslav M., Zakhar G., Anna (Customer), Alisa K., Olga F. 

**Format:** Video call (recording permitted)

---


**Iaroslav:** Anna, hi!

**Anna:** Hi!

**Iaroslav:** So, today is going to be a short meeting. First, Anna, we'll be recording the meeting — is that okay?

**Anna:** Yeah, no problem.

**Iaroslav:** Basically, we can just show that some bugs have been fixed. Initially, it loaded from the first member and there was a pop-up window. We've fixed that now. Also, photos now load properly — they don't stretch anymore, they work with that background. There are different backgrounds for different departments. That's also just a minor thing. Actually, we wanted to ask about fine-tuning — what backgrounds to use and stuff like that. But it's literally one fix.

**Anna:** Well, technically I don't really care how it looks visually — who's in charge of design on your side?

**Iaroslav:** Yeah, but it's fixed with one line of code, so it's not a big deal. With events, we can also upload a photo now, as far as I remember. But that will be done the same way. Creation, questions, donations — all the same, the Kanban hasn't changed. This will be fixed later — actually, it's already being fixed — so that we can conditionally do it here on questions with options.

**Iaroslav:** And not just with text. There will be graphs. So the question is: should we do it, and what type of graph?

**Anna:** Probably a pie chart — a circular one. To see the ratio. Yeah, let's go with a pie chart for now.

**Zakhar:** Basically, there's not much else to show. I was told there were some questions about bugs. Zakhar, if you could help me — what bugs were mentioned at the last meeting?

**Zakhar:** From the last meeting, we had bugs in the mobile version. We fixed them. Now there are no duplicate buttons with events. Everything should be great.

**Zakhar:** On the mobile version.

**Zakhar:** Yes. All on the mobile version. Also, we're gradually moving away from the site testing stage, so Iaroslav, could you please log out of the admin panel?

**Zakhar:** Ah, yes, if anything, it's all removed now and there are no buttons — you have to write directly here. Actually, it should be written like this: admin login. But logically, we can just write it. I think we can even write, yes, here, no.

**Zakhar:** Anyway, it doesn't really matter. We're just moving away from those test buttons.

**Anna:** Uh-huh.

**Zakhar:** Also, events are ready. So there are past ones and active ones. You can create, remove, delete them. Iaroslav, could you open it, please? Here you can see that you don't have to write an event in one go — you can add information later.

**Zakhar:** And only then publish it. So it's like a draft system.

**Anna:** Uh-huh.

**Zakhar:** Right. Then about members — we have... Could you switch, please?

**Zakhar:** Other members, into the regular ones.

**Zakhar:** Here. As we said, we moved several people into Support, as was suggested at the meeting, as far as...

**Anna:** Support. Why are they called Support?

**Iaroslav:** Well, that can also be changed. I was told that someone just said it needed to be set up.

**Zakhar:** I don't remember exactly what it was supposed to be called — it's just named that for now. Anyway, we moved them.

**Anna:** Yeah, yeah.

**Zakhar:** Yeah, we kind of rushed through that back then. So anyway, we moved CEO and some other people — I don't exactly remember that part — into a separate section. So we did that. We also talked about image parameters. Uploading images — as before, you can use different ones. Different sizes, different formats, even GIFs.

**Anna:** Uh-huh.

**Zakhar:** Right.

**Iaroslav:** Oh no, GIF files are limited.

**Zakhar:** Well, I uploaded GIFs and it seemed fine. I don't remember if they actually played or not.

**Iaroslav:** Well, anyway, the full version has different information. Also, regarding the technical side, there are some things worth discussing. Right now in our code, first of all, Dima fixed XSS vulnerabilities well. Now we only accept requests that should be accepted. Initially, everything went through Pydantic before reaching the database. So the site basically can't crash if...

**Iaroslav:** ...someone puts some conditional SQL or injection into the survey text — it won't crash. Regarding how we're going to hand over the project. Right now in the codebase, there are about 13 SQL migrations due to code improvements. Should we remove all these migrations, completely remove our test data, and redo the schema for the final project?

**Anna:** I don't really understand what you mean by "redo the schema for the final project."

**Iaroslav:** I mean, we had the original database schema that we created initially, and then, because of meetings, we added migrations to keep the database from failing. When handing over the project, we remove all these migrations and just update the schema, right?

**Anna:** Well, generally speaking, yes, that's better.

**Iaroslav:** Okay. Great. Well, Zakhar, since you were at the last meeting...

**Zakhar:** Over here, please. Yes, yes, yes, over here. Into the regular one. Hello, hello, hello, hello, hello. Can you hear me?

**Anna:** Well, yes.

**Zakhar:** Ah, okay. So that's Iaroslav's part. Anyway, we removed that table with nine out of twenty.

**Iaroslav:** So I go to — Anna, I can send it now. Honestly, I didn't fully understand how the links were duplicated. Not links, but buttons, to be precise, on the mobile version. But now I can send it to the Telegram chat that this bug has been fixed.

**Anna:** Uh-huh.

**Iaroslav:** Can you see?

**Anna:** Iaroslav, can you even hear us?

**Iaroslav:** I... Yes, I can hear you.

**Anna:** Oh, good.

**Iaroslav:** What's up? Everything okay?

**Anna:** Well, before that, you couldn't hear me. At least I could hear Zakhar, but you couldn't. We thought your connection dropped. Oh, never mind.

**Iaroslav:** Now, by the way, I can hear Zakhar.

**Zakhar:** Go ahead and switch to cache. Ah.

**Anna:** Okay. Uh-huh.

**Zakhar:** Basically, these are the previous fixes we had.

**Anna:** One more question. I saw while you were on the events page — there's a display of "live." What does "live" mean? There on the top right, in the corner, in red.

**Iaroslav:** "Live" — we can either finish that logic or remove it entirely so that it shows the events that are happening right now. Actually, Anna, should we remove it completely or finish that logic?

**Anna:** You can leave it. Why not?

**Iaroslav:** Okay, then we'll finish it.

**Zakhar:** All good. So, on the feedback.

**Zakhar:** Can you hear me?

**Iaroslav:** Yes, now I can.

**Zakhar:** Right. So, on the feedback from the last call — that's all. Uh-huh. If there are any questions, ask away. This call should probably be about handing over the project already.

**Anna:** I don't really have any questions. About the handover — we haven't really thought about how we plan to receive the codebase. I think we'll just start by taking a snapshot of your repository when we begin working.

**Zakhar:** Right. Uh-huh.

**Anna:** Probably that's it for now. I don't think any additional handover documentation is needed. Well, there should probably be a normal rhythm so we understand what's happening on your side. I don't know — if you have a Swagger, that should also be there so we can see what endpoints exist.

**Zakhar:** Right.

**Anna:** Probably that's the minimum for now.

**Iaroslav:** Yeah, we wrote it on FastAPI, so we do have Swagger. Uh-huh. We have separate documentation for the backend — I don't remember us doing one for the frontend. And in the end, yes, we can fully make it right now — there are just commands on how to run the project. Further, most likely, we can make documentation for each module.

**Zakhar:** Uh-huh.

**Iaroslav:** And that's basically it from our side.

**Anna:** Well, good — I don't have any questions or corrections either.

**Zakhar:** Uh-huh. Wrap it up.

**Anna:** Yes, thank you for the meeting. Bye-bye, everyone.

**Zakhar:** Thank you too. Okay, bye-bye.

**Zakhar:** Right.
