# Sprint Review Transcript — Week 7

**Date:** 2026-07-18

**Participants:** Yaroslav M., Anna (Customer), Zakhar G., Alice K., Olga F.

**Format:** Video call (recording permitted)

---

**Yaroslav:** Alright, hi everyone. We were just going off-topic. A small discussion. So, right away, Alice, you can turn on the recording. Yeah. We won't be the ones hosting the recording. Any objections?

**Anna:** No, none.

**Yaroslav:** Great. So, today is our last meeting within the SWP framework. Basically, there was one question — you see the page I launched right now?

**Anna:** Yes.

**Yaroslav:** This is personally what I fixed locally. Should we keep this design — oh, no — make this design, or keep the old one?

**Anna:** It seems like the old one was better.

**Yaroslav:** Alright, then there won't be any major issues. In principle, we won't really need the demo going forward. We were supposed to have more technical things to discuss anyway. Regarding the repository itself. Actually, no, I'll turn on the demo after all. It'll just be more code-oriented. Look, first of all, regarding our tech stack. We learned during the SVP demo that other teams from the Student Council used Java as the backend language and Spring. We used Python and FastAPI. Uh-huh. Just for context. Regarding the project handover. I remember we talked about this — you, or Valera, will just fork the ready-made project, right?

**Anna:** Yes, yes, exactly.

**Yaroslav:** Okay, then there shouldn't be any issues. And regarding virtual — no, we shouldn't say that on record. Basically, we used PostgreSQL as the database. We also used YAML files. We have a Compose for production, and a local one for local development if needed in the future. We introduced a changelog quite well. In principle, everything is written here. The guys worked on commits, and each change was made in its own commit, so if anything, you can remove or add something. If it comes to that, the site is already ready for use.

**Zakhar:** Uh-huh.

**Anna:** Okay.

**Yaroslav:** Tests are done via PyTest, and Playwright was used for the frontend. Are there any questions?

**Anna:** Not really. I'd just like to go over it once more. What do you have in terms of functionality in the end? Surveys, events, backlog.

**Yaroslav:** Oh, let me open it for clarity, okay? The main site probably won't open for me right now because there are connection issues due to me connecting via VPN. But we have events, members — they're all already included on the main site: forms, donation page, Kanban. Also, viewing responses, filling out responses, event management, member management. Uh-huh.

**Anna:** Uh-huh. Great.

**Yaroslav:** We used backlog for photos, if that matters. Honestly, I'm not sure what's used in Java on Spring Boot for loading photos. But that's also one of the differences between our project and others.

**Anna:** Well, backlog was originally specified in the stack, so I think other teams used it too.

**Yaroslav:** Ah, it was? Okay.

**Anna:** In principle, we can also mention that we used a fully graphical design, meaning we didn't use SVG design conventionally. Because of this, the site loads much faster, but at the same time, it's still possible to rework it if you want more design-oriented solutions. So, if you want to make the site a little prettier, the modest use of SVG won't really slow down the site speed.

**Yaroslav:** Uh-huh. Good.

**Anna:** Then, oh, also we used Pages for full CI/CD and all that. Should we show our pipeline?

**Yaroslav:** Oh, probably not the pipeline. I can ask how you build it? Just because you have the regular one and the production one.

**Yaroslav:** Yes, so look, we have a Compose YAML and a Compose local YAML. Compose-local builds images from whatever is on your computer each time if you're doing it locally. And Compose pulls from GitHub from those packages.

**Anna:** Uh-huh.

**Yaroslav:** That is, from what's already there — right here we have our text, our release. So conditionally, it will pull the image from the latest release.

**Anna:** Okay. And does the build happen on VMs?

**Yaroslav:** Sorry, say that again?

**Anna:** Does the build happen on VMs or not?

**Yaroslav:** The image build?

**Anna:** Uh-huh.

**Yaroslav:** Oh, no, that's exactly the package image. It just pulls it.

**Anna:** All good.


**Anna:** And in principle, I don't have any more questions.

**Yaroslav:** Same here — if we just want to discuss something technical, we can dive into technical details.

**Anna:** There doesn't seem to be much technical stuff to discuss, because obviously we won't be discussing the frontend with you. It's clear that for us as clients, things like releases and so on are more important, but I already asked about that. In general...

**Yaroslav:** The only thing I can say about the frontend is that yes, it's fully graphical design made through conventional gradients. So again, all of that can be changed at your discretion as the client.

**Anna:** Uh-huh. Okay.

**Yaroslav:** Then we're all set. Alice, Zakhar, any questions? Or comments? Nothing at all. Alice is apparently just recording and has no comments either. Yeah. One more thing — just a reminder about the handover. When we'll do it.

**Anna:** I don't really understand in terms of when, because if we're going to fork, I don't think it's critical.

**Yaroslav:** I'm asking because if you fork, we would remove all migrations on our side and put everything into the initial schema. So that you have a fully working and clean code.

**Anna:** Weren't you planning to do that already? I think you asked me about that before.

**Yaroslav:** Yes, yes, we did ask. It's just that a few more migrations were added recently because we fixed some bugs and added a few features — there was some automation for the Kanban. So just so we know, you can tag one of us in the chat, either you or Valera. And by that time, most likely this will be done either today or tomorrow.

**Anna:** With the migrations. Well, we're not going to fork this week anyway, so... Uh-huh. You're just finishing up the project until the end of the project, and we'll fork the ready version later.

**Yaroslav:** Yes, yes, that's it. I have no comments or questions left.


**Yaroslav:** Well then, thank you for the project, so to speak.

**Anna:** Thank you too.

**Yaroslav:** Alright, have a good day. We're done. Bye-bye-bye. Thanks everyone.

**Zakhar:** Bye-bye.