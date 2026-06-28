import { createContext, useContext, useState, useCallback } from 'react'
import { track } from './firebase'

const LANG_KEY = 'learnapp_lang'

// Flat string dictionary. Use {placeholders} filled via t(key, { ... }).
const STRINGS = {
  en: {
    // Language chooser
    chooseLanguage: 'Choose a language',
    chooseLanguageSub: 'You can change this anytime',
    english: 'English',
    hindi: 'हिंदी (Hindi)',

    // Dashboard
    dailyActivities: 'Daily Activities',
    log: 'Log',
    progress: 'Progress',
    reset: 'Reset',
    resetConfirm: 'Remove ALL saved progress, levels and history and start over? This cannot be undone.',

    // Lessons (free-flow)
    lessonTagline: 'A little practice, your way',
    lessonN: 'Lesson {n}',
    lessonSubtitle: 'About 10 minutes • a mix of skills',
    startLesson: 'Start lesson',
    nextLesson: 'Next lesson →',
    lessonComplete: 'Lesson {n} complete!',
    lessonsCompleted: '{n} lessons completed',
    adaptive: 'Adaptive',
    curriculumTitle: 'Your lessons',
    lessonItems: '{n} activities • ~10 min',
    locked: 'Locked',
    startLabel: 'Start',
    showAllLessons: 'Show all lessons ({n} more)',
    showFewerLessons: 'Show fewer',
    retry: 'Retry this lesson',
    startLessonN: 'Start Lesson {n}',

    // Profile / account
    account: 'Account',
    guest: 'Guest',
    signInGoogle: 'Sign in with Google',
    gateTitle: 'Sign in to continue',
    gateSub: 'Sign in with Google to keep doing lessons and save your progress across devices.',
    continueBtn: 'Continue',
    goBack: 'Go back',
    signOut: 'Sign out',
    languageLabel: 'Language',

    // Landing page
    landingEyebrow: 'Tarasha',
    landingHeadline: 'Keep your mind in motion',
    landingSub: 'Short, friendly exercises for memory, focus, and clear thinking — at your own pace.',
    landingSignIn: 'Sign in with Google',
    landingGuest: 'Start now — no sign-up needed',
    landingPillarMemory: 'Memory',
    landingPillarLearning: 'Learning',
    landingPillarInhibition: 'Inhibition',
    landingPillarFocus: 'Focus',
    landingNoAuth: 'Sign-in is being set up — you can start right away below.',
    landingFootnote: 'Sign in to save your progress and pick up on any device.',

    // Daily plan + guided session
    todaysPlan: "Today's Plan",
    planSubtitle: 'A balanced set picked for today',
    startSession: "Start today's session",
    continueSession: 'Continue session',
    planActivitiesDone: '{done} of {total} activities done',
    planAllDone: "Today's plan is complete! 🎉",
    reviewOrPractice: 'Review or practise anything below',
    allActivities: 'All activities',
    showAllActivities: 'Show all activities',
    hideAllActivities: 'Hide all activities',
    sessionComplete: 'Session complete!',
    todaysSession: "Today's session",
    activityOf: 'Activity {i} of {n}',
    nextActivity: 'Next activity →',
    finishSession: 'Finish',
    nothingToDo: "Everything in today's plan is already done.",
    measured: 'Scored',
    observed: 'Observed',
    allDoneToday: 'All done for today!',
    doneOfToday: '{done} of {total} done today',
    avgScore: 'Avg score: {pct}%',
    noScoredYet: 'No scored activities yet',
    daysCount: '{n} days',
    dayCount: '{n} day',
    streak: 'streak',
    noActivitiesToday: 'No activities done yet today.',
    last7days: 'Last 7 days',
    hide7day: 'Hide 7-day view',
    last7tap: 'Last 7 Days — tap a day for details',
    today: 'Today',
    noActivitiesRecorded: 'No activities recorded.',
    avgSuffix: 'avg',

    // Performance labels
    great: 'Great',
    ok: 'OK',
    needsWork: 'Needs work',
    doneLabel: 'Done',

    // Categories
    'cat.Learning': 'Learning',
    'cat.Short Term Memory': 'Short Term Memory',
    'cat.Topic Maintenance': 'Topic Maintenance',
    'cat.Narration': 'Narration',

    // Levels
    level: 'Level',
    'lvl.1': 'Basic',
    'lvl.2': 'Medium',
    'lvl.3': 'Advanced',
    doneToday: 'Done today ✓',

    // Shared activity chrome
    backToActivities: 'Continue →',
    next: 'Next',
    nextArrow: 'Next →',
    finish: 'Finish',
    done: 'Done',
    checkAnswers: 'Check my answers',
    showAgain: '🔄 Show again',
    check: 'Check',
    nextQuestion: 'Next question →',
    correct: 'Correct!',
    answerWas: 'Answer: {a}',
    mixedTitle: 'Mixed practice',
    whichOdd: 'Which one does NOT belong?',
    whichGroup: 'Which group does it belong to?',
    caregiverHowWasIt: 'Caregiver: How was it?',
    good: 'Good',
    goodRecall: 'Good recall',
    typeAnswer: 'Type your answer',

    // Completion headings
    wellDone: 'Well done!',
    wonderful: 'Wonderful!',
    wellSorted: 'Well sorted!',
    greatMemory: 'Great memory!',
    greatRecall: 'Great recall!',
    greatFocus: 'Great focus!',
    greatDescribing: 'Great describing!',
    memoryDone: 'Memory exercise done!',
    calmFocused: 'Calm and focused!',
    youGot: 'You got {score} out of {total} correct',

    // Odd one out
    oddTitleQ: 'Question {i} of {n} — Which one does NOT belong?',

    // Categorisation
    sortPrompt: 'Group {i} of {n} — which group does this belong to?',
    isA: '{label} is a {category}',

    // Items / delayed recall
    rememberItem: 'Remember this item ({i} of {n})',
    rememberItems: 'Remember these items',
    whatItems: 'What items did you see?',
    typeItemsComma: 'Type all the items you remember, separated by commas',
    itemsWere: 'The items were:',
    whatItemsStart: 'Now — what items did you see at the start?',
    quickQuestion: 'Quick question ({i} of {n})',

    // Memory numbers
    rememberNumber: 'Remember this number',
    whatNumber: 'What was the number?',
    typeNumber: 'Type the number',

    // Sentence repeat
    readSentence: 'Read and remember this sentence',
    typeSentence: 'Type the sentence you saw',
    sentenceWas: 'The sentence was:',

    // Copy text
    copyInstruction: 'Read the text, then copy it below',
    typeHere: 'Type here...',

    // Reverse counting
    fillGap: 'Fill in the missing number',
    startingFrom: 'starting from',

    // Weights / money (generic question)
    questionOf: 'Question {i} of {n}',

    // Cause & effect
    matchEffect: 'What is the effect?',
    causeLabel: 'Cause',

    // Daily routine + clock
    drawClockFor: 'Draw the clock for {time}',
    drawClockSub: "Draw the hour and minute hands to show the time, then we'll talk about it.",
    clearClock: 'Clear clock',
    doneDrawing: 'Done drawing →',
    oClock: "{h} o'clock",
    doneTalking: 'Done talking',
    talkPlaceholder: 'Talk about what you did...',
    caregiverHowRecall: 'Caregiver: How was the recall?',

    // Narration / describe / picture story
    tellStory: 'Now tell the story →',
    nextImage: 'Next image →',
    imageOf: 'Image {i} of {n}',
    tellStoryHere: 'Tell the story here...',
    whatSheSaid: 'Your answer:',
    caregiverHowNarration: 'Caregiver: How was the narration?',
    caregiverHowDescription: 'Caregiver: How was the description?',
    describeSpeak: 'Speak your answer',
    describeListening: 'Listening… tap to stop',
    writeDescription: 'Type your answer here...',
    sentencesTarget: 'Try to describe it in {n} sentences.',
    sentenceTarget: 'Try to describe it in {n} sentence.',

    // Drawing lines
    traceLine: 'Trace along the dotted line with your finger',
    roundOf: 'Round {i} of {n}',
    clear: 'Clear',
    nextRound: 'Next round →',
    drawAccuracy: 'Accuracy',
    drawRoundScore: 'Round {i}: {p}%',
    drawAvgLabel: 'How closely you traced the lines',

    // Color inside (inhibition)
    colorRule: 'Color inside the shape. Stay within the outline.',
    colorSlip: 'Outside the line!',
    colorSlips: 'Times you went outside: {n}',
    colorAvgLabel: 'How well you stayed inside the lines',

    // Write in the box (inhibition)
    writeRule: 'Trace it. Stay inside the box.',
    writeAvgLabel: 'How well you stayed inside the box',

    // Breath count
    breathFollow: 'Follow the circle. Breathe in as it grows, out as it shrinks. Count each breath.',
    breathOf: 'Breath {i} of {n}',
    breatheIn: 'Breathe in',
    hold: 'Hold',
    breatheOut: 'Breathe out',
    ready: 'Ready?',
    startBreathing: 'Start breathing',
    finishEarly: 'Finish early',
    breaths: 'breaths',
    breathsTaken: 'You took {n} slow breaths. Well done.',

    // Clap on the word
    clapIntro: 'You will hear some words. Clap ONLY when you hear the chosen word. Stay quiet for every other word. {n} mistakes and the round ends.',
    clapIntroTap: 'You will hear some words. Tap the big button ONLY when you hear the chosen word. Stay still for every other word. {n} mistakes and the round ends.',
    clapTapBtn: 'Tap',
    clapSwitchToClap: 'Use clapping instead (needs microphone)',
    clapSwitchToTap: 'Use tapping instead',
    clapTapTargetIs: 'Tap when you hear:',
    clapReplay: 'Hear it again',
    clapBegin: 'Begin',
    clapPlaying: 'Playing…',
    clapRule: 'Tap or clap ONLY when you hear the word below. Stay silent otherwise.',
    clapNeedMic: 'This activity listens with the microphone. Please allow microphone access.',
    clapMicDenied: 'Microphone not available. A caregiver can score this by watching instead.',
    clapStart: 'Start',
    clapCalibrating: 'Stay quiet for a moment…',
    clapGetReady: 'Get ready…',
    clapTargetIs: 'Clap when you hear:',
    clapListening: 'Listen…',
    clapClapNow: '👏 Clap!',
    clapPassed: 'Well done — you stayed focused!',
    clapFailed: 'Good try — let’s practise again next time.',
    clapHits: '{n} correct claps',
    clapStrikes: '{n} mistakes',
    clapManualPrompt: 'Watch them do it. Did they clap on the right word and stay quiet otherwise?',
    clapConfirm: 'Was this correct?',
    clapPass: 'Passed',
    clapFail: 'Failed',

    // Cooking
    arrangeSteps: 'Tap the steps in the correct order',
    yourOrder: 'YOUR ORDER:',
    tapStepAdd: 'Tap a step below to add it here',
    stepsTapAdd: 'STEPS (tap to add):',
    allStepsPlaced: 'All steps placed',
    correctOrder: 'Correct order:',
    checkOrder: 'Check order',

    // Misc activity chrome (filled in after first pass)
    check: 'Check',
    submit: 'Submit',
    perfect: 'Perfect!',
    notQuite: 'Not quite',
    notQuiteDiff: 'Not quite right — look at the differences above',
    copyAbove: 'Type the text above:',
    secondsRemaining: 'seconds remaining',
    numberWas: 'The number was:',
    youTyped: 'You typed:',
    numbersSoFar: 'Numbers so far:',
    sequenceOf: 'Sequence {i} of {n}',
    causeEffectInstruction: 'Tap a cause on the left, then the matching effect on the right.',
    effectLabel: 'Effect',
    lookPicturesRemember: 'Look at the pictures carefully. Remember the story!',
    tellStoryOwnWords: 'Tell me the story in your own words',
    whatHappenedSaw: 'What happened? What did you see?',

    // Result screen
    pctCorrect: '{pct}% correct',
    readyNextLevel: 'Ready for the next level!',
    practiceMore: "Let's practice more at this level",
    levelTransition: 'Level {c} ({cl}) → Level {n} ({nl})',
    whatNextSession: 'What should the next session be?',
    moveToLevel: 'Move to Level {n} — {label}',
    goBackBasic: 'Go back to Basic (Level 1)',
    stayAtLevel: 'Stay at Level {n} — {label}',
    stayingAt: 'Staying at Level {n} — {label} for the next session.',
    addNotes: 'Add notes for the therapist',
    notesPlaceholder: 'e.g. She struggled with Hindi sentences today, was more focused in the second half...',

    // Session log
    sessionLog: 'Session Log',
    progressLog: 'Progress Log',
    caregiverView: 'Caregiver View',
    enterPinToView: 'Enter PIN to view progress log',
    enterPin: 'Enter PIN',
    unlock: 'Unlock',
    defaultPin: 'Default PIN: 1234',
    wrongPin: 'Wrong PIN. Default is 1234',
    last30days: 'Last 30 days',
    allTime: 'All time',
    colActivity: 'Activity',
    colLevel: 'Level',
    colScore: 'Score',
    colResult: 'Result',
    colNotes: 'Notes',
    noActivityPeriod: 'No activity recorded in this period.',

    // Progress view
    tabTrends: 'Trends',
    tabLog: 'Log',
    tabReport: 'Report',
    consistency: 'Consistency',
    daysActive: '{n} of {d} days active',
    dayStreak: '{n}-day streak',
    measuredAvg: 'Scored average',
    observedRate: 'Observed — Good rate',
    last7: 'Last 7 days',
    domainTrends: 'Trends by skill area',
    weeklyTrend: 'last 6 weeks',
    notEnoughData: 'Not enough data yet',
    weeklyReport: 'Weekly report',
    printReport: '🖨️ Print / Save PDF',
    copyReport: '📋 Copy',
    copied: 'Copied!',
    reportRange: '{from} – {to}',
    reportDaysActive: 'Days active',
    reportSessions: 'Activities completed',
    reportMeasured: 'Scored average',
    reportObserved: 'Observed Good-rate',
    reportByDomain: 'By skill area',
    reportNotes: 'Caregiver notes',
    reportNoNotes: 'No notes this week.',
    reportLevels: 'Current levels (activities practised)',
  },

  hi: {
    chooseLanguage: 'भाषा चुनें',
    chooseLanguageSub: 'आप इसे कभी भी बदल सकते हैं',
    english: 'English (अंग्रेज़ी)',
    hindi: 'हिंदी',

    dailyActivities: 'रोज़ की एक्टिविटी',
    log: 'रिकॉर्ड',
    progress: 'प्रोग्रेस',
    reset: 'रीसेट',
    resetConfirm: 'पूरा सेव किया हुआ डेटा, लेवल और रिकॉर्ड हटाकर नए सिरे से शुरू करें? यह वापस नहीं आएगा।',

    lessonTagline: 'थोड़ा अभ्यास, अपने तरीके से',
    lessonN: 'पाठ {n}',
    lessonSubtitle: 'लगभग 10 मिनट • अलग-अलग तरह के काम',
    startLesson: 'पाठ शुरू करें',
    nextLesson: 'अगला पाठ →',
    lessonComplete: 'पाठ {n} पूरा!',
    lessonsCompleted: '{n} पाठ पूरे',
    adaptive: 'अपने हिसाब से',
    curriculumTitle: 'आपके पाठ',
    lessonItems: '{n} काम • ~10 मिनट',
    locked: 'बंद',
    startLabel: 'शुरू',
    showAllLessons: 'सभी पाठ देखें ({n} और)',
    showFewerLessons: 'कम दिखाएँ',
    retry: 'यह पाठ फिर से करें',
    startLessonN: 'पाठ {n} शुरू करें',

    account: 'खाता',
    guest: 'मेहमान',
    signInGoogle: 'Google से साइन इन करें',
    gateTitle: 'जारी रखने के लिए साइन इन करें',
    gateSub: 'लेसन जारी रखने और सभी डिवाइस पर प्रगति सहेजने के लिए Google से साइन इन करें।',
    continueBtn: 'जारी रखें',
    goBack: 'वापस जाएँ',
    signOut: 'साइन आउट',
    languageLabel: 'भाषा',

    landingEyebrow: 'तराशा',
    landingHeadline: 'दिमाग़ को active रखें',
    landingSub: 'याददाश्त, focus और सोच के लिए छोटे, आसान exercises — अपने हिसाब से।',
    landingSignIn: 'Google से login करें',
    landingGuest: 'अभी शुरू करें — कोई sign-up नहीं',
    landingPillarMemory: 'याददाश्त',
    landingPillarLearning: 'सीखना',
    landingPillarInhibition: 'कंट्रोल',
    landingPillarFocus: 'ध्यान',
    landingNoAuth: 'साइन-इन तैयार किया जा रहा है — आप नीचे से अभी शुरू कर सकते हैं।',
    landingFootnote: 'प्रोग्रेस सेव करने और किसी भी डिवाइस पर जारी रखने के लिए साइन इन करें।',

    todaysPlan: 'आज का प्लान',
    planSubtitle: 'आज के लिए चुने गए काम',
    startSession: 'आज का अभ्यास शुरू करें',
    continueSession: 'अभ्यास जारी रखें',
    planActivitiesDone: '{total} में से {done} काम पूरे',
    planAllDone: 'आज का प्लान पूरा हो गया! 🎉',
    reviewOrPractice: 'नीचे से कुछ भी दोबारा कर सकते हैं',
    allActivities: 'सारी एक्टिविटी',
    showAllActivities: 'सारी एक्टिविटी दिखाएँ',
    hideAllActivities: 'सारी एक्टिविटी छिपाएँ',
    sessionComplete: 'आज का अभ्यास पूरा!',
    todaysSession: 'आज का अभ्यास',
    activityOf: 'काम {i}/{n}',
    nextActivity: 'अगला काम →',
    finishSession: 'खत्म',
    nothingToDo: 'आज के सारे काम पहले से पूरे हैं।',
    measured: 'नंबर वाला',
    observed: 'देखकर',

    allDoneToday: 'आज का सब हो गया!',
    doneOfToday: 'आज {total} में से {done} पूरे',
    avgScore: 'औसत नंबर: {pct}%',
    noScoredYet: 'अभी कोई नंबर वाला काम नहीं',
    daysCount: '{n} दिन',
    dayCount: '{n} दिन',
    streak: 'लगातार',
    noActivitiesToday: 'आज अभी कुछ नहीं किया।',
    last7days: 'पिछले 7 दिन',
    hide7day: 'पिछले 7 दिन छिपाएँ',
    last7tap: 'पिछले 7 दिन — किसी दिन पर टैप करके देखें',
    today: 'आज',
    noActivitiesRecorded: 'कुछ नहीं किया।',
    avgSuffix: 'औसत',

    great: 'बहुत अच्छा',
    ok: 'ठीक',
    needsWork: 'थोड़ा और अभ्यास',
    doneLabel: 'पूरा',

    'cat.Learning': 'नई चीज़ें सीखना',
    'cat.Short Term Memory': 'याददाश्त',
    'cat.Topic Maintenance': 'ध्यान लगाना',
    'cat.Narration': 'कहानी सुनाना',

    level: 'लेवल',
    'lvl.1': 'आसान',
    'lvl.2': 'बीच का',
    'lvl.3': 'मुश्किल',
    doneToday: 'आज हो गया ✓',

    backToActivities: 'आगे →',
    next: 'आगे',
    nextArrow: 'आगे →',
    finish: 'खत्म',
    done: 'हो गया',
    checkAnswers: 'जवाब जाँचें',
    showAgain: '🔄 फिर दिखाएँ',
    check: 'जाँचें',
    nextQuestion: 'अगला सवाल →',
    correct: 'सही!',
    answerWas: 'जवाब: {a}',
    mixedTitle: 'मिला-जुला अभ्यास',
    whichOdd: 'इनमें से कौन-सा अलग है?',
    whichGroup: 'यह किस ग्रुप में आता है?',
    caregiverHowWasIt: 'आप बताएँ: कैसा रहा?',
    good: 'अच्छा',
    goodRecall: 'अच्छे से याद रहा',
    typeAnswer: 'अपना जवाब लिखें',

    wellDone: 'शाबाश!',
    wonderful: 'बहुत बढ़िया!',
    wellSorted: 'सही छाँटा!',
    greatMemory: 'बढ़िया याददाश्त!',
    greatRecall: 'बढ़िया याद किया!',
    greatFocus: 'बढ़िया ध्यान!',
    greatDescribing: 'बढ़िया बताया!',
    memoryDone: 'याद का अभ्यास पूरा!',
    calmFocused: 'शांत और ध्यान में!',
    youGot: 'आपने {total} में से {score} सही किए',

    oddTitleQ: 'सवाल {i}/{n} — इनमें से कौन-सा अलग है?',

    sortPrompt: 'ग्रुप {i}/{n} — यह किस ग्रुप का है?',
    isA: '{label} एक {category} है',

    rememberItem: 'इस चीज़ को याद रखें ({i}/{n})',
    rememberItems: 'इन चीज़ों को याद रखें',
    whatItems: 'आपने कौन-सी चीज़ें देखीं?',
    typeItemsComma: 'जो चीज़ें याद हैं सब लिखें, कॉमा लगाकर',
    itemsWere: 'चीज़ें थीं:',
    whatItemsStart: 'अब बताएँ — शुरू में कौन-सी चीज़ें देखी थीं?',
    quickQuestion: 'छोटा सवाल ({i}/{n})',

    rememberNumber: 'यह नंबर याद रखें',
    whatNumber: 'नंबर क्या था?',
    typeNumber: 'नंबर लिखें',

    readSentence: 'यह वाक्य पढ़कर याद रखें',
    typeSentence: 'जो वाक्य देखा वह लिखें',
    sentenceWas: 'वाक्य था:',

    copyInstruction: 'ऊपर लिखा पढ़ें, फिर नीचे लिखें',
    typeHere: 'यहाँ लिखें...',

    fillGap: 'छूटा हुआ नंबर भरें',
    startingFrom: 'से शुरू करते हुए',

    questionOf: 'सवाल {i}/{n}',

    matchEffect: 'इसका नतीजा क्या है?',
    causeLabel: 'वजह',

    drawClockFor: '{time} की घड़ी बनाएँ',
    drawClockSub: 'घंटे और मिनट की सुइयाँ बनाकर टाइम दिखाएँ, फिर उस पर बात करेंगे।',
    clearClock: 'घड़ी मिटाएँ',
    doneDrawing: 'बन गई →',
    oClock: '{h} बजे',
    doneTalking: 'बात हो गई',
    talkPlaceholder: 'आपने जो किया वह बताएँ...',
    caregiverHowRecall: 'आप बताएँ: कितना याद रहा?',

    tellStory: 'अब कहानी सुनाएँ →',
    nextImage: 'अगली तस्वीर →',
    imageOf: 'तस्वीर {i}/{n}',
    tellStoryHere: 'कहानी यहाँ सुनाएँ...',
    whatSheSaid: 'आपका जवाब:',
    caregiverHowNarration: 'आप बताएँ: कहानी कैसी सुनाई?',
    caregiverHowDescription: 'आप बताएँ: कैसा बताया?',
    describeSpeak: 'बोलकर जवाब दें',
    describeListening: 'सुन रहे हैं… रोकने के लिए दबाएँ',
    writeDescription: 'अपना जवाब यहाँ लिखें...',
    sentencesTarget: 'इसे {n} वाक्यों में बताने की कोशिश करें।',
    sentenceTarget: 'इसे {n} वाक्य में बताने की कोशिश करें।',

    traceLine: 'उँगली से बिंदी वाली लाइन पर चलें',
    roundOf: 'राउंड {i}/{n}',
    clear: 'मिटाएँ',
    nextRound: 'अगला राउंड →',
    drawAccuracy: 'सटीकता',
    drawRoundScore: 'राउंड {i}: {p}%',
    drawAvgLabel: 'आपने लाइनों पर कितनी सटीकता से चलाया',

    colorRule: 'आकृति के अंदर रंग भरें। लाइन के अंदर ही रहें।',
    colorSlip: 'लाइन से बाहर!',
    colorSlips: 'आप कितनी बार बाहर गए: {n}',
    colorAvgLabel: 'आप लाइन के अंदर कितना रहे',

    writeRule: 'ऊपर बनाएँ। डिब्बे के अंदर ही रहें।',
    writeAvgLabel: 'आप डिब्बे के अंदर कितना रहे',

    breathFollow: 'गोले को देखें। बड़ा हो तो साँस लें, छोटा हो तो छोड़ें। हर साँस गिनें।',
    breathOf: 'साँस {i}/{n}',
    breatheIn: 'साँस लें',
    hold: 'रोकें',
    breatheOut: 'साँस छोड़ें',
    ready: 'तैयार?',
    startBreathing: 'साँस लेना शुरू करें',
    finishEarly: 'जल्दी खत्म करें',
    breaths: 'साँसें',
    breathsTaken: 'आपने {n} धीमी साँसें लीं। शाबाश।',

    // Clap on the word
    clapIntro: 'आप कुछ शब्द सुनेंगे। सिर्फ़ चुने हुए शब्द पर ताली बजाएँ। बाकी हर शब्द पर चुप रहें। {n} ग़लतियों पर राउंड खत्म।',
    clapIntroTap: 'आप कुछ शब्द सुनेंगे। सिर्फ़ चुने हुए शब्द पर बड़ा बटन दबाएँ। बाकी हर शब्द पर रुके रहें। {n} ग़लतियों पर राउंड खत्म।',
    clapTapBtn: 'दबाएँ',
    clapSwitchToClap: 'ताली से करें (माइक्रोफ़ोन चाहिए)',
    clapSwitchToTap: 'दबाकर करें',
    clapTapTargetIs: 'इस शब्द पर दबाएँ:',
    clapReplay: 'फिर से सुनें',
    clapBegin: 'शुरू करें',
    clapPlaying: 'चल रहा है…',
    clapRule: 'नीचे दिए शब्द पर ही टैप या ताली करें। बाकी समय चुप रहें।',
    clapNeedMic: 'यह गतिविधि माइक्रोफ़ोन से सुनती है। कृपया माइक्रोफ़ोन की अनुमति दें।',
    clapMicDenied: 'माइक्रोफ़ोन उपलब्ध नहीं है। देखभाल करने वाले देखकर अंक दे सकते हैं।',
    clapStart: 'शुरू करें',
    clapCalibrating: 'थोड़ी देर चुप रहें…',
    clapGetReady: 'तैयार हो जाएँ…',
    clapTargetIs: 'इस शब्द पर ताली बजाएँ:',
    clapListening: 'सुनें…',
    clapClapNow: '👏 ताली!',
    clapPassed: 'शाबाश — आपने ध्यान बनाए रखा!',
    clapFailed: 'अच्छी कोशिश — अगली बार फिर अभ्यास करेंगे।',
    clapHits: '{n} सही तालियाँ',
    clapStrikes: '{n} ग़लतियाँ',
    clapManualPrompt: 'उन्हें करते हुए देखें। क्या उन्होंने सही शब्द पर ताली बजाई और बाकी समय चुप रहे?',
    clapConfirm: 'क्या यह सही था?',
    clapPass: 'पास',
    clapFail: 'फेल',

    arrangeSteps: 'स्टेप सही क्रम में टैप करें',
    yourOrder: 'आपका क्रम:',
    tapStepAdd: 'नीचे किसी स्टेप पर टैप करके यहाँ जोड़ें',
    stepsTapAdd: 'स्टेप (टैप करके जोड़ें):',
    allStepsPlaced: 'सारे स्टेप लग गए',
    correctOrder: 'सही क्रम:',
    checkOrder: 'क्रम जाँचें',

    check: 'जाँचें',
    submit: 'ठीक है',
    perfect: 'बिल्कुल सही!',
    notQuite: 'सही नहीं',
    notQuiteDiff: 'पूरा सही नहीं — ऊपर फ़र्क देखें',
    copyAbove: 'ऊपर लिखा हुआ लिखें:',
    secondsRemaining: 'सेकंड बचे',
    numberWas: 'नंबर था:',
    youTyped: 'आपने लिखा:',
    numbersSoFar: 'अब तक के नंबर:',
    sequenceOf: 'क्रम {i}/{n}',
    causeEffectInstruction: 'बाईं तरफ़ वजह चुनें, फिर दाईं तरफ़ उसका नतीजा चुनें।',
    effectLabel: 'नतीजा',
    lookPicturesRemember: 'तस्वीरों को ध्यान से देखें। कहानी याद रखें!',
    tellStoryOwnWords: 'अपने शब्दों में कहानी सुनाएँ',
    whatHappenedSaw: 'क्या हुआ? आपने क्या देखा?',

    pctCorrect: '{pct}% सही',
    readyNextLevel: 'अगले लेवल के लिए तैयार!',
    practiceMore: 'इसी लेवल पर थोड़ा और अभ्यास करें',
    levelTransition: 'लेवल {c} ({cl}) → लेवल {n} ({nl})',
    whatNextSession: 'अगली बार कौन-सा लेवल रखें?',
    moveToLevel: 'लेवल {n} पर जाएँ — {label}',
    goBackBasic: 'आसान (लेवल 1) पर वापस जाएँ',
    stayAtLevel: 'लेवल {n} पर रहें — {label}',
    stayingAt: 'अगली बार लेवल {n} — {label} ही रहेगा।',
    addNotes: 'डॉक्टर के लिए नोट लिखें',
    notesPlaceholder: 'जैसे: आज हिंदी वाक्यों में दिक्कत हुई, बाद में ध्यान बेहतर था...',

    sessionLog: 'अभ्यास रिकॉर्ड',
    progressLog: 'प्रोग्रेस रिकॉर्ड',
    caregiverView: 'माता-पिता के लिए',
    enterPinToView: 'प्रोग्रेस देखने के लिए पिन डालें',
    enterPin: 'पिन डालें',
    unlock: 'खोलें',
    defaultPin: 'डिफ़ॉल्ट पिन: 1234',
    wrongPin: 'गलत पिन। डिफ़ॉल्ट 1234 है',
    last30days: 'पिछले 30 दिन',
    allTime: 'पूरा समय',
    colActivity: 'काम',
    colLevel: 'लेवल',
    colScore: 'नंबर',
    colResult: 'नतीजा',
    colNotes: 'नोट',
    noActivityPeriod: 'इस समय में कुछ नहीं किया।',

    tabTrends: 'रुझान',
    tabLog: 'रिकॉर्ड',
    tabReport: 'रिपोर्ट',
    consistency: 'नियमित',
    daysActive: '{d} में से {n} दिन किया',
    dayStreak: '{n} दिन लगातार',
    measuredAvg: 'नंबर वाला औसत',
    observedRate: 'देखकर — अच्छा %',
    last7: 'पिछले 7 दिन',
    domainTrends: 'हर तरह के काम की प्रोग्रेस',
    weeklyTrend: 'पिछले 6 हफ़्ते',
    notEnoughData: 'अभी ज़्यादा जानकारी नहीं',
    weeklyReport: 'हफ़्ते की रिपोर्ट',
    printReport: '🖨️ प्रिंट / PDF सेव करें',
    copyReport: '📋 कॉपी',
    copied: 'कॉपी हो गया!',
    reportRange: '{from} – {to}',
    reportDaysActive: 'कितने दिन किया',
    reportSessions: 'कितने काम किए',
    reportMeasured: 'नंबर वाला औसत',
    reportObserved: 'देखकर — अच्छा %',
    reportByDomain: 'काम के हिसाब से',
    reportNotes: 'आपके नोट',
    reportNoNotes: 'इस हफ़्ते कोई नोट नहीं।',
    reportLevels: 'अभी के लेवल (जो काम किए)',
  },
}

function format(str, params) {
  if (!params) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`))
}

const LangContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'en' } catch { return 'en' }
  })

  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem(LANG_KEY, l) } catch {}
    track('language_select', { language: l })
  }, [])

  const t = useCallback((key, params) => {
    const table = STRINGS[lang] || STRINGS.en
    const str = table[key] !== undefined ? table[key] : (STRINGS.en[key] !== undefined ? STRINGS.en[key] : key)
    return format(str, params)
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}

// Pick a bilingual field from an activity: prefers `${field}_hi` when lang is hi.
export function pickField(obj, field, lang) {
  if (!obj) return ''
  if (lang === 'hi' && obj[`${field}_hi`]) return obj[`${field}_hi`]
  return obj[field] || ''
}
