export const safety24 = [
  {
    name: "prescription",
    question:
      "How much do you agree or disagree with the following statement: It is safe to use another person’s prescription drugs.",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "fent_nature",
    question:
      "How much do you agree or disagree with the following statement: Fentanyl is a naturally occurring drug.",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "fent_pill",
    question:
      "How much do you agree or disagree with the following statement: It is easy to tell whether a pill has fentanyl in it.",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "pill_od_a",
    question:
      "Imagine someone has taken a pill and you don't know what was in it, and the person is now passed out on the floor. What should you do? (Select all that apply)... Let them sleep it off.",
    answers: [
      { text: "Not selected", code: 0 },
      { text: "Selected", code: 1 },
    ],
  },
  {
    name: "pill_od_b",
    question:
      "Imagine someone has taken a pill and you don't know what was in it, and the person is now passed out on the floor. What should you do? (Select all that apply)... Call 911.",
    answers: [
      { text: "Not selected", code: 0 },
      { text: "Selected", code: 1 },
    ],
  },
  {
    name: "pill_od_c",
    question:
      "Imagine someone has taken a pill and you don't know what was in it, and the person is now passed out on the floor. What should you do? (Select all that apply)... Turn them onto their side.",
    answers: [
      { text: "Not selected", code: 0 },
      { text: "Selected", code: 1 },
    ],
  },
  {
    name: "pill_od_d",
    question:
      "Imagine someone has taken a pill and you don't know what was in it, and the person is now passed out on the floor. What should you do? (Select all that apply)... Give Naloxone.",
    answers: [
      { text: "Not selected", code: 0 },
      { text: "Selected", code: 1 },
    ],
  },
  {
    name: "pill_od_e",
    question:
      "Imagine someone has taken a pill and you don't know what was in it, and the person is now passed out on the floor. What should you do? (Select all that apply)... Give them water to drink.",
    answers: [
      { text: "Not selected", code: 0 },
      { text: "Selected", code: 1 },
    ],
  },
  {
    name: "pill_od_f",
    question:
      "Imagine someone has taken a pill and you don't know what was in it, and the person is now passed out on the floor. What should you do? (Select all that apply)... None of the above.",
    answers: [
      { text: "Not selected", code: 0 },
      { text: "Selected", code: 1 },
    ],
  },
  {
    name: "samaritan_laws",
    question: "What do Good Samaritan laws do?",
    answers: [
      { text: "Punish people for using drugs in public", code: 1 },
      {
        text: "Protect people from getting in trouble if they call for help during a drug emergency",
        code: 2,
      },
      {
        text: "Make people tell the police when someone is using drugs",
        code: 3,
      },
      {
        text: "Make doctors tell the police about someone who is using drugs",
        code: 4,
      },
    ],
  },
  {
    name: "opioid_crisis",
    question: "Which of the following is true about the opioid crisis?",
    answers: [
      { text: "Most opioid overdose deaths are caused by heroin", code: 1 },
      {
        text: "Fentanyl and other synthetic opioids cause many overdose deaths, even in people who are not addicted",
        code: 2,
      },
      { text: "Only people addicted to opioids are affected", code: 3 },
      {
        text: "Teens who have never used drugs are not at risk of dying from fentanyl",
        code: 4,
      },
    ],
  },
  {
    name: "non_med_fent",
    question:
      "How much do you agree or disagree with the following statement: Any amount of non-medical use of fentanyl can be deadly.",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
];
//You and Me (MS and HS)
export const tobacco24 = [
  {
    name: "vape_occasion_harm",
    question:
      "Imagine you vape nicotine occasionally. How harmful would this be to your health?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
    ],
  },
  {
    name: "vape_daily_harm",
    question:
      "Imagine you vape nicotine daily. How harmful would this be to your health?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
    ],
  },
  {
    name: "vape_safer",
    question:
      "How much do you agree or disagree with the following statement: Nicotine vapes are safer than cigarettes?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "vape_occasion_addict",
    question:
      "Imagine you vape nicotine occasionally: How likely are you to become addicted?",
    answers: [
      { text: "Not at all likely", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
  {
    name: "vape_daily_addict",
    question:
      "Imagine you vape nicotine daily: How likely are you to become addicted?",
    answers: [
      { text: "Not at all likely", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
  {
    name: "vape_environ_harm",
    question: "How harmful are e-cigarettes to the environment?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
    ],
  },
  {
    name: "refuse_cig",
    question:
      "How hard or easy would it be for you to refuse, or say “no” to, a friend who offered you a cigarette to smoke?",
    answers: [
      { text: "Very easy", code: 1 },
      { text: "Easy", code: 2 },
      { text: "Neither hard or easy", code: 3 },
      { text: "Hard", code: 4 },
      { text: "Very hard", code: 5 },
    ],
  },
  {
    name: "refuse_vape",
    question:
      "How hard or easy would it be for you to refuse, or say “no” to, a friend who offered you an e-cigarette/vape?",
    answers: [
      { text: "Very easy", code: 1 },
      { text: "Easy", code: 2 },
      { text: "Neither hard or easy", code: 3 },
      { text: "Hard", code: 4 },
      { text: "Very hard", code: 5 },
    ],
  },
  {
    name: "target_youth",
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target youth?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "target_adults",
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target adults?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "target_blkbrwn",
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target brown and black communities?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "target_lgbt",
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target LGBTQI+ communities?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "target_smoker",
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target current cigarette smokers?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "vape_know_vapor",
    question:
      "Nicotine vapes/e-cigarettes are devices that deliver nicotine in the form of a…",
    answers: [
      { text: "Vapor", code: 1 },
      { text: "Aerosol", code: 2 },
      { text: "Liquid", code: 3 },
      { text: "Steam", code: 4 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "know_addict",
    question: "What is the definition of addiction?",
    answers: [
      {
        text: "Uncontrollable desire to use something despite consequences",
        code: 1,
      },
      {
        text: "The state/condition of not having any or enough of something",
        code: 2,
      },
      {
        text: "A situation in which someone must have something to survive",
        code: 3,
      },
      { text: "I don’t know", code: 99 },
    ],
  },
  {
    name: "vape_intent",
    question:
      "How likely are you to use nicotine of any kind (smoked, vaped, etc.) in the next 6 months?",
    answers: [
      { text: "Not at all likely ", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
];

//You and Me, Together Vape-Free (Elm)
export const tobaccoElem24 = [
  {
    name: "vape_occasion_harm",
    question:
      "Imagine you vape nicotine once in a while. How harmful would this be to your health? (More squares = more harm)",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "vape_daily_harm",
    question:
      "Imagine you vape nicotine daily. How harmful would this be to your health? (More squares = more harm)",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "vape_safer",
    question: "Are nicotine vapes safer than cigarettes?",
    answers: [
      { text: "Yes, vapes are safer than cigarettes", code: 0 },
      { text: "No, vapes are not safer than cigarettes", code: 1 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "vape_occasion_addict",
    question:
      "Imagine you vape nicotine once in a while: How likely are you to become addicted? (More squares = more addiction)",
    answers: [
      { text: "Not at all likely to become addicted", code: 1 },
      { text: "Slightly likely to become addicted", code: 2 },
      { text: "Moderately likely to become addicted", code: 3 },
      { text: "Very likely to become addicted", code: 4 },
      { text: "Extremely likely to become addicted", code: 5 },
      { text: "I Don't Know", code: 99 },
    ],
  },
  {
    name: "vape_daily_addict",
    question:
      "Imagine you vape nicotine daily: How likely are you to become addicted? (More squares = more addiction)",
    answers: [
      { text: "Not at all likely to become addicted", code: 1 },
      { text: "Slightly likely to become addicted", code: 2 },
      { text: "Moderately likely to become addicted", code: 3 },
      { text: "Very likely to become addicted", code: 4 },
      { text: "Extremely likely to become addicted", code: 5 },
      { text: "I Don't Know", code: 99 },
    ],
  },
  {
    name: "vape_hurt_others",
    question: "Can vaping hurt other people too?",
    answers: [
      { text: "Yes, vaping can hurt other people", code: 1 },
      { text: "No, vaping cannot hurt other people", code: 0 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "vape_kids_target",
    question:
      "Why do you think that tobacco companies target kids to start smoking or vaping?",
    answers: [
      { text: "They don’t think tobacco is bad for kids", code: 1 },
      {
        text: "They want kids to be addicted so they can make more money",
        code: 2,
      },
      { text: "They think tobacco is better than other drugs", code: 3 },
      { text: "They don't trick kids", code: 4 },
    ],
  },
  {
    name: "vape_environ_harm",
    question:
      "How harmful are e-cigarettes to the environment? (More squares = more harm)",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I Don't Know", code: 99 },
    ],
  },
  {
    name: "stress_coping",
    question: "Do you know healthy ways to cope with stress?",
    answers: [
      { text: "I don't know any other ways to cope with stress", code: 1 },
      { text: "I might know other ways to cope with stress", code: 2 },
      { text: "I know a few other ways to cope with stress", code: 3 },
      {
        text: "I know more than a few other ways to cope with stress",
        code: 4,
      },
      { text: "I know lots of other ways to cope with stress", code: 5 },
    ],
  },
  {
    name: "vape_intent",
    question:
      "How likely are you to use nicotine of any kind (smoked, vaped, etc.) in the next 6 months?",
    answers: [
      { text: "Not at all likely ", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
];

//Smart Talk (MS+HS)
export const cannabis24 = [
  {
    name: "can_occasion_harm",
    question:
      "Imagine you use cannabis products (smoked, vaped, edibles, or drink) occasionally. How harmful would this be to your health?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
    ],
  },
  {
    name: "can_daily_harm",
    question:
      "Imagine you use cannabis products (smoked, vaped, edibles, or drink) daily. How harmful would this be to your health?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
    ],
  },
  {
    name: "can_occasion_addict",
    question:
      "Imagine you use cannabis (smoked, vaped, edibles, or drink) occasionally: How likely are you to become addicted?",
    answers: [
      { text: "Not at all likely", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
  {
    name: "can_daily_addict",
    question:
      "Imagine you use cannabis (smoked, vaped, edibles, or drink) daily: How likely are you to become addicted?",
    answers: [
      { text: "Not at all likely", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
  {
    name: "refuse_can_general",
    question:
      "How hard or easy would it be for you to refuse, or say “no” to, a friend who offered you cannabis to smoke, vape, or eat?",
    answers: [
      { text: "Very easy", code: 1 },
      { text: "Easy", code: 2 },
      { text: "Neither hard or easy", code: 3 },
      { text: "Hard", code: 4 },
      { text: "Very hard", code: 5 },
    ],
  },
  {
    name: "refuse_can_edible",
    question:
      "How hard or easy would it be for you to refuse, or say “no” to, a friend who offered you a cannabis edible?",
    answers: [
      { text: "Very easy", code: 1 },
      { text: "Easy", code: 2 },
      { text: "Neither hard or easy", code: 3 },
      { text: "Hard", code: 4 },
      { text: "Very hard", code: 5 },
    ],
  },
  {
    name: "can_environ_harm",
    question:
      "How harmful are “disposable” (single use) cannabis vaping products to the environment?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
    ],
  },
  {
    name: "can_know_vapor",
    question:
      "Nicotine vapes/e-cigarettes are devices that deliver nicotine in the form of a…",
    answers: [
      { text: "Vapor", code: 1 },
      { text: "Aerosol", code: 2 },
      { text: "Liquid", code: 3 },
      { text: "Steam", code: 4 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_smoke_harm",
    question:
      "How much do you agree or disagree with the following statement: Cannabis smoke/vapor is harmful to your lungs?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "can_under25_harm",
    question:
      "How much do you agree or disagree with the following statement: Cannabis (of any type) is harmful to the brain development of someone under the age of 25?",
    answers: [
      { text: "Strongly agree", code: 5 },
      { text: "Agree", code: 4 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Disagree", code: 2 },
      { text: "Strongly disagree", code: 1 },
    ],
  },
  {
    name: "can_intent",
    question:
      "How likely are you to use cannabis of any kind (smoked, vaped, edibles, etc.) in the next 6 months?",
    answers: [
      { text: "Not at all likely ", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
];


export const cannabisElem24 = [
  {
    name: "can_occasion_harm",
    question:
      "Imagine you use cannabis (smoked, vaped, edibles, or drink) once in a while. How harmful would this be to your health?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_daily_harm",
    question:
      "Imagine you use cannabis (smoked, vaped, edibles, or drink) daily. How harmful would this be to your health?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_occasion_addict",
    question:
      "Imagine you use cannabis (smoked, vaped, edibles, or drink) once in a while: How likely are you to become addicted?",
    answers: [
      { text: "Not at all likely", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_daily_addict",
    question:
      "Imagine you use cannabis (smoked, vaped, edibles, or drink) daily: How likely are you to become addicted?",
    answers: [
      { text: "Not at all likely", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_environ_harm",
    question: "How harmful are cannabis vaping products to the environment?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_smoke_harm",
    question: "How harmful is cannabis smoke/vapor to your lungs?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_under25_harm",
    question:
      "How harmful is cannabis to the brain of someone under 25 years old?",
    answers: [
      { text: "Not at all harmful", code: 1 },
      { text: "Slightly harmful", code: 2 },
      { text: "Moderately harmful", code: 3 },
      { text: "Very harmful", code: 4 },
      { text: "Extremely harmful", code: 5 },
      { text: "I don't know", code: 99 },
    ],
  },
  {
    name: "can_coping",
    question: "Do you know healthy ways to cope with stress?",
    answers: [
      { text: "I don't know any ways to cope with stress", code: 1 },
      { text: "I might know ways to cope with stress", code: 2 },
      { text: "I know a few ways to cope with stress", code: 3 },
      { text: "I know more than a few ways to cope with stress", code: 4 },
      { text: "I know lots of ways to cope with stress", code: 5 },
    ],
  },
  {
    name: "can_intent",
    question:
      "How likely are you to use cannabis of any kind (smoked, vaped, edibles, etc.) in the next 6 months?",
    answers: [
      { text: "Not at all likely", code: 1 },
      { text: "Slightly likely", code: 2 },
      { text: "Moderately likely", code: 3 },
      { text: "Very likely", code: 4 },
      { text: "Extremely likely", code: 5 },
    ],
  },
];



export const healthy24 = [
  {
    name: "can_su_triggers",
    question: "I know the triggers of substance use.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
  {
    name: "can_su_strategies",
    question: "I know strategies to address triggers of substance use.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
  {
    name: "can_su_healthy_alt",
    question: "I know of healthy alternatives to using substances.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
  {
    name: "can_reduce_stress",
    question: "I have at least two ways to reduce my stress.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
  {
    name: "can_su_impact",
    question: "I know how substance use impacts a person’s body.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
  {
    name: "can_su_resources",
    question:
      "I can name at least 2 resources to help people who use substances.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
  {
    name: "can_su_withdrawl",
    question: "I know the signs and symptoms of substance use withdrawal.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
  {
    name: "can_su_mental_health",
    question:
      "I can identify at least two mental health symptoms associated with substance use.",
    answers: [
      { text: "Strongly disagree", code: 1 },
      { text: "Disagree", code: 2 },
      { text: "Neither agree or disagree", code: 3 },
      { text: "Agree", code: 4 },
      { text: "Strongly agree", code: 5 },
    ],
  },
];

export const healthyCannabis24 = [
  {
    name: "can_smoke_intent",
    question:
      "Do you think you will EVER try Smoked cannabis (in a joint, pipe, bong, etc.) again? ",
    answers: [
      { text: "Definitely not", code: 1 },
      { text: "Probably not", code: 2 },
      { text: "Probably yes", code: 3 },
      { text: "Definitely yes", code: 4 },
    ],
  },
  {
    name: "can_vape_intent",
    question:
      "Do you think you will EVER try Vaped cannabis (in an e-cigarette, vape or pod) again? ",
    answers: [
      { text: "Definitely not", code: 1 },
      { text: "Probably not", code: 2 },
      { text: "Probably yes", code: 3 },
      { text: "Definitely yes", code: 4 },
    ],
  },
  {
    name: "can_edible_intent",
    question: "Do you think you will EVER try Cannabis edibles again? ",
    answers: [
      { text: "Definitely not", code: 1 },
      { text: "Probably not", code: 2 },
      { text: "Probably yes", code: 3 },
      { text: "Definitely yes", code: 4 },
    ],
  },
];

export const healthyTobacco24 = [
  {
    name: "nic_vape_intent",
    question:
      "Do you think you will EVER try Nicotine e-cigarettes/vapes (e.g., JUUL, Flum, VUSE) again? ",
    answers: [
      { text: "Definitely not", code: 1 },
      { text: "Probably not", code: 2 },
      { text: "Probably yes", code: 3 },
      { text: "Definitely yes", code: 4 },
      { text: "Unsure", code: 99 },
    ],
  },
  {
    name: "nic_nonnic_vape_intent",
    question:
      "Do you think you will EVER try Non-nicotine e-cigarettes/vapes (e.g., Monq, Vitaminvape, Cloudy) again? ",
    answers: [
      { text: "Definitely not", code: 1 },
      { text: "Probably not", code: 2 },
      { text: "Probably yes", code: 3 },
      { text: "Definitely yes", code: 4 },
    ],
  },
  {
    name: "nic_cig_intent",
    question: "Do you think you will EVER try Cigarettes again? ",
    answers: [
      { text: "Definitely not", code: 1 },
      { text: "Probably not", code: 2 },
      { text: "Probably yes", code: 3 },
      { text: "Definitely yes", code: 4 },
    ],
  },
];
