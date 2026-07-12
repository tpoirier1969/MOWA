window.MOWA_QUESTIONNAIRE = {
  scales: {
    expectation: ["Not at all", "A little", "Somewhat", "Quite a bit", "Very much"],
    importance: ["Not important", "A little", "Somewhat", "Very", "Essential"],
    performance: ["Poorly", "Weakly", "Adequately", "Well", "Very well"],
    value: ["Not valuable", "A little", "Somewhat", "Very", "Essential"],
    readiness: ["Strongly disagree", "Disagree", "Mixed", "Agree", "Strongly agree"]
  },
  sectionOrder: [
    { id: "about", short: "About you" },
    { id: "experience", short: "Your experience" },
    { id: "purpose", short: "What MOWA should do" },
    { id: "delivery", short: "How MOWA is doing" },
    { id: "activities", short: "Activities" },
    { id: "awards", short: "Awards" },
    { id: "future", short: "Future ideas" },
    { id: "involvement", short: "Involvement" },
    { id: "final", short: "Final thoughts" }
  ],
  introScreens: [
    {
      id: "welcome",
      title: "Help shape MOWA’s next chapter.",
      kicker: "Member & board direction questionnaire",
      body: [
        "The Michigan Outdoor Writers Association describes itself as a group of professional outdoor communicators that supports networking, communication skills, career growth, all forms of communication, and the next generation of outdoor media professionals.",
        "MOWA’s public About page also says its bylaws and principles include supporting conservation of Michigan’s natural resources and good sportsmanship in outdoor recreation."
      ],
      links: [
        { label: "Read MOWA’s public bylaws and principles summary", href: "https://miowa.net/about-us/" },
        { label: "Visit the MOWA website", href: "https://miowa.net/" }
      ],
      image: "assets/mentorship-hero.png",
      imageAlt: "Multiple generations of outdoor communicators learning together in a rustic lakeside setting, using a typewriter, notebook, camera, laptop, and smartphone.",
      primaryLabel: "How this works",
      secondaryLabel: "Go straight to the questionnaire"
    },
    {
      id: "how-it-works",
      title: "Why this questionnaire is being done",
      kicker: "How it works",
      bullets: [
        "It asks what people expected from MOWA before asking how well MOWA is delivering.",
        "It looks at MOWA’s activities, awards, membership experience, communication, and possible future directions.",
        "It gives members a chance to say where MOWA has been useful, where it could do more, and whether they want to get involved.",
        "Most pages use simple 1–5 ratings. Contact information is optional and is only for follow-up or volunteer interest."
      ],
      footer: "Results can be summarized for discussion without making the questionnaire feel loaded or accusatory.",
      primaryLabel: "Begin the questionnaire"
    }
  ],
  pages: [
    {
      id: "about-1",
      section: "about",
      part: "1 of 3",
      title: "About you",
      intro: "These questions help separate board, longtime member, newer member, student, supporter, and prospective-member perspectives.",
      fields: [
        { id: "role", type: "radio", required: true, label: "Which best describes your relationship to MOWA?", options: ["Board member", "Active member", "Apprentice member", "Supporting member", "Past member", "Prospective member", "Other"] },
        { id: "mowa_years", type: "radio", label: "How long have you been involved with MOWA?", options: ["Less than 1 year", "1–3 years", "4–10 years", "11–20 years", "More than 20 years", "Not involved yet"] },
        { id: "work_status", type: "radio", label: "Which best describes your outdoor communication work?", options: ["Full-time paid work", "Part-time paid work", "Occasional paid work", "Volunteer / unpaid but serious work", "Student / emerging communicator", "Retired from active outdoor communication", "Supporter, but not a creator"] }
      ]
    },
    {
      id: "about-2",
      section: "about",
      part: "2 of 3",
      title: "About your outdoor communication",
      intro: "Select every kind of outdoor communication that applies to you.",
      fields: [
        { id: "creator_types", type: "checkbox", label: "Which kinds of outdoor communication do you do? Select all that apply.", options: ["Writing / journalism", "Photography", "Video / filmmaking", "Podcasting / audio", "Radio / television", "Blogging / websites", "Social media / digital content", "Books", "Public relations / communications", "Conservation / nonprofit communication", "Tourism / destination communication", "Outdoor education", "I do not produce outdoor communication", "Other"] }
      ]
    },
    {
      id: "about-3",
      section: "about",
      part: "3 of 3",
      title: "Optional background information",
      intro: "These optional questions help show whether different groups have different experiences or priorities.",
      fields: [
        { id: "age_range", type: "radio", label: "Optional: What age range are you in?", options: ["Under 25", "25–34", "35–44", "45–54", "55–64", "65–74", "75+", "Prefer not to answer"] },
        { id: "gender", type: "radio", label: "Optional: How do you describe your gender?", options: ["Woman", "Man", "Nonbinary", "Prefer to self-describe", "Prefer not to answer"] }
      ]
    },
    {
      id: "experience-1",
      section: "experience",
      part: "1 of 3",
      title: "Your MOWA experience",
      intro: "Please rate how well the following statements match your own experience with MOWA.",
      matrixScale: "expectation",
      items: [
        { id: "expectations_met", label: "MOWA has met the expectations I had when I joined, or when I first became interested." },
        { id: "expected_connections", label: "MOWA has helped me feel connected to other outdoor communicators." },
        { id: "expected_growth", label: "MOWA has helped me grow professionally, creatively, or personally." },
        { id: "expected_useful_activities", label: "MOWA has offered activities or opportunities that matter to me." },
        { id: "expected_more_needed", label: "There are additional things I would like MOWA to offer or do." }
      ]
    },
    {
      id: "experience-2",
      section: "experience",
      part: "2 of 3",
      title: "Your MOWA experience",
      intro: "These short written answers help explain the ratings.",
      fields: [
        { id: "join_expectations", type: "textarea", rows: 2, label: "When you joined MOWA, or when you first considered joining, what did you hope MOWA would do for you?" },
        { id: "expectations_best_met", type: "textarea", rows: 2, label: "Where has MOWA been most useful to you?" }
      ]
    },
    {
      id: "experience-3",
      section: "experience",
      part: "3 of 3",
      title: "Your MOWA experience",
      intro: "Please describe where MOWA could be more useful.",
      fields: [
        { id: "expectations_shortfall", type: "textarea", rows: 2, label: "Where has MOWA fallen short of what you hoped for?" },
        { id: "more_for_members", type: "textarea", rows: 2, label: "Is there more MOWA should be doing for you or for members like you?" }
      ]
    },
    {
      id: "purpose-1",
      section: "purpose",
      part: "1 of 3",
      title: "What should MOWA do?",
      intro: "Please rate how important each role should be for MOWA.",
      matrixScale: "importance",
      items: [
        { id: "imp_writers", label: "It should support professional outdoor writers." },
        { id: "imp_multimedia", label: "It should support photographers, videographers, podcasters, website creators, social media creators, and other outdoor media professionals." },
        { id: "imp_craft", label: "It should help members improve their craft." },
        { id: "imp_opportunities", label: "It should help members find professional opportunities, contacts, assignments, or collaborations." },
        { id: "imp_networking", label: "It should provide networking among members, editors, agencies, outdoor organizations, brands, and conservation groups." }
      ]
    },
    {
      id: "purpose-2",
      section: "purpose",
      part: "2 of 3",
      title: "What should MOWA do?",
      intro: "Please continue rating how important each role should be for MOWA.",
      matrixScale: "importance",
      items: [
        { id: "imp_mentoring", label: "It should mentor younger or newer outdoor communicators." },
        { id: "imp_students", label: "It should welcome students and early-career creators." },
        { id: "imp_women_broader", label: "It should welcome more women and a broader range of outdoor voices." },
        { id: "imp_conservation", label: "It should promote conservation, natural resources, clean water, and responsible outdoor recreation." },
        { id: "imp_heritage", label: "It should preserve MOWA history, traditions, memorials, awards, and legacy." }
      ]
    },
    {
      id: "purpose-3",
      section: "purpose",
      part: "3 of 3",
      title: "What should MOWA do?",
      intro: "These answers help identify MOWA’s central purpose and what members most want preserved.",
      fields: [
        { id: "purpose_today", type: "textarea", rows: 3, label: "In one or two sentences, what do you believe MOWA’s main purpose should be today?" },
        { id: "must_not_lose", type: "textarea", rows: 3, label: "In one or two sentences, what should MOWA make sure it does not lose?" }
      ]
    },
    {
      id: "delivery-1",
      section: "delivery",
      part: "1 of 2",
      title: "How is MOWA doing?",
      intro: "Please rate how well MOWA is doing in the following areas.",
      matrixScale: "performance",
      items: [
        { id: "perf_writers", label: "MOWA supports outdoor writers." },
        { id: "perf_multimedia", label: "MOWA supports photographers, videographers, podcasters, websites, digital creators, and other nontraditional outdoor communicators." },
        { id: "perf_craft", label: "MOWA helps members improve their craft." },
        { id: "perf_opportunities", label: "MOWA helps members find opportunities, contacts, assignments, or collaborations." },
        { id: "perf_networking", label: "MOWA provides valuable networking." }
      ]
    },
    {
      id: "delivery-2",
      section: "delivery",
      part: "2 of 2",
      title: "How is MOWA doing?",
      intro: "Please continue rating how well MOWA is doing in the following areas.",
      matrixScale: "performance",
      items: [
        { id: "perf_mentoring", label: "MOWA mentors younger or newer communicators." },
        { id: "perf_students", label: "MOWA welcomes students and early-career creators." },
        { id: "perf_women_broader", label: "MOWA welcomes women and a broader range of outdoor voices." },
        { id: "perf_conservation", label: "MOWA promotes conservation, natural resources, clean water, and responsible outdoor recreation." },
        { id: "member_value", label: "Overall, MOWA has been valuable to me personally." }
      ]
    },
    {
      id: "activities-1",
      section: "activities",
      part: "1 of 2",
      title: "Activities and member experience",
      intro: "Please rate how well the following activities or areas serve members.",
      matrixScale: "performance",
      items: [
        { id: "conference_effectiveness", label: "The annual conference serves members well." },
        { id: "membership_clarity", label: "The membership process is clear and understandable." },
        { id: "welcome_new_people", label: "People who do not already know a MOWA member would feel welcome." },
        { id: "communication_effectiveness", label: "MOWA communicates clearly with members and prospective members." },
        { id: "website_effectiveness", label: "The website helps explain what MOWA is and who belongs in it." }
      ]
    },
    {
      id: "activities-2",
      section: "activities",
      part: "2 of 2",
      title: "Activities and member experience",
      intro: "Please use these written answers to add context or ideas.",
      fields: [
        { id: "conference_improve", type: "textarea", rows: 2, label: "What would make the annual conference more valuable or attractive?" },
        { id: "does_well", type: "textarea", rows: 2, label: "What is MOWA doing especially well?" },
        { id: "not_well", type: "textarea", rows: 2, label: "What is MOWA not doing well enough?" }
      ]
    },
    {
      id: "awards-1",
      section: "awards",
      part: "1 of 2",
      title: "Awards and recognition",
      intro: "Please consider the award categories listed below before answering the questions.",
      awardCategories: [
        { name: "Cliff Ketcham Award", description: "Best Outdoor Feature" },
        { name: "C.A. “Frenchy” Paquin Award", description: "News Related Articles" },
        { name: "Charlie Welch Award", description: "Photography" },
        { name: "Mort Neff Award", description: "Broadcast Media" },
        { name: "James H. Hall Award", description: "Outdoor Activities" },
        { name: "James A. O. Crowe Award", description: "Best Outdoor Column" }
      ],
      matrixScale: "performance",
      items: [
        { id: "awards_reflect_work", label: "The listed award categories reflect the range of work MOWA members create." },
        { id: "awards_support_growth", label: "The awards help encourage stronger work and professional growth." }
      ]
    },
    {
      id: "awards-2",
      section: "awards",
      part: "2 of 2",
      title: "Awards and recognition",
      intro: "Please consider whether the awards represent newer formats and developing communicators.",
      matrixScale: "performance",
      items: [
        { id: "awards_welcome_new_formats", label: "Video, podcasting, websites, newsletters, and other digital work are represented well enough." },
        { id: "awards_recognize_new_voices", label: "Student, apprentice, or emerging-creator work is recognized clearly enough." }
      ],
      fields: [
        { id: "awards_changes", type: "textarea", rows: 2, label: "What award category changes, if any, would make the awards more useful or more representative?" }
      ]
    },
    {
      id: "future-1",
      section: "future",
      part: "1 of 2",
      title: "Potential future activities",
      intro: "Please rate how valuable each of the following ideas would be for MOWA.",
      matrixScale: "value",
      items: [
        { id: "future_website", label: "A redesigned website focused on recruiting new members and explaining member benefits." },
        { id: "future_join_path", label: "A clearer explanation of who belongs in MOWA, including writers, photographers, filmmakers, podcasters, digital creators, and conservation communicators." },
        { id: "future_mentor", label: "A formal mentorship program pairing experienced members with newer creators." },
        { id: "future_student_path", label: "A clearer student or emerging-creator membership path." },
        { id: "future_workshops", label: "Online workshops or webinars on writing, photography, video, podcasting, ethics, freelancing, or digital publishing." }
      ]
    },
    {
      id: "future-2",
      section: "future",
      part: "2 of 2",
      title: "Potential future activities",
      intro: "Please continue rating how valuable the following ideas would be for MOWA.",
      matrixScale: "value",
      items: [
        { id: "future_member_spotlights", label: "A member spotlight series featuring members’ work and projects." },
        { id: "future_partnerships", label: "More partnerships with universities, journalism programs, conservation organizations, tourism groups, agencies, and outdoor brands." },
        { id: "future_new_formats", label: "New or expanded award categories for podcasting, video, websites, newsletters, social storytelling, or photo essays." },
        { id: "future_meetups", label: "Regional meetups or informal gatherings between annual conferences." },
        { id: "future_stronger_social", label: "A stronger social media or public-outreach presence showing member work, events, awards, and ways to join." }
      ]
    },
    {
      id: "involvement-1",
      section: "involvement",
      part: "1 of 2",
      title: "Would you like to be involved?",
      intro: "This is about opportunity, not obligation. Select anything that might interest you.",
      fields: [
        { id: "involvement_interest", type: "checkbox", label: "If MOWA invited more member involvement, which areas might interest you? Select all that apply.", options: ["Membership outreach", "Website or communications help", "Conference planning", "Awards planning", "Mentorship", "Committee work", "Board service", "No additional involvement at this time", "Other"] }
      ]
    },
    {
      id: "involvement-2",
      section: "involvement",
      part: "2 of 2",
      title: "Optional contact information",
      intro: "Leave these fields blank if you prefer not to be contacted. Contact information is only for follow-up or involvement opportunities.",
      fields: [
        { id: "contact_name", type: "text", label: "Optional: What is your name?" },
        { id: "contact_email", type: "email", label: "Optional: What email address should MOWA use to contact you?" },
        { id: "contact_permission", type: "checkbox", label: "If you share contact information, which kinds of follow-up would be okay? Select all that apply.", options: ["Contact me about my response.", "Send information about outreach or communications help.", "Send information about committee or volunteer opportunities.", "Send information about mentoring or being mentored."] }
      ]
    },
    {
      id: "final-1",
      section: "final",
      part: "1 of 3",
      title: "Overall direction",
      intro: "Please rate how strongly you agree or disagree with these statements.",
      matrixScale: "readiness",
      items: [
        { id: "urgency_membership", label: "Attracting new members is important for MOWA’s future." },
        { id: "urgency_relevance", label: "MOWA should pay attention to how outdoor communication is changing." },
        { id: "urgency_preserve_and_update", label: "MOWA can preserve what matters while updating how it serves members and welcomes new people." },
        { id: "urgency_member_voice", label: "Member priorities should help guide MOWA’s activities and outreach." }
      ]
    },
    {
      id: "final-2",
      section: "final",
      part: "2 of 3",
      title: "Priorities",
      intro: "Please identify the most important steps for attracting and serving members.",
      fields: [
        { id: "single_most_important_new_members", type: "textarea", rows: 2, label: "What is the single most important thing MOWA should do to attract new members?" },
        { id: "single_most_important_existing_members", type: "textarea", rows: 2, label: "What is the single most important thing MOWA should do to better serve existing members?" }
      ]
    },
    {
      id: "final-3",
      section: "final",
      part: "3 of 3",
      title: "Looking ahead",
      intro: "Use these final questions to describe what success would look like.",
      fields: [
        { id: "single_most_important_relevant", type: "textarea", rows: 2, label: "What is the single most important thing MOWA should do to stay relevant as outdoor media changes?" },
        { id: "five_years", type: "textarea", rows: 3, label: "What should MOWA look like five years from now?" },
        { id: "additional_comments", type: "textarea", rows: 3, label: "Is there anything else you would like MOWA’s members or board to consider?" }
      ]
    }
  ],
  gapPairs: [
    { label: "Support outdoor writers", importance: "imp_writers", performance: "perf_writers" },
    { label: "Support multimedia and digital creators", importance: "imp_multimedia", performance: "perf_multimedia" },
    { label: "Craft improvement", importance: "imp_craft", performance: "perf_craft" },
    { label: "Opportunities and collaborations", importance: "imp_opportunities", performance: "perf_opportunities" },
    { label: "Networking", importance: "imp_networking", performance: "perf_networking" },
    { label: "Mentoring newer communicators", importance: "imp_mentoring", performance: "perf_mentoring" },
    { label: "Students and early-career creators", importance: "imp_students", performance: "perf_students" },
    { label: "Women and broader outdoor voices", importance: "imp_women_broader", performance: "perf_women_broader" },
    { label: "Conservation and responsible recreation", importance: "imp_conservation", performance: "perf_conservation" }
  ]
};
