# Niat Parent Decision Room

Build a professional, responsive web application called "NIAT Parent Decision Room" for a growth experiment for NIAT.

The purpose is to help prospective students and parents understand NIAT using verified public information and prepare for their next admission counselling step.

Create a clean, modern education-tech interface with three connected components:

STUDENT/PARENT FORM
Create a form that collects:

Whether the user is a student or parent

Preferred language

Academic stage

Areas of interest

Main questions or concerns about admissions, fees, university/degree arrangements, curriculum, and career outcomes

Consent to process and store the submitted information

AI DECISION ASSISTANT
Create a results page that displays a personalised decision brief, verified facts, source links, unanswered questions, and recommended next steps. Never invent NIAT fees, eligibility requirements, placement statistics, admission guarantees, or university details. Clearly label any demonstration data.

COUNSELLOR DASHBOARD
Create a dashboard with lead records, user concerns, generated-brief status, lead status, and follow-up tasks. Include filters for concern category and follow-up status.

Make the user journey work as follows:
Landing page → Student/Parent Form → AI Decision Assistant → Saved lead → Counsellor Dashboard.

Initially, use clearly labelled sample data and a mock AI response. Structure the application so that a real AI API and database can be connected in the next step.

Make the design mobile-friendly. Use functional navigation, form validation, loading states, error messages, and empty states. Do not falsely claim that information has been saved or an AI API has been called when it has not.

Do not add unnecessary pages or animations. Prioritise a working end-to-end prototype.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://niat-parent-decision-room.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4fb9b8e6-b2ea-4e3d-b50f-895a9c5616ec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
