# Customer Review Transcript — Sprint 4

**Date:** 2026-06-27
**Format:** Video call
**Participants:** Team (Iaroslav M., Zakhar G., Alisa K., O. Frolovskaia), Iaroslav M. - Interviewer; Customer: Valerii, Anya
**Recording:** Permitted by customer. Private instructor sharing: permitted. Publication in repository: permitted (confirmed separately, not on recording).

*Note: transcript cleaned for readability. Filler words, crosstalk, and off-topic exchanges removed. No timestamps available in the source recording. PII redacted.*

---



**[Iaroslav]:** Valerii and Anya, we will be recording the meeting. Any objections?

**[Valerii]:** None.

**[Anya]:** No, we are not against it.

**[Iaroslav]:** Thank you. So, to start, we would like to show the current version of the portal. The link is the same, I will share it again. This week we connected the frontend to the backend. Some questions came up along the way. I will send you the admin password now. It would be great if you could run the demo, by the way.

**[Anya]:** Yes.

**[Iaroslav]:** I can run the demo, but according to our requirements, we need you to click through the site and look at it yourselves.

**[Valerii]:** Sure.

**[Iaroslav]:** I can do that.

**[Valerii]:** Go ahead.

**[Anya]:** You do the demo, and we will just click through after the call.

**[Valerii]:** Yes.

**[Iaroslav]:** Alright. Can you see my screen now?

**[Anya]:** Yes, we can see it.

**[Valerii]:** Yes.

**[Iaroslav]:** So here is the site. The Kanban board and the forms look like this.

**[Valerii]:** Yes, cool.

**[Iaroslav]:** For the forms there are different question types. As far as I know, there is CSV export. You can publish a form. It will show whether it is published or not. If we close it, it gets unpublished. This is actually one of the things we wanted to discuss. In the responses section, the logs are shown here. There are two export options — CSV and Excel. Both are implemented on the frontend. On the technical side, nothing is sent to the backend — what was loaded initially stays loaded. So we save server resources. For events, you can specify age, location, and similar fields.

**[Valerii]:** Wow.

**[Iaroslav]:** The events section and all of that.

**[Anya]:** Age? Why do we need age?

**[Valerii]:** In case we have an 18+ event, of course.

**[Iaroslav]:** Originally we added it just in case, because some events are 18+. It does happen.

**[Valerii]:** That is true, we do have 18+ discos.

**[Anya]:** Yes, we do have discos that SU organizes that are 18+.

**[Valerii]:** Right. Though these are not only SU events — there will also be city events, I think. Or only SU? Well, it makes sense. Fine, never mind.

**[Anya]:** It is an SU site.

**[Valerii]:** We should remove it. Yes, remove it.

**[Iaroslav]:** Yes, if—

**[Anya]:** Same with the format field. They are in 99.9% of cases offline.

**[Iaroslav]:** So we remove that too?

**[Anya]:** If it is online, sure, mention it. But otherwise remove it.

**[Iaroslav]:** On the age field — if it is not specified, it automatically defaults to 0+. It was added just in case. But yes, we can remove it without any problem. As for Kanban—

**[Anya]:** Yes, and location can also be removed, because locations are usually not known in advance. It is much simpler to just write it in the description when it is available.

**[Iaroslav]:** Understood, all good.

**[Anya]:** It is easier to just write it in the description — something like "it will be there at some point."

**[Iaroslav]:** Yes, agreed. Now, a question about the Kanban board. Should we only have one Kanban board? As you can see, it is named SU Core. Should we create separate boards for other departments?

**[Valerii]:** No.

**[Iaroslav]:** So we keep only one.

**[Anya]:** I would leave it as is for now. If we need one for the active members later, we can add it then.

**[Iaroslav]:** Yes.

**[Valerii]:** That makes sense.

**[Anya]:** It can be replicated easily when needed.

**[Iaroslav]:** Yes, it will be the same structure, just...

