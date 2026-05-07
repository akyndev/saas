# Validation Plan

## Goal

Validate whether TutorialLab saves enough tutorial production time to become a real product.

## Primary Validation User

Joseph.

The first test is simple: would Joseph publish the generated video?

## Main Hypothesis

If the product can turn a small working frontend repo into a clean tutorial video, creators will pay because it removes scripting, recording, and editing work.

## What To Test First

### Test 1: Tutorial Plan Quality

Input:

- A small working React or Next.js repo

Output:

- Step-by-step tutorial plan
- Voiceover script
- Recording timeline

Pass condition:

- Joseph agrees the plan is close to how he would teach the project.

### Test 2: Video Output Quality

Input:

- Approved tutorial timeline

Output:

- MP4 tutorial video

Pass condition:

- Joseph would publish it or only lightly edit it.

### Test 3: Time Saved

Measure:

- Time to create tutorial manually
- Time to create tutorial using the product
- Time spent fixing output

Pass condition:

- Product saves at least 50% of production time.

## First Manual Concierge Test

Before building full automation:

1. Pick one small repo.
2. Use AI manually to generate the tutorial plan.
3. Manually create or fake the recording timeline.
4. Produce a sample video.
5. Judge whether the result is worth automating.

This prevents building a complex agent before proving the output is desirable.

## First Sample Tutorials

Suggested samples:

- Animated SaaS landing page in React
- Next.js portfolio with motion effects
- Simple dashboard UI
- Framer Motion hero section
- GSAP scroll animation page

## User Interview Questions

For coding creators:

- How long does one tutorial currently take you from idea to upload?
- Which part do you hate most?
- Do you script before recording or improvise?
- Do you rebuild the project on camera or explain finished code?
- Would you publish an AI-recorded tutorial under your channel?
- What would make the output feel unacceptable?
- Would you pay per video or monthly?

For future company users:

- How often do you need new developer tutorials?
- Who currently writes and records them?
- What does one tutorial cost in time or money?
- Do tutorials help activation or adoption?
- Would you use generated videos for docs, onboarding, or YouTube?

## Pricing Tests

Creator pricing to test:

- $29/video
- $99/month with credits
- Higher monthly plan for course creators

Future company pricing to test:

- $500/month
- $1,000/month
- $2,000/month

## Go Criteria

Keep building if:

- Joseph publishes at least 3 generated videos.
- At least one external creator says they would pay.
- Generated video saves meaningful editing time.
- Small frontend projects can be produced reliably.

Stop or reshape if:

- The video output always needs heavy editing.
- The tutorial plan feels generic or confusing.
- Syncing voice and code is too unreliable.
- Creators only want scripts, not generated videos.

## 30-Day Plan

Week 1:

- Produce one manual sample from a small repo.
- Write the expected timeline format.
- Compare manual tutorial effort vs generated workflow.

Week 2:

- Build a simple renderer or prototype timeline player.
- Generate one video without real desktop automation.
- Test voiceover sync.

Week 3:

- Produce three different tutorial videos.
- Publish or privately review them.
- Track what still requires manual editing.

Week 4:

- Show samples to 5-10 creators.
- Ask for payment intent.
- Decide whether to continue with creator MVP or narrow the scope.
