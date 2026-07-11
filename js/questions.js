window.MOWA_QUESTIONNAIRE = {
  scaleLabels: {
    importance: ["Not important", "Slight", "Moderate", "Very", "Essential"],
    performance: ["Poor", "Weak", "Adequate", "Good", "Excellent"],
    value: ["Not valuable", "Slight", "Moderate", "Very", "Essential"],
    expectation: ["Not at all", "A little", "Partly", "Mostly", "Fully"],
    urgency: ["Not urgent", "Slight", "Moderate", "Very", "Critical"],
    concern: ["Not concerned", "Slight", "Moderate", "Very", "Extreme"],
    fit: ["Not much", "A little", "Somewhat", "Well", "Very well"]
  },
  sections: [
    {
      id: "profile",
      eyebrow: "Part 1",
      title: "About you",
      intro: "These questions help compare board, member, apprentice, supporter, and prospective-member perspectives.",
      questions: [
        { id: "role", type: "radio", required: true, label: "What is your relationship to MOWA?", options: ["Board member", "Active member", "Apprentice member", "Supporting member", "Past member", "Prospective member", "Other"] },
        { id: "mowa_years", type: "radio", label: "How long have you been involved with MOWA?", options: ["Less than 1 year", "1–3 years", "4–10 years", "11–20 years", "More than 20 years", "Not involved yet"] },
        { id: "creator_types", type: "checkbox", label: "What types of outdoor communication do you do? Select all that apply.", options: ["Writing / journalism", "Photography", "Video / filmmaking", "Podcasting / audio", "Radio / television", "Blogging / websites", "Social media / digital content", "Books", "Public relations / communications", "Conservation / nonprofit communication", "Tourism / destination communication", "Outdoor education", "I do not produce outdoor communication", "Other"] },
        { id: "work_status", type: "radio", label: "Which best describes your outdoor communication work?", options: ["Full-time paid work", "Part-time paid work", "Occasional paid work", "Volunteer / unpaid but serious work", "Student / emerging communicator", "Retired from active outdoor communication", "Supporter, but not a creator"] },
        { id: "age_range", type: "radio", label: "Optional: What age range are you in?", options: ["Under 25", "25–34", "35–44", "45–54", "55–64", "65–74", "75+", "Prefer not to answer"] },
        { id: "gender", type: "radio", label: "Optional: How do you describe your gender?", options: ["Woman", "Man", "Nonbinary", "Prefer to self-describe", "Prefer not to answer"] }
      ]
    },
    {
      id: "purpose",
      eyebrow: "Part 2",
      title: "What should MOWA do?",
      intro: "Rate how important each role should be. This establishes expectations before asking how well MOWA is delivering.",
      questions: [
        { id: "imp_writers", type: "scale", scale: "importance", label: "Support professional outdoor writers." },
        { id: "imp_multimedia", type: "scale", scale: "importance", label: "Support photographers, videographers, podcasters, website creators, social media creators, and other outdoor media professionals." },
        { id: "imp_craft", type: "scale", scale: "importance", label: "Help members improve their craft." },
        { id: "imp_opportunities", type: "scale", scale: "importance", label: "Help members find professional opportunities, contacts, assignments, or collaborations." },
        { id: "imp_networking", type: "scale", scale: "importance", label: "Provide networking among members, editors, agencies, outdoor organizations, brands, and conservation groups." },
        { id: "imp_mentoring", type: "scale", scale: "importance", label: "Mentor younger or newer outdoor communicators." },
        { id: "imp_students", type: "scale", scale: "importance", label: "Welcome students and early-career creators." },
        { id: "imp_women_broader", type: "scale", scale: "importance", label: "Welcome more women and a broader range of outdoor voices." },
        { id: "imp_conservation", type: "scale", scale: "importance", label: "Promote conservation, natural resources, clean water, and responsible outdoor recreation." },
        { id: "imp_heritage", type: "scale", scale: "importance", label: "Preserve MOWA history, traditions, memorials, awards, and legacy." },
        { id: "purpose_today", type: "textarea", label: "In one sentence, what do you believe MOWA’s main purpose should be?" },
        { id: "must_not_lose", type: "textarea", label: "In one sentence, what should MOWA make sure it does not lose?" }
      ]
    },
    {
      id: "expectations",
      eyebrow: "Part 3",
      title: "Your expectations and experience",
      intro: "This section asks whether MOWA has delivered what members hoped for when they joined or first became interested.",
      questions: [
        { id: "join_expectations", type: "textarea", label: "When you joined MOWA, or when you first considered joining, what did you hope MOWA would do for you?" },
        { id: "expectations_met", type: "scale", scale: "expectation", na: true, label: "How well has MOWA met those expectations?" },
        { id: "expectations_best_met", type: "textarea", label: "Which expectations has MOWA met best?" },
        { id: "expectations_shortfall", type: "textarea", label: "Where has MOWA fallen short of what you hoped for?" },
        { id: "more_for_members", type: "textarea", label: "Is there more MOWA should be doing for you or for members like you?" },
        { id: "member_value", type: "scale", scale: "performance", na: true, label: "Overall, how valuable has MOWA been to you personally?" }
      ]
    },
    {
      id: "delivery",
      eyebrow: "Part 4",
      title: "How well is MOWA serving members?",
      intro: "Rate how well MOWA is delivering in each area. The most useful findings come from comparing these scores with the expectation scores.",
      questions: [
        { id: "perf_writers", type: "scale", scale: "performance", na: true, label: "Supporting outdoor writers." },
        { id: "perf_multimedia", type: "scale", scale: "performance", na: true, label: "Supporting photographers, videographers, podcasters, websites, digital creators, and other nontraditional outdoor communicators." },
        { id: "perf_craft", type: "scale", scale: "performance", na: true, label: "Helping members improve their craft." },
        { id: "perf_opportunities", type: "scale", scale: "performance", na: true, label: "Helping members find opportunities, contacts, assignments, or collaborations." },
        { id: "perf_networking", type: "scale", scale: "performance", na: true, label: "Providing valuable networking." },
        { id: "perf_mentoring", type: "scale", scale: "performance", na: true, label: "Mentoring younger or newer communicators." },
        { id: "perf_students", type: "scale", scale: "performance", na: true, label: "Welcoming students and early-career creators." },
        { id: "perf_women_broader", type: "scale", scale: "performance", na: true, label: "Welcoming women and a broader range of outdoor voices." },
        { id: "perf_conservation", type: "scale", scale: "performance", na: true, label: "Promoting conservation, natural resources, clean water, and responsible outdoor recreation." },
        { id: "does_well", type: "textarea", label: "What is MOWA doing well?" },
        { id: "not_well", type: "textarea", label: "What is MOWA not doing well enough?" }
      ]
    },
    {
      id: "activities",
      eyebrow: "Part 5",
      title: "Activities, awards, and programs",
      intro: "This section looks at major MOWA activities and asks whether they serve what members care about.",
      questions: [
        { id: "conference_importance", type: "scale", scale: "importance", label: "Importance of the annual conference." },
        { id: "conference_effectiveness", type: "scale", scale: "performance", na: true, label: "Effectiveness of the annual conference." },
        { id: "conference_improve", type: "textarea", label: "What would make the annual conference more valuable or attractive?" },
        { id: "award_note", type: "note", label: "MOWA’s listed Excellence in Craft categories include: Cliff Ketcham Award — Best Outdoor Feature; C.A. “Frenchy” Paquin Award — News Related Articles; Charlie Welch Award — Photography; Mort Neff Award — Broadcast Media; James H. Hall Award — Outdoor Activities; and James A. O. Crowe Award — Best Outdoor Column." },
        { id: "awards_importance", type: "scale", scale: "importance", label: "Importance of craft or excellence awards." },
        { id: "awards_effectiveness", type: "scale", scale: "performance", na: true, label: "How well do the listed award categories reflect the full range of outdoor communication members create?" },
        { id: "award_categories_to_add", type: "checkbox", label: "Which award categories should MOWA consider adding or separating? Select all that apply.", options: ["Podcast episode", "Short-form video", "Long-form video / documentary", "Website or digital project", "Newsletter", "Social media storytelling series", "Photo essay", "Conservation explainer", "Outdoor education / interpretation", "Student or emerging creator work", "No additions needed", "Other"] },
        { id: "awards_changes", type: "textarea", label: "What award category changes, if any, would make the awards more useful or representative?" },
        { id: "water_conservation_importance", type: "scale", scale: "importance", label: "Importance of conservation, clean water, and responsible recreation programs or recognition." },
        { id: "water_conservation_effectiveness", type: "scale", scale: "performance", na: true, label: "Effectiveness of MOWA’s conservation-related programs or recognition." },
        { id: "heritage_importance", type: "scale", scale: "importance", label: "Importance of preserving MOWA history, memorials, and legacy programs." },
        { id: "heritage_effectiveness", type: "scale", scale: "performance", na: true, label: "Effectiveness of MOWA’s heritage, memorial, or history-related efforts." }
      ]
    },
    {
      id: "membership",
      eyebrow: "Part 6",
      title: "Membership and public communication",
      intro: "This section looks at how easy MOWA is to understand, join, and recommend to others.",
      questions: [
        { id: "standards_importance", type: "scale", scale: "importance", label: "Importance of maintaining professional standards for membership." },
        { id: "standards_effectiveness", type: "scale", scale: "performance", na: true, label: "How well does the membership process protect professional standards?" },
        { id: "recruitment_effectiveness", type: "scale", scale: "performance", na: true, label: "How well does the membership process encourage qualified or promising people to apply?" },
        { id: "sponsor_barrier", type: "radio", label: "For someone who does not already know a MOWA member, does the membership process feel welcoming?", options: ["Yes", "Mostly", "Somewhat", "No", "Not sure"] },
        { id: "clear_path_unpaid", type: "radio", label: "Should MOWA offer a clearer path for serious outdoor creators who are not yet regularly paid?", options: ["Yes", "Maybe", "No", "Not sure"] },
        { id: "clear_path_digital", type: "radio", label: "Should MOWA offer a clearer path for digital creators, podcasters, videographers, photographers, website publishers, and social media creators?", options: ["Yes", "Maybe", "No", "Not sure"] },
        { id: "website_importance", type: "scale", scale: "importance", label: "Importance of the website for explaining MOWA and attracting members." },
        { id: "website_recruiting", type: "scale", scale: "performance", na: true, label: "How well does the website explain who belongs in MOWA and why they should join?" },
        { id: "public_comms_importance", type: "scale", scale: "importance", label: "Importance of active public communication beyond the website." },
        { id: "public_comms_effectiveness", type: "scale", scale: "performance", na: true, label: "How well does MOWA communicate with the public and prospective members beyond the website?" },
        { id: "membership_barriers", type: "textarea", label: "What, if anything, might discourage qualified or promising people from joining?" }
      ]
    },
    {
      id: "future",
      eyebrow: "Part 7",
      title: "Possible future activities",
      intro: "Rate how valuable these ideas would be. This does not mean MOWA must do them all; it helps identify what deserves discussion.",
      questions: [
        { id: "future_website", type: "scale", scale: "value", label: "A refreshed website focused on member benefits, events, awards, and who belongs in MOWA." },
        { id: "future_who_can_join", type: "scale", scale: "value", label: "A clearer “Who Can Join?” page for writers, photographers, filmmakers, podcasters, digital creators, conservation communicators, and others." },
        { id: "future_no_sponsor", type: "scale", scale: "value", label: "A “Don’t know a sponsor? We’ll connect you” path for prospective members." },
        { id: "future_student", type: "scale", scale: "value", label: "A student or emerging-creator membership category with lower cost and mentoring." },
        { id: "future_mentorship", type: "scale", scale: "value", label: "A formal mentorship program pairing experienced members with newer creators." },
        { id: "future_webinars", type: "scale", scale: "value", label: "Online workshops on writing, photography, video, podcasting, freelancing, ethics, conservation reporting, and digital publishing." },
        { id: "future_directory", type: "scale", scale: "value", label: "A member directory that helps members find collaborators, editors, photographers, speakers, podcast guests, and subject experts." },
        { id: "future_opportunity_board", type: "scale", scale: "value", label: "A job, assignment, pitch, or opportunity board." },
        { id: "future_partnerships", type: "scale", scale: "value", label: "More partnerships with colleges, conservation organizations, tourism groups, agencies, outdoor brands, and publishers." },
        { id: "future_modern_awards", type: "scale", scale: "value", label: "Award categories for podcasting, video, websites, newsletters, social media storytelling, photo essays, conservation explainers, and digital projects." },
        { id: "future_spotlights", type: "scale", scale: "value", label: "A member spotlight series featuring members’ work." },
        { id: "future_meetups", type: "scale", scale: "value", label: "Regional meetups or informal outdoor/content gatherings between annual conferences." }
      ]
    },
    {
      id: "involvement",
      eyebrow: "Part 8",
      title: "Priorities and involvement",
      intro: "This section identifies what should happen first and who may be willing to help.",
      questions: [
        { id: "priority_1", type: "text", label: "What should MOWA prioritize first?" },
        { id: "priority_2", type: "text", label: "What should MOWA prioritize second?" },
        { id: "priority_3", type: "text", label: "What should MOWA prioritize third?" },
        { id: "want_involved", type: "radio", label: "Would you like to become more involved in MOWA’s work?", options: ["Yes", "Maybe", "No", "Already involved enough", "Not sure"] },
        { id: "help_areas", type: "checkbox", label: "Where might you be willing to help? Select all that apply.", options: ["Membership outreach", "Website / communications", "Social media", "Conference planning", "Awards", "Mentoring newer members", "Student outreach", "Conservation / clean water work", "Partnerships", "Member spotlights", "Regional meetups", "I am not looking for a role", "Other"] },
        { id: "help_support_needed", type: "textarea", label: "What would make it easier for you to get involved?" },
        { id: "contact_note", type: "note", label: "Optional contact information: You may leave this blank. Add your name or email only if you are willing to be contacted about your response, volunteer for a committee, help with outreach, or get more involved with MOWA." },
        { id: "contact_name", type: "text", label: "Optional: name" },
        { id: "contact_email", type: "email", label: "Optional: email address" },
        { id: "contact_followup", type: "checkbox", label: "If you provided contact information, what follow-up would be okay? Select all that apply.", options: ["Contact me about my response", "Contact me about helping with membership outreach", "Contact me about website or communications work", "Contact me about committees or volunteer roles", "Contact me about mentoring or being mentored", "No follow-up needed"] },
        { id: "future_other", type: "textarea", label: "Are there any activities not listed that MOWA should consider?" }
      ]
    },
    {
      id: "tradeoffs",
      eyebrow: "Part 9",
      title: "Keeping what works, improving what doesn’t",
      intro: "This gives every respondent room to name what should be protected and what could be improved.",
      questions: [
        { id: "direction_view", type: "radio", label: "Which statement best describes your view?", options: ["MOWA should mostly preserve its structure and activities.", "MOWA should make small improvements but avoid major shifts.", "MOWA should refresh some areas while preserving its core traditions.", "MOWA should revisit several major areas to remain relevant.", "Not sure."] },
        { id: "urgency_new_members", type: "scale", scale: "urgency", label: "How urgent is the need to attract new members?" },
        { id: "concern_relevance", type: "scale", scale: "concern", label: "How concerned are you about MOWA’s ability to remain active and relevant over the next 5–10 years?" },
        { id: "comfort_supporting_improvements", type: "textarea", label: "What would make you more comfortable supporting improvements to MOWA?" },
        { id: "go_too_far", type: "textarea", label: "What kinds of changes would concern you or go too far?" },
        { id: "preserve", type: "textarea", label: "What should MOWA be careful to preserve?" },
        { id: "five_year_risk", type: "textarea", label: "If MOWA stays mostly as it is, what do you think is likely to happen over the next 5–10 years?" }
      ]
    },
    {
      id: "missionfit",
      eyebrow: "Part 10",
      title: "Mission fit",
      intro: "These questions compare what MOWA says it exists to do with what members experience.",
      questions: [
        { id: "fit_professional", type: "scale", scale: "fit", na: true, label: "How well does MOWA support professional outdoor communicators?" },
        { id: "fit_all_forms", type: "scale", scale: "fit", na: true, label: "How well does MOWA support all major forms of outdoor communication, including writing, photography, video, audio, web, and digital media?" },
        { id: "fit_skills", type: "scale", scale: "fit", na: true, label: "How well does MOWA help members improve communication skills?" },
        { id: "fit_careers", type: "scale", scale: "fit", na: true, label: "How well does MOWA help further members’ careers or creative goals?" },
        { id: "fit_networking", type: "scale", scale: "fit", na: true, label: "How well does MOWA provide meaningful networking opportunities?" },
        { id: "fit_next_gen", type: "scale", scale: "fit", na: true, label: "How well does MOWA inspire and mentor the next generation of outdoor media professionals?" },
        { id: "fit_conservation", type: "scale", scale: "fit", na: true, label: "How well does MOWA support conservation, natural resources, and responsible outdoor recreation?" },
        { id: "fit_biggest_gap", type: "textarea", label: "Where do you see the biggest gap between what MOWA says it does and what people experience?" }
      ]
    },
    {
      id: "final",
      eyebrow: "Part 11",
      title: "Final questions",
      intro: "These open answers often produce the clearest language for board discussion and planning.",
      questions: [
        { id: "most_important_new_members", type: "textarea", label: "What is the single most important thing MOWA should do to attract new members?" },
        { id: "most_important_existing", type: "textarea", label: "What is the single most important thing MOWA should do to better serve existing members?" },
        { id: "support_young", type: "textarea", label: "What is the single most important thing MOWA should do to support younger or emerging outdoor communicators?" },
        { id: "welcome_women", type: "textarea", label: "What is the single most important thing MOWA should do to welcome more women and a broader range of outdoor voices?" },
        { id: "additional_comments", type: "textarea", label: "Any additional comments?" }
      ]
    }
  ],
  gapPairs: [
    { label: "Support outdoor writers", importance: "imp_writers", performance: "perf_writers" },
    { label: "Support multimedia/digital creators", importance: "imp_multimedia", performance: "perf_multimedia" },
    { label: "Craft improvement", importance: "imp_craft", performance: "perf_craft" },
    { label: "Opportunities / assignments / collaborations", importance: "imp_opportunities", performance: "perf_opportunities" },
    { label: "Networking", importance: "imp_networking", performance: "perf_networking" },
    { label: "Mentoring newer communicators", importance: "imp_mentoring", performance: "perf_mentoring" },
    { label: "Students and early-career creators", importance: "imp_students", performance: "perf_students" },
    { label: "Women and broader outdoor voices", importance: "imp_women_broader", performance: "perf_women_broader" },
    { label: "Conservation / natural resources / responsible recreation", importance: "imp_conservation", performance: "perf_conservation" },
    { label: "Heritage and legacy", importance: "imp_heritage", performance: "heritage_effectiveness" },
    { label: "Annual conference", importance: "conference_importance", performance: "conference_effectiveness" },
    { label: "Awards / recognition", importance: "awards_importance", performance: "awards_effectiveness" },
    { label: "Membership standards vs recruitment", importance: "standards_importance", performance: "recruitment_effectiveness" },
    { label: "Website as recruitment tool", importance: "website_importance", performance: "website_recruiting" },
    { label: "Public communication beyond the website", importance: "public_comms_importance", performance: "public_comms_effectiveness" },
    { label: "Conservation programs", importance: "water_conservation_importance", performance: "water_conservation_effectiveness" }
  ]
};