**[Anya]:** Exactly.

**[Iaroslav]:** About the donations page — we are still waiting for the content to put there. Just a QR code and that is it. Nothing more.

**[Anya]:** Yes, but the QR code should be large and centered on the screen.

**[Iaroslav]:** Yes, we can center it without any problem. Also, if you have admin status, you can edit content directly from here in case something changes quickly. Regarding questionnaires — a question: from the student's perspective, if a new questionnaire appears from the Student Union, should it be hidden completely after the student submits it?

**[Anya]:** How would you remember that? The person closes the page, opens it again, and the questionnaire is still there.

**[Iaroslav]:** We could try using cookies to track that. It is also a question of how we remember what they did. If we keep it fully anonymous, we leave it as is. If we add an option for the user to identify themselves by email or name, then we could implement remembering their submission.

**[Anya]:** Actually—

**[Valerii]:** You would need to store a cookie for each questionnaire if you want to track this.

**[Iaroslav]:** That is also true.

**[Anya]:** Yes. I would not over-engineer this. It is not a very necessary feature. The person submitted it — great. Done.

**[Valerii]:** I would not track it either.

**[Iaroslav]:** Yes. Just leave it as is. All good. For members — there was one question. I will fill this in quickly. The question is about the delete member button — should it stay?

**[Anya]:** Do we want to be able to drop members from the view cards?

**[Valerii]:** No, no, no, no. Look, this is such a corner case — the whole history is everyone who was ever in the SU. The only scenario where a delete button makes sense is if some random person got into the system by mistake. But that is such a corner case that someone can just go into the database and delete them manually.

**[Iaroslav]:** Yes, that is exactly why we raised it — because deleting a member means a full hard delete from the database.

**[Anya]:** I would replace delete with edit, so you can change a member's information if needed. And I would add something like a status or role — active member or someone who is no longer in the team. Like alumni or something.

**[Valerii]:** Yes, yes, yes.

**[Anya]:** What is the word for that?

**[Iaroslav]:** Technically, that would be implemented in the admin panel. It would not be done directly from the public members page. Adding a member would also be moved there. For history — same thing. You can just fill it in. We are still waiting for the content, but we can leave it empty for now and fill it in later.

**[Anya]:** One question — I see a lot of tabs at the top. Why do we not merge some of them? For example, for questionnaires — if a user is logged in, they get extra functionality on the page. If not, they just do not see it. Why do we put all these tabs at the top?

**[Iaroslav]:** Yes, Anya, you are actually anticipating exactly what I wanted to discuss. Right now the admin panel is exposed like this just for debugging. In the final version it will be removed. As we agreed before, you just go to /admin and get redirected to /admin/login. Only after that do these buttons appear.

**[Anya]:** I see. But I was talking more about why we have separate tabs at all. Can we not just have one Questionnaires tab, and if the user is logged in, they get some extra functions, and if not, they just do not see those functions?

**[Valerii]:** Anya is talking about the buttons on the page itself — like an "Add" button. So everyone has the Questionnaires page, but the admin additionally sees a "Create" button on that page.

**[Anya]:** Yes, exactly.

**[Valerii]:** I actually prefer your current approach.

**[Anya]:** Why?

**[Valerii]:** I just like it more. Stylistically.

**[Iaroslav]:** We can do it either way. But having a separate form for creating questionnaires and another for viewing them will be more intuitive for new SU members — they can clearly see what the questionnaire looks like for everyone.

**[Valerii]:** Like a preview of how participants see it.

**[Anya]:** Well, alright.

**[Iaroslav]:** We can change it either way. Right now one form is implemented — we can adjust it.

**[Anya]:** I am not sure. What does Valerii think?

**[Valerii]:** I prefer what they have now. I like it.

**[Anya]:** Okay, let us keep it then. But I personally find it unclear what the difference is between Questionnaires, Forums, and Responses.

**[Valerii]:** We could rename them slightly. But it is fine. I prefer it this way. Let us keep it, please.

