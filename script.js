const questions = [
    {
        id: "ideaStage",
        prompt: "Where are you right now in your entrepreneurial journey?",
        options: [
            { label: "I already have a startup idea", value: "yes" },
            { label: "I have a rough idea, but it is still fuzzy", value: "kind-of" },
            { label: "I’m interested, but I do not have an idea yet", value: "not-yet" }
        ]
    },
    {
        id: "blocker",
        prompt: "What is your biggest blocker right now?",
        options: [
            { label: "Confidence / impostor syndrome", value: "confidence" },
            { label: "I do not know where to start", value: "direction" },
            { label: "I do not have the right network", value: "network" },
            { label: "I need more practical skills", value: "skills" }
        ]
    },
    {
        id: "support",
        prompt: "What kind of support would help you the most?",
        options: [
            { label: "A mentor I can learn from", value: "mentor" },
            { label: "A community of peers", value: "community" },
            { label: "Hands-on workshops and resources", value: "workshops" },
            { label: "Teammates or collaborators", value: "team" }
        ]
    },
    {
        id: "interest",
        prompt: "Which area are you most excited about?",
        options: [
            { label: "Fintech", value: "fintech" },
            { label: "Social impact", value: "impact" },
            { label: "Consumer / lifestyle", value: "consumer" },
            { label: "AI / technology", value: "ai" }
        ]
    }
];

const state = {
    started: false,
    currentQuestionIndex: 0,
    answers: {}
};

const chatMessages = document.getElementById("chat-messages");
const chatOptions = document.getElementById("chat-options");
const startChatButton = document.getElementById("start-chat");
const resetChatButton = document.getElementById("reset-chat");
const resultsSection = document.getElementById("results-section");

const profileTag = document.getElementById("profile-tag");
const profileTitle = document.getElementById("profile-title");
const profileSummary = document.getElementById("profile-summary");
const mainBarrier = document.getElementById("main-barrier");
const nextStep = document.getElementById("next-step");
const mentorMatch = document.getElementById("mentor-match");
const mentorPill = document.getElementById("mentor-pill");
const opportunityMatch = document.getElementById("opportunity-match");
const opportunityPill = document.getElementById("opportunity-pill");

