/**
 * WizKlub Chatbot — Rule-based State Machine Flow
 * Each state defines the bot's message(s), input type, and transition logic.
 */

export const BOT_STATES = {
  WELCOME: 'WELCOME',
  USER_TYPE: 'USER_TYPE',

  // ── Parent flow ─────────────────────────────────
  P_AGE: 'P_AGE',
  P_INTEREST: 'P_INTEREST',
  P_GOAL: 'P_GOAL',
  P_NAME: 'P_NAME',
  P_PHONE: 'P_PHONE',
  P_EMAIL: 'P_EMAIL',
  P_BOOKING: 'P_BOOKING',
  P_DONE: 'P_DONE',

  // ── School flow ─────────────────────────────────
  S_TYPE: 'S_TYPE',
  S_SIZE: 'S_SIZE',
  S_PROGRAM: 'S_PROGRAM',
  S_NAME: 'S_NAME',
  S_SCHOOL: 'S_SCHOOL',
  S_PHONE: 'S_PHONE',
  S_EMAIL: 'S_EMAIL',
  S_DONE: 'S_DONE',
};

// inputType: 'quick' | 'text' | 'phone' | 'email' | 'none'
export const FLOW = {
  [BOT_STATES.WELCOME]: {
    messages: [
      'Hi there! 👋 Welcome to **WizKlub**!',
      "I'm **Wiz**, your personal learning guide. WizKlub helps young minds build real-world skills through AI, Coding, and Higher-Order Thinking programs.",
      'To get started, who are you?',
    ],
    inputType: 'quick',
    options: [
      { label: '👨‍👩‍👧 Parent', value: 'parent' },
      { label: '🏫 School / Educator', value: 'school' },
    ],
    next: (value, _data) => ({
      state: value === 'parent' ? BOT_STATES.P_AGE : BOT_STATES.S_TYPE,
      dataKey: 'userType',
    }),
  },

  // ── PARENT FLOW ───────────────────────────────────────────────────────────
  [BOT_STATES.P_AGE]: {
    messages: ["That's great! 🌟 What is your child's age group?"],
    inputType: 'quick',
    options: [
      { label: '5 – 7 years', value: '5-7' },
      { label: '8 – 10 years', value: '8-10' },
      { label: '11 – 13 years', value: '11-13' },
      { label: '14 – 17 years', value: '14-17' },
    ],
    next: (_value, _data) => ({ state: BOT_STATES.P_INTEREST, dataKey: 'childAge' }),
  },

  [BOT_STATES.P_INTEREST]: {
    messages: ['Which area excites your child the most? ✨'],
    inputType: 'quick',
    options: [
      { label: '💻 Coding & Programming', value: 'Coding & Programming' },
      { label: '🤖 Robotics', value: 'Robotics' },
      { label: '🧠 AI & Machine Learning', value: 'AI & Machine Learning' },
      { label: '🔢 Critical Thinking & Math', value: 'Critical Thinking & Math' },
      { label: '🎯 Not sure yet', value: 'Not sure yet' },
    ],
    next: (_value, _data) => ({ state: BOT_STATES.P_GOAL, dataKey: 'stemInterest' }),
  },

  [BOT_STATES.P_GOAL]: {
    messages: ["Awesome choice! What's your biggest goal for your child right now?"],
    inputType: 'quick',
    options: [
      { label: '🚀 Build problem-solving skills', value: 'Build problem-solving skills' },
      { label: '📚 Prepare for competitive exams', value: 'Prepare for competitive exams' },
      { label: '🌐 Explore tech career paths', value: 'Explore tech career paths' },
      { label: '🎮 Make learning fun & engaging', value: 'Make learning fun & engaging' },
    ],
    next: (_value, _data) => ({ state: BOT_STATES.P_NAME, dataKey: 'parentGoal' }),
  },

  [BOT_STATES.P_NAME]: {
    messages: [
      "Perfect! I'd love to connect you with our expert team. 😊",
      "What's your name?",
    ],
    inputType: 'text',
    placeholder: 'Your name…',
    next: (_value, _data) => ({ state: BOT_STATES.P_PHONE, dataKey: 'name' }),
  },

  [BOT_STATES.P_PHONE]: {
    messages: (data) => [`Thanks, ${data.name}! 👍 What's the best phone number to reach you?`],
    inputType: 'phone',
    placeholder: '+91 98765 43210',
    next: (_value, _data) => ({ state: BOT_STATES.P_EMAIL, dataKey: 'phone' }),
  },

  [BOT_STATES.P_EMAIL]: {
    messages: ['And your email address? (We\'ll send program details here)'],
    inputType: 'email',
    placeholder: 'you@example.com',
    next: (_value, _data) => ({ state: BOT_STATES.P_BOOKING, dataKey: 'email' }),
  },

  [BOT_STATES.P_BOOKING]: {
    messages: [
      '🎉 You\'re all set! One last thing —',
      'Would you like to book a **FREE live demo class** for your child? It\'s a 45-minute interactive session with no obligations!',
    ],
    inputType: 'quick',
    options: [
      { label: '✅ Yes, book a free demo!', value: 'yes' },
      { label: '📩 Just send me the details', value: 'no' },
    ],
    next: (value, _data) => ({ state: BOT_STATES.P_DONE, dataKey: 'wantsDemo', extra: value === 'yes' }),
  },

  [BOT_STATES.P_DONE]: {
    messages: (data) =>
      data.wantsDemo
        ? [
            `🚀 Brilliant, ${data.name}! Your demo request is confirmed.`,
            'Our team will call you within **24 hours** to lock in a time slot that works for you.',
            '📧 Check your inbox — a confirmation will be on its way shortly!',
            '**See you at the demo!** 🎓',
          ]
        : [
            `Thanks, ${data.name}! 😊`,
            'We\'ve noted your interest. Our team will send across WizKlub program details to your email within **24 hours**.',
            'Feel free to reach us anytime at **hello@wizklab.com** 💌',
          ],
    inputType: 'none',
    isFinal: true,
  },

  // ── SCHOOL FLOW ───────────────────────────────────────────────────────────
  [BOT_STATES.S_TYPE]: {
    messages: [
      "Excellent! 🏫 We love partnering with schools to bring world-class STEM education to students.",
      'What type of institution are you representing?',
    ],
    inputType: 'quick',
    options: [
      { label: '🏛️ Government / Public School', value: 'Government/Public' },
      { label: '🏫 Private School', value: 'Private' },
      { label: '🌍 International School', value: 'International' },
      { label: '🎓 College / University', value: 'College/University' },
    ],
    next: (_value, _data) => ({ state: BOT_STATES.S_SIZE, dataKey: 'schoolType' }),
  },

  [BOT_STATES.S_SIZE]: {
    messages: ['Approximately how many students does your institution have?'],
    inputType: 'quick',
    options: [
      { label: 'Under 500', value: 'Under 500' },
      { label: '500 – 1,000', value: '500-1000' },
      { label: '1,000 – 2,000', value: '1000-2000' },
      { label: '2,000+', value: '2000+' },
    ],
    next: (_value, _data) => ({ state: BOT_STATES.S_PROGRAM, dataKey: 'schoolSize' }),
  },

  [BOT_STATES.S_PROGRAM]: {
    messages: ['Which WizKlub programs are you most interested in? 🔍'],
    inputType: 'quick',
    options: [
      { label: '🧩 After-school STEM Clubs', value: 'After-school STEM Clubs' },
      { label: '📘 Curriculum Integration', value: 'Curriculum Integration' },
      { label: '👩‍🏫 Teacher Training Program', value: 'Teacher Training' },
      { label: '🤝 Full School Partnership', value: 'Full School Partnership' },
    ],
    next: (_value, _data) => ({ state: BOT_STATES.S_NAME, dataKey: 'schoolProgram' }),
  },

  [BOT_STATES.S_NAME]: {
    messages: ["Great choice! Let me collect your details so our partnerships team can reach out. 😊", "What's your name?"],
    inputType: 'text',
    placeholder: 'Your name…',
    next: (_value, _data) => ({ state: BOT_STATES.S_SCHOOL, dataKey: 'name' }),
  },

  [BOT_STATES.S_SCHOOL]: {
    messages: (data) => [`Nice to meet you, ${data.name}! What is the name of your school / institution?`],
    inputType: 'text',
    placeholder: 'School name…',
    next: (_value, _data) => ({ state: BOT_STATES.S_PHONE, dataKey: 'schoolName' }),
  },

  [BOT_STATES.S_PHONE]: {
    messages: ['What is your official phone number?'],
    inputType: 'phone',
    placeholder: '+91 98765 43210',
    next: (_value, _data) => ({ state: BOT_STATES.S_EMAIL, dataKey: 'phone' }),
  },

  [BOT_STATES.S_EMAIL]: {
    messages: ['And your official work email?'],
    inputType: 'email',
    placeholder: 'principal@school.edu',
    next: (_value, _data) => ({ state: BOT_STATES.S_DONE, dataKey: 'email' }),
  },

  [BOT_STATES.S_DONE]: {
    messages: (data) => [
      `🎉 Thank you, ${data.name}!`,
      `We've logged your partnership inquiry for **${data.schoolName}**.`,
      'Our dedicated School Partnerships team will reach out within **48 hours** with a tailored proposal.',
      '📧 A confirmation has been sent to your email. We look forward to transforming student outcomes together! 🚀',
    ],
    inputType: 'none',
    isFinal: true,
  },
};

/** Resolve messages — supports static array or function(data) */
export const resolveMessages = (stateKey, data) => {
  const step = FLOW[stateKey];
  if (!step) return [];
  return typeof step.messages === 'function' ? step.messages(data) : step.messages;
};