**[Iaroslav]:** Okay, then—

**[Anya]:** I would at least merge Forms and Responses into one, so you have Manage Events and Manage Questionnaires.

**[Valerii]:** That works.

**[Iaroslav]:** Yes. So we name it something like Questionnaires Admin Panel or similar.

**[Anya]:** Something like Manage Questionnaires, so you have Manage Events and Manage Questionnaires.

**[Iaroslav]:** Yes, all good. Moving on — for events, same idea. From Manage Events you can edit things inside. From here you can add an event directly if you are an admin. Current and past events — all standard. One question about the main page — as you can see, it is currently showing an error. Also, Valerii, I remember you wanted to talk about the backend. We have now implemented a retry button on all pages that can show errors. Should we remove it in the future?

**[Valerii]:** Of course, naturally.

**[Iaroslav]:** All good. Right now it shows a 404 because we have not agreed yet on how to implement that endpoint. What should appear in the main page updates section?

**[Valerii]:** Let us just show the last four events.

**[Iaroslav]:** So just events?

**[Valerii]:** Yes, the last four. Yes.

**[Iaroslav]:** The last four. All good. Also, we would like to know how you feel about the current main page of the Student Union portal.

**[Valerii]:** Are the departments clickable?

**[Iaroslav]:** Right now, clicking on a department redirects to Members.

**[Valerii]:** Yes.

**[Anya]:** Why do we have this buffer step?

**[Iaroslav]:** This one here?

**[Anya]:** Yes, this part. Why do we need to click two buttons instead of one to get to the full description?

**[Iaroslav]:** The short description? That can be removed too. Yes.

**[Anya]:** I think it would be better to show the short description directly on the main page, and clicking on a department should go straight to the full department page. That would be more user-friendly.

**[Iaroslav]:** Yes, that makes sense. And then on the Members tab with all the departments, we should add a description there too, right?

**[Valerii]:** Yes.

**[Anya]:** Yes.

**[Iaroslav]:** All good.

**[Anya]:** Also — will the main page have anything in the header besides the departments? You start with the team, but would you not want to add something about the Student Union itself? Just a phrase or a short description of what the Student Union is.

**[Iaroslav]:** We could — personally I was thinking we could insert the history section there so it shows statically. Or we could add a separate editable banner that admins can update and place it there.

**[Anya]:** I would prefer something like a banner with a short, punchy phrase or sentence about the Student Union. Something that catches your attention when you open the page — not the departments first, but something concise and impactful about the SU.

**[Iaroslav]:** Yes, we can implement that without much effort. I think that covers everything from us.

**[Valerii]:** I think we are done too.

**[Iaroslav]:** To summarize — what we need to do: add a banner to the main page, implement the last four events in the updates section, remove the intermediate click so departments redirect directly, add a description on the Members page, and in the admin panel rename and merge the buttons.

**[Valerii]:** Yes, yes, yes.

**[Anya]:** One more question — what is the difference between the Events tab and Manage Events? Because on the Events tab there is also a create button.

**[Iaroslav]:** Right now the difference is that Manage Events also has an edit option. From the Events tab you can quickly add an event.

**[Valerii]:** Yes.

**[Iaroslav]:** If we go with Manage Questionnaires for consistency, we will probably remove the create event button from the Events page and keep it only in the manager. How does that sound?

**[Valerii]:** Great.

**[Anya]:** Yes, that works.

**[Iaroslav]:** All good. And on the next meeting we will show that the admin panel is fully hidden. Actually, let me check if I can show that from the browser right now. One moment. Now you can see — the layout is adaptive. It adjusts like this.

**[Valerii]:** Very cool.

**[Iaroslav]:** That is everything from our side.

**[Valerii]:** Alright, goodbye everyone.

**[Iaroslav]:** Thank you for the meeting.

**[Anya]:** Thank you everyone. Bye-bye.

**[Iaroslav]:** Bye.