function addMessage(text, sender = "bot") {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderOptions(options) {
    chatOptions.innerHTML = "";

    options.forEach((option) => {
        const button = document.createElement("button");
        button.className = "option-btn";
        button.type = "button";
        button.textContent = option.label;
        button.addEventListener("click", () => handleAnswer(option));
        chatOptions.appendChild(button);
    });
}

function askCurrentQuestion() {
    const currentQuestion = questions[state.currentQuestionIndex];
    addMessage(currentQuestion.prompt, "bot");
    renderOptions(currentQuestion.options);
}

function startChat() {
    if (state.started) return;

    state.started = true;
    startChatButton.style.display = "none";

    addMessage("Hi! I’m your EPIC Her guide.", "bot");
    addMessage(
        "I’ll ask you four quick questions to understand where you are in your founder journey and what kind of support would help you most.",
        "bot"
    );

    setTimeout(() => {
        askCurrentQuestion();
    }, 300);
}

function handleAnswer(option) {
    const currentQuestion = questions[state.currentQuestionIndex];
    state.answers[currentQuestion.id] = option.value;

    addMessage(option.label, "user");

    state.currentQuestionIndex += 1;

    if (state.currentQuestionIndex < questions.length) {
        setTimeout(() => {
            askCurrentQuestion();
        }, 260);
    } else {
        chatOptions.innerHTML = "";
        setTimeout(() => {
            addMessage("Thanks — I’ve mapped your EPIC Her entry path.", "bot");
            addMessage("Here’s the support route that fits you best right now.", "bot");
            showResults(buildResult(state.answers));
        }, 380);
    }
}

function buildResult(answers) {
    const result = {
        profileTag: "",
        profileTitle: "",
        profileSummary: "",
        barrier: "",
        nextStep: "",
        mentor: "",
        mentorType: "",
        opportunity: "",
        opportunityType: ""
    };

    if (answers.ideaStage === "not-yet") {
        result.profileTag = "Explorer";
        result.profileTitle = "Early-Stage Explorer";
        result.profileSummary =
            "You are entrepreneurially curious and ready to engage, but you need a welcoming first step that makes the ecosystem feel accessible and actionable.";
    } else if (answers.ideaStage === "kind-of") {
        result.profileTag = "Emerging Founder";
        result.profileTitle = "Emerging Founder";
        result.profileSummary =
            "You already have the spark of an idea. What would help most now is structure, feedback, and the right people around you to turn possibility into momentum.";
    } else if (answers.ideaStage === "yes" && answers.support === "team") {
        result.profileTag = "Builder";
        result.profileTitle = "Builder Looking for Momentum";
        result.profileSummary =
            "You already have a concrete idea and are ready to move faster. The biggest unlock now is finding collaborators, support, and the right channel for traction.";
    } else {
        result.profileTag = "Founder";
        result.profileTitle = "Early-Stage Builder";
        result.profileSummary =
            "You are ready to start building. A high-fit mentor and the right EPIC opportunity could help you turn early ambition into visible progress.";
    }

    const barrierMap = {
        confidence: "Confidence and self-belief",
        direction: "Uncertainty around where to begin",
        network: "Limited access to the right network",
        skills: "Need for practical startup skills"
    };
    result.barrier = barrierMap[answers.blocker];

    const mentorInterestMap = {
        fintech: "a female founder or operator with fintech experience",
        impact: "a mentor working in social innovation or mission-driven ventures",
        consumer: "a mentor with consumer product and brand-building experience",
        ai: "a mentor with AI, product, or technical startup experience"
    };

    if (answers.support === "mentor") {
        result.mentorType = "Mentor-first support";
        result.mentor =
            `You would likely benefit most from ${mentorInterestMap[answers.interest]}, especially someone who can offer direct guidance, confidence-building, and practical founder perspective.`;
    } else if (answers.support === "community") {
        result.mentorType = "Community + mentor";
        result.mentor =
            `A relatable mentor plus a strong peer circle would work well for you. Start with ${mentorInterestMap[answers.interest]} and pair that with a women-centered founder community.`;
    } else if (answers.support === "workshops") {
        result.mentorType = "Skills mentor";
        result.mentor =
            `You would benefit from ${mentorInterestMap[answers.interest]} who can translate ideas into practical next steps and point you toward the most relevant hands-on learning opportunities.`;
    } else {
        result.mentorType = "Connector mentor";
        result.mentor =
            `A connector-style mentor would help you meet collaborators, refine your idea, and build traction around your interests in ${answers.interest === "ai" ? "AI and technology" : answers.interest}.`;
    }

    if (answers.blocker === "confidence") {
        result.nextStep = "Join a beginner-friendly founder session and a peer support circle.";
        result.opportunityType = "Confidence-building pathway";
        result.opportunity =
            "Start with an introductory EPIC Her experience focused on founder identity and belonging, then move into mentorship and small-group support.";
    } else if (answers.blocker === "direction") {
        result.nextStep = "Use a structured pathway to move from curiosity into a concrete first project.";
        result.opportunityType = "Structured pathway";
        result.opportunity =
            "A guided workshop sequence plus a mentor checkpoint would help you move from interest to action without feeling overwhelmed.";
    } else if (answers.blocker === "network") {
        result.nextStep = "Prioritize community, mentor access, and higher-visibility EPIC opportunities.";
        result.opportunityType = "Network-building pathway";
        result.opportunity =
            "You would benefit most from activities that create warm introductions, alumnae connections, and repeated touchpoints in the ecosystem.";
    } else {
        result.nextStep = "Start with skill-building and then move quickly into applied practice.";
        result.opportunityType = "Skills-to-action pathway";
        result.opportunity =
            "A hands-on workshop track would help you gain confidence and build momentum before stepping into a challenge or team-based experience.";
    }

    if (answers.support === "team") {
        result.opportunityType = "Team-building pathway";
        result.opportunity =
            "Because you are looking for collaborators, your best path includes community events, founder matching, and challenge-based participation.";
    }

    if (answers.ideaStage === "yes" && answers.blocker === "network") {
        result.nextStep = "Connect with mentors and partners who can help turn your idea into traction.";
    }

    return result;
}

function showResults(result) {
    profileTag.textContent = result.profileTag;
    profileTitle.textContent = result.profileTitle;
    profileSummary.textContent = result.profileSummary;
    mainBarrier.textContent = result.barrier;
    nextStep.textContent = result.nextStep;
    mentorMatch.textContent = result.mentor;
    mentorPill.textContent = result.mentorType;
    opportunityMatch.textContent = result.opportunity;
    opportunityPill.textContent = result.opportunityType;

    resultsSection.classList.remove("hidden");
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetExperience() {
    state.started = false;
    state.currentQuestionIndex = 0;
    state.answers = {};

    chatMessages.innerHTML = "";
    chatOptions.innerHTML = "";
    resultsSection.classList.add("hidden");
    startChatButton.style.display = "inline-flex";
}

startChatButton.addEventListener("click", startChat);
resetChatButton.addEventListener("click", resetExperience);