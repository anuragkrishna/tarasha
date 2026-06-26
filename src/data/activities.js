export const ACTIVITIES = [
  {
    id: 'odd-one-out',
    category: 'Learning',
    title: 'Odd One Out',
    title_hi: 'अलग चीज़ ढूँढो',
    icon: '🔍',
    description: 'Find the one that does not belong',
    description_hi: 'जो चीज़ बाकियों से अलग है उसे ढूँढें',
    levels: [
      {
        level: 1,
        questions: [
          {
            items: [
              { label: 'Apple', emoji: '🍎', label_hi: 'सेब' },
              { label: 'Banana', emoji: '🍌', label_hi: 'केला' },
              { label: 'Mango', emoji: '🥭', label_hi: 'आम' },
              { label: 'Chair', emoji: '🪑', label_hi: 'कुर्सी' },
            ],
            answer: 'Chair', hint: 'Three are fruits', answer_hi: 'कुर्सी', hint_hi: 'तीन फल हैं'
          },
          {
            items: [
              { label: 'Dog', emoji: '🐕', label_hi: 'कुत्ता' },
              { label: 'Cat', emoji: '🐈', label_hi: 'बिल्ली' },
              { label: 'Fish', emoji: '🐟', label_hi: 'मछली' },
              { label: 'Car', emoji: '🚗', label_hi: 'गाड़ी' },
            ],
            answer: 'Car', hint: 'Three are animals', answer_hi: 'गाड़ी', hint_hi: 'तीन जानवर हैं'
          },
          {
            items: [
              { label: 'Rose', emoji: '🌹', label_hi: 'गुलाब' },
              { label: 'Lotus', emoji: '🪷', label_hi: 'कमल' },
              { label: 'Tulip', emoji: '🌷', label_hi: 'ट्यूलिप' },
              { label: 'Mango', emoji: '🥭', label_hi: 'आम' },
            ],
            answer: 'Mango', hint: 'Three are flowers', answer_hi: 'आम', hint_hi: 'तीन फूल हैं'
          },
          {
            items: [
              { label: 'Bus', emoji: '🚌', label_hi: 'बस' },
              { label: 'Train', emoji: '🚂', label_hi: 'ट्रेन' },
              { label: 'Bicycle', emoji: '🚲', label_hi: 'साइकिल' },
              { label: 'Table', emoji: '🪞', label_hi: 'मेज़' },
            ],
            answer: 'Table', hint: 'Three are vehicles', answer_hi: 'मेज़', hint_hi: 'तीन गाड़ियाँ हैं'
          },
          {
            items: [
              { label: 'Sun', emoji: '☀️', label_hi: 'सूरज' },
              { label: 'Moon', emoji: '🌙', label_hi: 'चाँद' },
              { label: 'Star', emoji: '⭐', label_hi: 'तारा' },
              { label: 'Pencil', emoji: '✏️', label_hi: 'पेंसिल' },
            ],
            answer: 'Pencil', hint: 'Three are things in the sky', answer_hi: 'पेंसिल', hint_hi: 'तीन चीज़ें आसमान में हैं'
          },
        ]
      },
      {
        level: 2,
        questions: [
          {
            items: [
              { label: 'Lion', emoji: '🦁', label_hi: 'शेर' },
              { label: 'Tiger', emoji: '🐯', label_hi: 'बाघ' },
              { label: 'Elephant', emoji: '🐘', label_hi: 'हाथी' },
              { label: 'Rose', emoji: '🌹', label_hi: 'गुलाब' },
            ],
            answer: 'Rose', hint: 'Three are animals', answer_hi: 'गुलाब', hint_hi: 'तीन जानवर हैं'
          },
          {
            items: [
              { label: 'Apple', emoji: '🍎', label_hi: 'सेब' },
              { label: 'Grapes', emoji: '🍇', label_hi: 'अंगूर' },
              { label: 'Orange', emoji: '🍊', label_hi: 'संतरा' },
              { label: 'Milk', emoji: '🥛', label_hi: 'दूध' },
            ],
            answer: 'Milk', hint: 'Three are fruits', answer_hi: 'दूध', hint_hi: 'तीन फल हैं'
          },
          {
            items: [
              { label: 'Doctor', emoji: '👨‍⚕️', label_hi: 'डॉक्टर' },
              { label: 'Teacher', emoji: '👩‍🏫', label_hi: 'टीचर' },
              { label: 'Cook', emoji: '👨‍🍳', label_hi: 'रसोइया' },
              { label: 'Ambulance', emoji: '🚑', label_hi: 'एम्बुलेंस' },
            ],
            answer: 'Ambulance', hint: 'Three are people/professions', answer_hi: 'एम्बुलेंस', hint_hi: 'तीन लोग/काम करने वाले हैं'
          },
          {
            items: [
              { label: 'Cricket', emoji: '🏏', label_hi: 'क्रिकेट' },
              { label: 'Football', emoji: '⚽', label_hi: 'फुटबॉल' },
              { label: 'Swimming', emoji: '🏊', label_hi: 'तैराकी' },
              { label: 'Chess', emoji: '♟️', label_hi: 'शतरंज' },
            ],
            answer: 'Chess', hint: 'Three are outdoor/physical sports', answer_hi: 'शतरंज', hint_hi: 'तीन बाहर खेले जाने वाले खेल हैं'
          },
          {
            items: [
              { label: 'Shirt', emoji: '👕', label_hi: 'कमीज़' },
              { label: 'Saree', emoji: '🥻', label_hi: 'साड़ी' },
              { label: 'Shoes', emoji: '👟', label_hi: 'जूते' },
              { label: 'Bread', emoji: '🍞', label_hi: 'ब्रेड' },
            ],
            answer: 'Bread', hint: 'Three are things you wear', answer_hi: 'ब्रेड', hint_hi: 'तीन पहनने की चीज़ें हैं'
          },
        ]
      },
      {
        level: 3,
        questions: [
          {
            items: [
              { label: 'Wheat', emoji: '🌾', label_hi: 'गेहूँ' },
              { label: 'Rice', emoji: '🍚', label_hi: 'चावल' },
              { label: 'Corn', emoji: '🌽', label_hi: 'मक्का' },
              { label: 'Milk', emoji: '🥛', label_hi: 'दूध' },
            ],
            answer: 'Milk', hint: 'Three are grains', answer_hi: 'दूध', hint_hi: 'तीन अनाज हैं'
          },
          {
            items: [
              { label: 'Sunrise', emoji: '🌅', label_hi: 'सूर्योदय' },
              { label: 'Sunset', emoji: '🌇', label_hi: 'सूर्यास्त' },
              { label: 'Rainbow', emoji: '🌈', label_hi: 'इंद्रधनुष' },
              { label: 'Midnight', emoji: '🌑', label_hi: 'आधी रात' },
            ],
            answer: 'Rainbow', hint: 'Three are about the sun\'s position in the day', answer_hi: 'इंद्रधनुष', hint_hi: 'तीन दिन में सूरज की जगह से जुड़े हैं'
          },
          {
            items: [
              { label: 'Hammer', emoji: '🔨', label_hi: 'हथौड़ा' },
              { label: 'Wrench', emoji: '🔧', label_hi: 'पाना' },
              { label: 'Screwdriver', emoji: '🪛', label_hi: 'पेचकस' },
              { label: 'Apple', emoji: '🍎', label_hi: 'सेब' },
            ],
            answer: 'Apple', hint: 'Three are tools', answer_hi: 'सेब', hint_hi: 'तीन औज़ार हैं'
          },
          {
            items: [
              { label: 'Tabla', emoji: '🥁', label_hi: 'तबला' },
              { label: 'Flute', emoji: '🎵', label_hi: 'बाँसुरी' },
              { label: 'Sitar', emoji: '🎸', label_hi: 'सितार' },
              { label: 'Newspaper', emoji: '📰', label_hi: 'अखबार' },
            ],
            answer: 'Newspaper', hint: 'Three are musical instruments', answer_hi: 'अखबार', hint_hi: 'तीन बाजे हैं'
          },
          {
            items: [
              { label: 'Candle', emoji: '🕯️', label_hi: 'मोमबत्ती' },
              { label: 'Lamp', emoji: '🪔', label_hi: 'दीया' },
              { label: 'Torch', emoji: '🔦', label_hi: 'टॉर्च' },
              { label: 'Cloud', emoji: '☁️', label_hi: 'बादल' },
            ],
            answer: 'Cloud', hint: 'Three give light', answer_hi: 'बादल', hint_hi: 'तीन रोशनी देते हैं'
          },
        ]
      }
    ]
  },

  {
    id: 'copy-text',
    category: 'Learning',
    title: 'Copy Text',
    title_hi: 'देखकर लिखो',
    icon: '✏️',
    description: 'Read and copy the text below',
    description_hi: 'दिया हुआ पढ़कर लिखें',
    levels: [
      {
        level: 1,
        passages: [
          { text: 'The sun rises in the east.\nThe sky is blue.', lang: 'en' },
          { text: 'सूरज पूरब में उगता है।\nआसमान नीला है।', lang: 'hi' },
          { text: 'Birds fly in the sky.\nFish swim in water.', lang: 'en' },
          { text: 'पानी ठंडा है।\nदूध सफेद होता है।', lang: 'hi' },
        ]
      },
      {
        level: 2,
        passages: [
          { text: 'The dog barked at the gate.\nThe cat sat near the window.\nBoth animals are pets.', lang: 'en' },
          { text: 'राधा बाजार गई।\nउसने सब्जियाँ खरीदीं।\nवह खुश होकर घर लौटी।', lang: 'hi' },
          { text: 'Every morning I drink tea.\nThen I read the newspaper.\nThis is my daily routine.', lang: 'en' },
          { text: 'बच्चे स्कूल जाते हैं।\nवे पढ़ते और खेलते हैं।\nशाम को वे घर आते हैं।', lang: 'hi' },
        ]
      },
      {
        level: 3,
        passages: [
          { text: 'The farmer woke up early in the morning.\nHe went to his field with his tools.\nHe worked hard all day under the sun.\nIn the evening he returned home tired but happy.', lang: 'en' },
          { text: 'सुबह होते ही चिड़िया चहचहाने लगती हैं।\nफूल खिल जाते हैं और हवा सुगंधित होती है।\nबच्चे स्कूल की ओर दौड़ते हैं।\nसारी दुनिया जाग जाती है एक नए दिन के लिए।', lang: 'hi' },
        ]
      }
    ]
  },

  {
    id: 'memory-numbers',
    category: 'Short Term Memory',
    title: 'Remember Numbers',
    title_hi: 'नंबर याद करो',
    icon: '🔢',
    description: 'See a number, then recall it',
    description_hi: 'नंबर देखें, फिर याद करें',
    levels: [
      {
        level: 1,
        showDuration: 6000,
        numbers: ['3472', '8165', '5920', '7341', '6083']
      },
      {
        level: 2,
        showDuration: 5000,
        numbers: ['947382', '561028', '734916', '208547', '693014']
      },
      {
        level: 3,
        showDuration: 4000,
        numbers: ['98347261', '50162839', '74520163', '31804975', '62948013']
      }
    ]
  },

  {
    id: 'reverse-counting',
    category: 'Learning',
    title: 'Counting Game',
    title_hi: 'गिनती का खेल',
    icon: '🔢',
    description: 'Count backwards and fill in the gaps',
    description_hi: 'उल्टी गिनती करें और खाली जगह भरें',
    levels: [
      {
        level: 1,
        description: 'Count backwards by 1',
        description_hi: '1-1 करके उल्टी गिनती',
        sequences: [
          { start: 10, step: 1, count: 5 },
          { start: 15, step: 1, count: 5 },
          { start: 20, step: 1, count: 5 },
        ]
      },
      {
        level: 2,
        description: 'Count backwards by 2',
        description_hi: '2-2 करके उल्टी गिनती',
        sequences: [
          { start: 20, step: 2, count: 5 },
          { start: 30, step: 2, count: 5 },
          { start: 50, step: 2, count: 5 },
        ]
      },
      {
        level: 3,
        description: 'Count backwards by 2 (larger numbers)',
        description_hi: '2-2 करके उल्टी गिनती (बड़े नंबर)',
        sequences: [
          { start: 73, step: 2, count: 6 },
          { start: 91, step: 2, count: 6 },
          { start: 65, step: 2, count: 6 },
        ]
      }
    ]
  },

  {
    id: 'weights-concept',
    category: 'Learning',
    title: 'Weights',
    title_hi: 'वज़न',
    icon: '⚖️',
    description: 'Learn about kilograms and grams',
    description_hi: 'किलोग्राम और ग्राम सीखें',
    levels: [
      {
        level: 1,
        questions: [
          { question: 'Which is heavier?', options: ['1 kg', '500 g'], answer: '1 kg', hint: '1 kg = 1000 grams', question_hi: 'कौन सा भारी है?', options_hi: ['1 किलो', '500 ग्राम'], answer_hi: '1 किलो', hint_hi: '1 किलो = 1000 ग्राम' },
          { question: 'Which is heavier?', options: ['250 g', '1 kg'], answer: '1 kg', hint: '1 kg = 1000 grams', question_hi: 'कौन सा भारी है?', options_hi: ['250 ग्राम', '1 किलो'], answer_hi: '1 किलो', hint_hi: '1 किलो = 1000 ग्राम' },
          { question: 'Which is lighter?', options: ['2 kg', '200 g'], answer: '200 g', hint: '200 grams is much less than 2 kilograms', question_hi: 'कौन सा हल्का है?', options_hi: ['2 किलो', '200 ग्राम'], answer_hi: '200 ग्राम', hint_hi: '200 ग्राम 2 किलो से बहुत कम है' },
          { question: 'Which is heavier?', options: ['500 g', '750 g'], answer: '750 g', hint: '750 is more than 500', question_hi: 'कौन सा भारी है?', options_hi: ['500 ग्राम', '750 ग्राम'], answer_hi: '750 ग्राम', hint_hi: '750, 500 से ज़्यादा है' },
          { question: '1 kilogram = how many grams?', options: ['100 g', '1000 g', '500 g', '10 g'], answer: '1000 g', question_hi: '1 किलो = कितने ग्राम?', options_hi: ['100 ग्राम', '1000 ग्राम', '500 ग्राम', '10 ग्राम'], answer_hi: '1000 ग्राम' },
        ]
      },
      {
        level: 2,
        questions: [
          { question: '500 g + 250 g = ?', options: ['600 g', '750 g', '800 g', '500 g'], answer: '750 g', question_hi: '500 ग्राम + 250 ग्राम = ?', options_hi: ['600 ग्राम', '750 ग्राम', '800 ग्राम', '500 ग्राम'], answer_hi: '750 ग्राम' },
          { question: '1 kg + 500 g = ?', options: ['1.5 kg', '2 kg', '500 g', '1 kg'], answer: '1.5 kg', hint: '1 kg + 500 g = 1500 g = 1.5 kg', question_hi: '1 किलो + 500 ग्राम = ?', options_hi: ['1.5 किलो', '2 किलो', '500 ग्राम', '1 किलो'], answer_hi: '1.5 किलो', hint_hi: '1 किलो + 500 ग्राम = 1500 ग्राम = 1.5 किलो' },
          { question: '2 kg − 500 g = ?', options: ['1 kg', '1.5 kg', '2.5 kg', '500 g'], answer: '1.5 kg', question_hi: '2 किलो − 500 ग्राम = ?', options_hi: ['1 किलो', '1.5 किलो', '2.5 किलो', '500 ग्राम'], answer_hi: '1.5 किलो' },
          { question: '250 g + 250 g = ?', options: ['400 g', '500 g', '600 g', '750 g'], answer: '500 g', question_hi: '250 ग्राम + 250 ग्राम = ?', options_hi: ['400 ग्राम', '500 ग्राम', '600 ग्राम', '750 ग्राम'], answer_hi: '500 ग्राम' },
          { question: '1000 g = ?', options: ['500 g', '1 kg', '2 kg', '100 g'], answer: '1 kg', question_hi: '1000 ग्राम = ?', options_hi: ['500 ग्राम', '1 किलो', '2 किलो', '100 ग्राम'], answer_hi: '1 किलो' },
        ]
      },
      {
        level: 3,
        questions: [
          { question: 'You bought 2 kg of potatoes. You used 750 g. How much is left?', options: ['1 kg 250 g', '1 kg 500 g', '750 g', '1.75 kg'], answer: '1 kg 250 g', hint: '2000 g − 750 g = 1250 g = 1 kg 250 g', question_hi: 'आपने 2 किलो आलू खरीदे। 750 ग्राम इस्तेमाल किए। कितना बचा?', options_hi: ['1 किलो 250 ग्राम', '1 किलो 500 ग्राम', '750 ग्राम', '1.75 किलो'], answer_hi: '1 किलो 250 ग्राम', hint_hi: '2000 ग्राम − 750 ग्राम = 1250 ग्राम = 1 किलो 250 ग्राम' },
          { question: 'A bag has 1.5 kg of rice. You add 500 g more. Total weight?', options: ['1.5 kg', '2 kg', '2.5 kg', '3 kg'], answer: '2 kg', question_hi: 'एक थैले में 1.5 किलो चावल हैं। आप 500 ग्राम और डालते हैं। कुल वज़न?', options_hi: ['1.5 किलो', '2 किलो', '2.5 किलो', '3 किलो'], answer_hi: '2 किलो' },
          { question: 'You need 1 kg of flour. You have 400 g. How much more do you need?', options: ['400 g', '500 g', '600 g', '700 g'], answer: '600 g', question_hi: 'आपको 1 किलो आटा चाहिए। आपके पास 400 ग्राम है। कितना और चाहिए?', options_hi: ['400 ग्राम', '500 ग्राम', '600 ग्राम', '700 ग्राम'], answer_hi: '600 ग्राम' },
          { question: '3 packets each weighing 250 g. Total weight?', options: ['500 g', '750 g', '1 kg', '600 g'], answer: '750 g', question_hi: '3 पैकेट, हर एक 250 ग्राम का। कुल वज़न?', options_hi: ['500 ग्राम', '750 ग्राम', '1 किलो', '600 ग्राम'], answer_hi: '750 ग्राम' },
          { question: 'Mango weighs 200 g, apple weighs 150 g, banana weighs 100 g. Total?', options: ['400 g', '450 g', '500 g', '350 g'], answer: '450 g', question_hi: 'आम 200 ग्राम, सेब 150 ग्राम, केला 100 ग्राम का है। कुल?', options_hi: ['400 ग्राम', '450 ग्राम', '500 ग्राम', '350 ग्राम'], answer_hi: '450 ग्राम' },
        ]
      }
    ]
  },

  {
    id: 'money-transaction',
    category: 'Learning',
    title: 'Money',
    title_hi: 'पैसे',
    icon: '💰',
    description: 'Practice with Indian Rupees',
    description_hi: 'रुपयों का अभ्यास',
    levels: [
      {
        level: 1,
        questions: [
          { question: 'You have ₹10. You buy something for ₹7. Change?', options: ['₹1', '₹2', '₹3', '₹4'], answer: '₹3', question_hi: 'आपके पास ₹10 हैं। आप ₹7 की चीज़ खरीदते हैं। बाकी पैसे?' },
          { question: 'Banana costs ₹5. You give ₹10. Change?', options: ['₹4', '₹5', '₹6', '₹3'], answer: '₹5', question_hi: 'केला ₹5 का है। आप ₹10 देते हैं। बाकी पैसे?' },
          { question: '2 toffees cost ₹2 each. Total cost?', options: ['₹2', '₹4', '₹6', '₹8'], answer: '₹4', question_hi: '2 टॉफ़ी, हर एक ₹2 की। कुल कितने पैसे?' },
          { question: 'You have ₹20. Buy a pen for ₹12. Change?', options: ['₹6', '₹7', '₹8', '₹9'], answer: '₹8', question_hi: 'आपके पास ₹20 हैं। ₹12 की पेन खरीदते हैं। बाकी पैसे?' },
          { question: 'Pencil ₹3, eraser ₹2. Together?', options: ['₹4', '₹5', '₹6', '₹7'], answer: '₹5', question_hi: 'पेंसिल ₹3, रबर ₹2। दोनों मिलाकर?' },
        ]
      },
      {
        level: 2,
        questions: [
          { question: 'Tomatoes ₹20, onions ₹35. Total?', options: ['₹50', '₹55', '₹60', '₹45'], answer: '₹55', question_hi: 'टमाटर ₹20, प्याज़ ₹35। कुल?' },
          { question: 'You have ₹100. Buy rice for ₹65. Change?', options: ['₹25', '₹30', '₹35', '₹40'], answer: '₹35', question_hi: 'आपके पास ₹100 हैं। ₹65 के चावल खरीदते हैं। बाकी पैसे?' },
          { question: 'Bread ₹40, butter ₹60. Total? You give ₹200. Change?', options: ['₹90', '₹100', '₹110', '₹80'], answer: '₹100', question_hi: 'ब्रेड ₹40, मक्खन ₹60। कुल? आप ₹200 देते हैं। बाकी पैसे?' },
          { question: 'Tea ₹15 per cup. 3 cups cost?', options: ['₹40', '₹45', '₹50', '₹35'], answer: '₹45', question_hi: 'चाय ₹15 हर कप। 3 कप के कितने पैसे?' },
          { question: 'You have ₹500. Spend ₹175 + ₹230. Change?', options: ['₹85', '₹90', '₹95', '₹100'], answer: '₹95', question_hi: 'आपके पास ₹500 हैं। ₹175 + ₹230 खर्च करते हैं। बाकी पैसे?' },
        ]
      },
      {
        level: 3,
        questions: [
          { question: 'Milk ₹52, bread ₹35, eggs ₹60. Total? You pay ₹200. Change?', options: ['₹47', '₹53', '₹57', '₹43'], answer: '₹53', question_hi: 'दूध ₹52, ब्रेड ₹35, अंडे ₹60। कुल? आप ₹200 देते हैं। बाकी पैसे?' },
          { question: 'Saree costs ₹850. 10% discount. Final price?', options: ['₹750', '₹765', '₹780', '₹800'], answer: '₹765', question_hi: 'साड़ी ₹850 की है। 10% छूट। आखिरी दाम?' },
          { question: '3 kg apples at ₹80/kg. Total?', options: ['₹200', '₹220', '₹240', '₹260'], answer: '₹240', question_hi: '3 किलो सेब ₹80 हर किलो। कुल?' },
          { question: 'Bus fare ₹15 one way. Round trip cost?', options: ['₹20', '₹25', '₹30', '₹35'], answer: '₹30', question_hi: 'बस का किराया ₹15 एक तरफ़। आने-जाने का कितना?' },
          { question: 'Monthly milk ₹45/day for 30 days. Total?', options: ['₹1200', '₹1250', '₹1300', '₹1350'], answer: '₹1350', question_hi: 'महीने का दूध ₹45 हर दिन, 30 दिन। कुल?' },
        ]
      }
    ]
  },

  {
    id: 'items-recall',
    category: 'Short Term Memory',
    title: 'Remember Items',
    title_hi: 'चीज़ें याद करो',
    icon: '🧠',
    description: 'Remember a list of items',
    description_hi: 'चीज़ों की लिस्ट याद रखें',
    levels: [
      {
        level: 1,
        showDuration: 3000,
        lists: [
          ['Apple', 'Chair', 'Dog'],
          ['Rose', 'Book', 'Sun'],
          ['Bus', 'Cup', 'Tree'],
          ['Ball', 'Fish', 'Moon'],
        ],
        lists_hi: [
          ['सेब', 'कुर्सी', 'कुत्ता'],
          ['गुलाब', 'किताब', 'सूरज'],
          ['बस', 'कप', 'पेड़'],
          ['गेंद', 'मछली', 'चाँद'],
        ]
      },
      {
        level: 2,
        showDuration: 3000,
        lists: [
          ['Mango', 'Bicycle', 'River', 'Doctor', 'Temple'],
          ['Tiger', 'Milk', 'Mountain', 'School', 'Lamp'],
          ['Rain', 'Market', 'Parrot', 'Gold', 'Garden'],
          ['Train', 'Flower', 'Honey', 'Bridge', 'Cloud'],
        ],
        lists_hi: [
          ['आम', 'साइकिल', 'नदी', 'डॉक्टर', 'मंदिर'],
          ['बाघ', 'दूध', 'पहाड़', 'स्कूल', 'दीया'],
          ['बारिश', 'बाज़ार', 'तोता', 'सोना', 'बगीचा'],
          ['ट्रेन', 'फूल', 'शहद', 'पुल', 'बादल'],
        ]
      },
      {
        level: 3,
        showDuration: 2500,
        lists: [
          ['Delhi', 'Banana', 'Elephant', 'Doctor', 'River', 'Blue', 'Kite'],
          ['Mumbai', 'Orange', 'Lion', 'Teacher', 'Mountain', 'Red', 'Drum'],
          ['Chennai', 'Mango', 'Peacock', 'Engineer', 'Ocean', 'Green', 'Bell'],
        ],
        lists_hi: [
          ['दिल्ली', 'केला', 'हाथी', 'डॉक्टर', 'नदी', 'नीला', 'पतंग'],
          ['मुंबई', 'संतरा', 'शेर', 'टीचर', 'पहाड़', 'लाल', 'ढोल'],
          ['चेन्नई', 'आम', 'मोर', 'इंजीनियर', 'समुद्र', 'हरा', 'घंटी'],
        ]
      }
    ]
  },

  {
    id: 'sentence-repeat',
    category: 'Short Term Memory',
    title: 'Repeat Sentence',
    title_hi: 'वाक्य दोहराओ',
    icon: '💬',
    description: 'Read the sentence, then type it from memory',
    description_hi: 'वाक्य पढ़ें, फिर याद से लिखें',
    levels: [
      {
        level: 1,
        showDuration: 5000,
        sentences: [
          { text: 'The cat sat down.', lang: 'en' },
          { text: 'बिल्ली बैठ गई।', lang: 'hi' },
          { text: 'Birds fly high.', lang: 'en' },
          { text: 'मुझे चाय पसंद है।', lang: 'hi' },
          { text: 'The sky is clear.', lang: 'en' },
        ]
      },
      {
        level: 2,
        showDuration: 5000,
        sentences: [
          { text: 'She went to the market today.', lang: 'en' },
          { text: 'राधा कल बाजार गई थी।', lang: 'hi' },
          { text: 'The children play in the park.', lang: 'en' },
          { text: 'आज मौसम बहुत अच्छा है।', lang: 'hi' },
          { text: 'He drinks tea every morning.', lang: 'en' },
        ]
      },
      {
        level: 3,
        showDuration: 4000,
        sentences: [
          { text: 'The little girl played in the garden all afternoon.', lang: 'en' },
          { text: 'छोटी लड़की दोपहर को बगीचे में खेलती रही।', lang: 'hi' },
          { text: 'Every evening grandmother tells stories to the children.', lang: 'en' },
          { text: 'हर शाम दादी बच्चों को कहानियाँ सुनाती हैं।', lang: 'hi' },
          { text: 'The farmer woke up early to water his crops.', lang: 'en' },
        ]
      }
    ]
  },

  {
    id: 'cause-effect',
    category: 'Learning',
    title: 'Cause and Effect',
    title_hi: 'वजह और नतीजा',
    icon: '↔️',
    description: 'Match the cause with its effect',
    description_hi: 'वजह को उसके नतीजे से मिलाएँ',
    levels: [
      {
        level: 1,
        pairs: [
          { cause: 'It rains', effect: 'Ground gets wet', cause_hi: 'बारिश होती है', effect_hi: 'ज़मीन गीली हो जाती है' },
          { cause: 'You eat food', effect: 'Hunger goes away', cause_hi: 'आप खाना खाते हैं', effect_hi: 'भूख चली जाती है' },
          { cause: 'Fire burns', effect: 'Smoke appears', cause_hi: 'आग जलती है', effect_hi: 'धुआँ निकलता है' },
        ]
      },
      {
        level: 2,
        pairs: [
          { cause: 'You water a plant', effect: 'Plant grows', cause_hi: 'आप पौधे को पानी देते हैं', effect_hi: 'पौधा बढ़ता है' },
          { cause: 'Ice is left in the sun', effect: 'Ice melts', cause_hi: 'बर्फ़ धूप में रखी रहती है', effect_hi: 'बर्फ़ पिघल जाती है' },
          { cause: 'Lights are turned off', effect: 'Room becomes dark', cause_hi: 'लाइट बंद कर दी जाती है', effect_hi: 'कमरा अंधेरा हो जाता है' },
          { cause: 'You exercise daily', effect: 'Body stays healthy', cause_hi: 'आप रोज़ कसरत करते हैं', effect_hi: 'शरीर तंदुरुस्त रहता है' },
        ]
      },
      {
        level: 3,
        pairs: [
          { cause: 'You study hard', effect: 'You get good marks', cause_hi: 'आप मन लगाकर पढ़ते हैं', effect_hi: 'आपको अच्छे नंबर मिलते हैं' },
          { cause: 'Milk is heated too long', effect: 'Milk boils over', cause_hi: 'दूध ज़्यादा देर गरम होता है', effect_hi: 'दूध उबलकर बाहर आ जाता है' },
          { cause: 'There is no rain for months', effect: 'Drought occurs', cause_hi: 'महीनों तक बारिश नहीं होती', effect_hi: 'सूखा पड़ जाता है' },
          { cause: 'You sleep late at night', effect: 'You feel tired in the morning', cause_hi: 'आप रात को देर से सोते हैं', effect_hi: 'सुबह आपको थकान लगती है' },
          { cause: 'Too much screen time', effect: 'Eyes get strained', cause_hi: 'बहुत ज़्यादा स्क्रीन देखना', effect_hi: 'आँखों पर ज़ोर पड़ता है' },
        ]
      }
    ]
  },

  {
    id: 'daily-events-recall',
    category: 'Short Term Memory',
    title: 'Daily Events',
    title_hi: 'दिनभर की बातें',
    icon: '🌅',
    description: 'Recall what you did today',
    description_hi: 'आज आपने क्या किया, याद करें',
    timeSlots: [
      { label: 'Early Morning', icon: '🌅', time: '6am - 8am', start24: 6, clock: { hour: 7, minute: 0 }, prompt: 'What did you do early in the morning?', label_hi: 'सुबह-सुबह', time_hi: 'सुबह 6-8 बजे', prompt_hi: 'आपने सुबह-सुबह क्या किया?' },
      { label: 'Morning', icon: '☀️', time: '8am - 10am', start24: 8, clock: { hour: 9, minute: 0 }, prompt: 'What did you do in the morning?', label_hi: 'सुबह', time_hi: 'सुबह 8-10 बजे', prompt_hi: 'आपने सुबह क्या किया?' },
      { label: 'Late Morning', icon: '🌤️', time: '10am - 12pm', start24: 10, clock: { hour: 11, minute: 0 }, prompt: 'What happened before lunch?', label_hi: 'दोपहर से पहले', time_hi: 'सुबह 10-12 बजे', prompt_hi: 'खाने से पहले क्या हुआ?' },
      { label: 'Afternoon', icon: '🌞', time: '12pm - 3pm', start24: 12, clock: { hour: 1, minute: 0 }, prompt: 'What did you do after lunch?', label_hi: 'दोपहर', time_hi: 'दोपहर 12-3 बजे', prompt_hi: 'खाने के बाद आपने क्या किया?' },
      { label: 'Evening', icon: '🌇', time: '3pm - 6pm', start24: 15, clock: { hour: 4, minute: 0 }, prompt: 'What did you do in the evening?', label_hi: 'शाम', time_hi: 'शाम 3-6 बजे', prompt_hi: 'आपने शाम को क्या किया?' },
      { label: 'Night', icon: '🌙', time: 'After 6pm', start24: 18, clock: { hour: 8, minute: 0 }, prompt: 'What did you do at night?', label_hi: 'रात', time_hi: 'शाम 6 बजे के बाद', prompt_hi: 'आपने रात को क्या किया?' },
    ]
  },

  {
    id: 'picture-story',
    category: 'Short Term Memory',
    title: 'Picture Story',
    title_hi: 'तस्वीर कहानी',
    icon: '🖼️',
    description: 'Look at the pictures, then tell the story',
    description_hi: 'तस्वीरें देखें, फिर कहानी सुनाएँ',
    levels: [
      {
        level: 1,
        stories: [
          {
            title: 'The Plant',
            title_hi: 'पौधा',
            panels: [
              { emoji: '🌱', caption: 'A small seed is planted in soil', caption_hi: 'मिट्टी में एक छोटा बीज बोया जाता है' },
              { emoji: '💧', caption: 'Water is given every day', caption_hi: 'रोज़ पानी दिया जाता है' },
              { emoji: '🌳', caption: 'It grows into a big tree', caption_hi: 'यह बढ़कर बड़ा पेड़ बन जाता है' },
            ]
          },
          {
            title: 'Making Tea',
            title_hi: 'चाय बनाना',
            panels: [
              { emoji: '🫖', caption: 'Water is put on the stove', caption_hi: 'पानी चूल्हे पर रखा जाता है' },
              { emoji: '🌿', caption: 'Tea leaves are added', caption_hi: 'चाय की पत्ती डाली जाती है' },
              { emoji: '☕', caption: 'Hot tea is ready to drink', caption_hi: 'गरम चाय पीने के लिए तैयार है' },
            ]
          },
          {
            title: 'The Rain',
            title_hi: 'बारिश',
            panels: [
              { emoji: '☁️', caption: 'Dark clouds appear in the sky', caption_hi: 'आसमान में काले बादल छा जाते हैं' },
              { emoji: '🌧️', caption: 'It rains heavily', caption_hi: 'ज़ोर से बारिश होती है' },
              { emoji: '🌈', caption: 'A rainbow appears after the rain', caption_hi: 'बारिश के बाद इंद्रधनुष दिखता है' },
            ]
          },
        ]
      },
      {
        level: 2,
        stories: [
          {
            title: 'Going to Market',
            title_hi: 'बाज़ार जाना',
            panels: [
              { emoji: '🛒', caption: 'She makes a shopping list', caption_hi: 'वह सामान की लिस्ट बनाती है' },
              { emoji: '🚶‍♀️', caption: 'She walks to the market', caption_hi: 'वह बाज़ार तक पैदल जाती है' },
              { emoji: '🥦', caption: 'She buys fresh vegetables', caption_hi: 'वह ताज़ी सब्ज़ी खरीदती है' },
              { emoji: '🏠', caption: 'She returns home happily', caption_hi: 'वह खुशी-खुशी घर लौटती है' },
            ]
          },
          {
            title: 'The Lost Puppy',
            title_hi: 'खोया हुआ पिल्ला',
            panels: [
              { emoji: '🐶', caption: 'A puppy gets lost on the street', caption_hi: 'एक पिल्ला सड़क पर खो जाता है' },
              { emoji: '😢', caption: 'It cries and looks around', caption_hi: 'वह रोता है और इधर-उधर देखता है' },
              { emoji: '👧', caption: 'A kind girl finds the puppy', caption_hi: 'एक अच्छी लड़की पिल्ले को ढूँढ लेती है' },
              { emoji: '🏡', caption: 'She takes it safely home', caption_hi: 'वह उसे सही-सलामत घर ले जाती है' },
            ]
          },
          {
            title: 'Cooking Dinner',
            title_hi: 'रात का खाना बनाना',
            panels: [
              { emoji: '🧅', caption: 'Vegetables are washed and cut', caption_hi: 'सब्ज़ियाँ धोकर काटी जाती हैं' },
              { emoji: '🍳', caption: 'Cooking begins on the stove', caption_hi: 'चूल्हे पर खाना बनना शुरू होता है' },
              { emoji: '🥘', caption: 'A delicious dish is prepared', caption_hi: 'एक स्वादिष्ट खाना तैयार होता है' },
              { emoji: '👨‍👩‍👧', caption: 'The family eats together', caption_hi: 'पूरा परिवार साथ बैठकर खाता है' },
            ]
          },
        ]
      },
      {
        level: 3,
        stories: [
          {
            title: 'A Day at School',
            title_hi: 'स्कूल का एक दिन',
            panels: [
              { emoji: '⏰', caption: 'The alarm rings early morning', caption_hi: 'सुबह-सुबह अलार्म बजता है' },
              { emoji: '🧒', caption: 'Child gets ready for school', caption_hi: 'बच्चा स्कूल के लिए तैयार होता है' },
              { emoji: '📚', caption: 'Classes and lessons happen', caption_hi: 'क्लास और पढ़ाई होती है' },
              { emoji: '⚽', caption: 'Playtime during recess', caption_hi: 'छुट्टी में खेलने का समय' },
              { emoji: '🏫', caption: 'School day ends', caption_hi: 'स्कूल का दिन खत्म होता है' },
              { emoji: '🏠', caption: 'Child returns home and shares stories', caption_hi: 'बच्चा घर लौटकर बातें बताता है' },
            ]
          },
          {
            title: 'The Farmer',
            title_hi: 'किसान',
            panels: [
              { emoji: '🌅', caption: 'Farmer wakes up at sunrise', caption_hi: 'किसान सूरज निकलते ही उठ जाता है' },
              { emoji: '🚜', caption: 'Goes to the field with tools', caption_hi: 'औज़ार लेकर खेत जाता है' },
              { emoji: '🌾', caption: 'Works hard all morning', caption_hi: 'पूरी सुबह मेहनत करता है' },
              { emoji: '🥗', caption: 'Eats lunch under a tree', caption_hi: 'पेड़ के नीचे खाना खाता है' },
              { emoji: '☔', caption: 'Rain starts in the afternoon', caption_hi: 'दोपहर को बारिश शुरू होती है' },
              { emoji: '😊', caption: 'Farmer is happy — crops will grow well', caption_hi: 'किसान खुश है — फसल अच्छी होगी' },
            ]
          },
        ]
      }
    ]
  },

  {
    id: 'story-narration',
    category: 'Narration',
    title: 'Story Narration',
    title_hi: 'कहानी सुनाना',
    icon: '📖',
    description: 'Look at the images and tell the story',
    description_hi: 'तस्वीरें देखकर कहानी सुनाएँ',
    levels: [
      {
        level: 1,
        stories: [
          {
            title: 'The Hungry Crow',
            title_hi: 'प्यासा कौआ',
            panels: [
              { emoji: '🐦', caption: 'A crow was very thirsty', caption_hi: 'एक कौआ बहुत प्यासा था' },
              { emoji: '🏺', caption: 'It found a pot with a little water', caption_hi: 'उसे थोड़े पानी वाला घड़ा मिला' },
              { emoji: '🪨', caption: 'It dropped stones into the pot', caption_hi: 'उसने घड़े में पत्थर डाले' },
              { emoji: '💧', caption: 'The water rose higher', caption_hi: 'पानी ऊपर आ गया' },
              { emoji: '😄', caption: 'The crow drank the water happily', caption_hi: 'कौए ने खुशी से पानी पिया' },
            ],
            prompt: 'Tell the story of the crow in your own words.',
            prompt_hi: 'कौए की कहानी अपने शब्दों में सुनाएँ।'
          },
          {
            title: 'Morning Walk',
            title_hi: 'सुबह की सैर',
            panels: [
              { emoji: '🌅', caption: 'Sun rises in the morning', caption_hi: 'सुबह सूरज निकलता है' },
              { emoji: '👵', caption: 'An old woman steps outside', caption_hi: 'एक बुज़ुर्ग औरत बाहर निकलती है' },
              { emoji: '🌺', caption: 'She sees beautiful flowers in the garden', caption_hi: 'वह बगीचे में सुंदर फूल देखती है' },
              { emoji: '🐦', caption: 'Birds are singing on the trees', caption_hi: 'पेड़ों पर पंछी गा रहे हैं' },
              { emoji: '😊', caption: 'She feels happy and peaceful', caption_hi: 'उसे खुशी और सुकून मिलता है' },
            ],
            prompt: 'Describe what the old woman saw and felt on her morning walk.',
            prompt_hi: 'बताएँ कि बुज़ुर्ग औरत ने सुबह की सैर में क्या देखा और कैसा महसूस किया।'
          },
        ]
      },
      {
        level: 2,
        stories: [
          {
            title: 'The Kind Neighbour',
            title_hi: 'अच्छा पड़ोसी',
            panels: [
              { emoji: '🌧️', caption: 'It was raining heavily', caption_hi: 'ज़ोर से बारिश हो रही थी' },
              { emoji: '👴', caption: 'An old man was walking slowly with a stick', caption_hi: 'एक बुज़ुर्ग आदमी छड़ी लेकर धीरे-धीरे चल रहा था' },
              { emoji: '👩', caption: 'A young woman noticed him from her window', caption_hi: 'एक जवान औरत ने उसे खिड़की से देखा' },
              { emoji: '☂️', caption: 'She ran out with an umbrella', caption_hi: 'वह छाता लेकर बाहर दौड़ी' },
              { emoji: '🤝', caption: 'She helped him cross the road safely', caption_hi: 'उसने उन्हें सही-सलामत सड़क पार कराई' },
              { emoji: '🙏', caption: 'He thanked her with a warm smile', caption_hi: 'उन्होंने मुस्कुराकर उसका शुक्रिया किया' },
            ],
            prompt: 'What did the young woman do? Why was it a kind act?',
            prompt_hi: 'जवान औरत ने क्या किया? यह अच्छा काम क्यों था?'
          },
        ]
      },
      {
        level: 3,
        stories: [
          {
            title: 'The Festival',
            title_hi: 'त्योहार',
            panels: [
              { emoji: '🎊', caption: 'Diwali preparations begin at home', caption_hi: 'घर में दिवाली की तैयारी शुरू होती है' },
              { emoji: '🧹', caption: 'The whole house is cleaned', caption_hi: 'पूरा घर साफ़ किया जाता है' },
              { emoji: '🪔', caption: 'Diyas are lit in every corner', caption_hi: 'हर कोने में दीये जलाए जाते हैं' },
              { emoji: '🎁', caption: 'Family exchanges sweets and gifts', caption_hi: 'परिवार मिठाई और तोहफ़े बाँटता है' },
              { emoji: '✨', caption: 'Fireworks light up the night sky', caption_hi: 'पटाखे रात के आसमान को रोशन करते हैं' },
              { emoji: '👨‍👩‍👧‍👦', caption: 'The whole family celebrates together', caption_hi: 'पूरा परिवार साथ मिलकर खुशियाँ मनाता है' },
            ],
            prompt: 'Describe the festival celebrations. What did each person do?',
            prompt_hi: 'त्योहार की रौनक के बारे में बताएँ। हर किसी ने क्या किया?'
          },
        ]
      }
    ]
  },

  {
    id: 'drawing-lines',
    category: 'Topic Maintenance',
    title: 'Drawing Lines',
    title_hi: 'लाइन बनाओ',
    icon: '✏️',
    description: 'Trace the lines to practice focus',
    description_hi: 'ध्यान बढ़ाने के लिए लाइनों पर चलें',
    levels: [
      { level: 1, type: 'horizontal', label: 'Straight horizontal lines', label_hi: 'सीधी आड़ी लाइनें' },
      { level: 2, type: 'diagonal', label: 'Diagonal lines', label_hi: 'तिरछी लाइनें' },
      { level: 3, type: 'zigzag', label: 'Zigzag pattern', label_hi: 'टेढ़ी-मेढ़ी लाइनें' },
    ]
  },

  {
    id: 'cooking-plan',
    category: 'Learning',
    title: 'Cooking Plan',
    title_hi: 'खाना बनाने का तरीका',
    icon: '🍳',
    description: 'Arrange the recipe steps in order',
    description_hi: 'बनाने के स्टेप क्रम में लगाएँ',
    levels: [
      {
        level: 1,
        recipes: [
          {
            dish: 'Making Tea',
            dish_hi: 'चाय बनाना',
            steps: [
              'Boil water in a pot',
              'Add tea leaves and sugar',
              'Pour into a cup and enjoy',
            ],
            steps_hi: [
              'एक बर्तन में पानी उबालें',
              'चाय की पत्ती और चीनी डालें',
              'कप में डालकर मज़े से पिएँ',
            ]
          },
          {
            dish: 'Boiling Eggs',
            dish_hi: 'अंडे उबालना',
            steps: [
              'Fill a pot with water',
              'Place eggs carefully in the water',
              'Boil for 10 minutes',
            ],
            steps_hi: [
              'एक बर्तन में पानी भरें',
              'अंडों को आराम से पानी में रखें',
              '10 मिनट तक उबालें',
            ]
          },
        ]
      },
      {
        level: 2,
        recipes: [
          {
            dish: 'Dal (Lentil Soup)',
            dish_hi: 'दाल',
            steps: [
              'Wash the lentils thoroughly',
              'Boil lentils with water and salt',
              'Heat oil and fry onion and tomato',
              'Add spices and fry for 2 minutes',
              'Mix everything and serve hot',
            ],
            steps_hi: [
              'दाल को अच्छी तरह धोएँ',
              'दाल को पानी और नमक के साथ उबालें',
              'तेल गरम करके प्याज़ और टमाटर भूनें',
              'मसाले डालकर 2 मिनट भूनें',
              'सब मिलाकर गरम-गरम परोसें',
            ]
          },
          {
            dish: 'Vegetable Rice',
            dish_hi: 'सब्ज़ी वाले चावल',
            steps: [
              'Wash rice and keep aside',
              'Chop all vegetables finely',
              'Heat oil in a pressure cooker',
              'Fry vegetables and add spices',
              'Add rice and water, cook for 2 whistles',
            ],
            steps_hi: [
              'चावल धोकर अलग रखें',
              'सारी सब्ज़ियाँ बारीक काटें',
              'कुकर में तेल गरम करें',
              'सब्ज़ियाँ भूनें और मसाले डालें',
              'चावल और पानी डालकर 2 सीटी तक पकाएँ',
            ]
          },
        ]
      },
      {
        level: 3,
        recipes: [
          {
            dish: 'Aloo Paratha',
            dish_hi: 'आलू पराठा',
            steps: [
              'Boil and mash potatoes',
              'Add salt, spices, and coriander to the mash',
              'Prepare soft dough with flour and water',
              'Roll out a small circle of dough',
              'Place potato filling in the center',
              'Fold and seal the edges carefully',
              'Roll flat and cook on a hot tawa with ghee',
            ],
            steps_hi: [
              'आलू उबालकर मसल लें',
              'मसले आलू में नमक, मसाले और धनिया डालें',
              'आटे और पानी से नरम आटा गूँथें',
              'आटे की एक छोटी लोई बेलें',
              'बीच में आलू की भरावन रखें',
              'किनारों को मोड़कर अच्छी तरह बंद करें',
              'बेलकर गरम तवे पर घी के साथ सेंकें',
            ]
          },
        ]
      }
    ]
  },

  {
    id: 'categorisation',
    category: 'Learning',
    title: 'Sorting Groups',
    title_hi: 'ग्रुप बनाओ',
    icon: '🗂️',
    description: 'Put each item into the right group',
    description_hi: 'हर चीज़ को सही ग्रुप में रखें',
    levels: [
      {
        level: 1,
        rounds: [
          {
            categories: [
              { label: 'Fruits', emoji: '🍎', label_hi: 'फल' },
              { label: 'Animals', emoji: '🐕', label_hi: 'जानवर' },
            ],
            items: [
              { label: 'Mango', emoji: '🥭', category: 'Fruits', label_hi: 'आम', category_hi: 'फल' },
              { label: 'Cat', emoji: '🐈', category: 'Animals', label_hi: 'बिल्ली', category_hi: 'जानवर' },
              { label: 'Banana', emoji: '🍌', category: 'Fruits', label_hi: 'केला', category_hi: 'फल' },
              { label: 'Lion', emoji: '🦁', category: 'Animals', label_hi: 'शेर', category_hi: 'जानवर' },
              { label: 'Grapes', emoji: '🍇', category: 'Fruits', label_hi: 'अंगूर', category_hi: 'फल' },
              { label: 'Cow', emoji: '🐄', category: 'Animals', label_hi: 'गाय', category_hi: 'जानवर' },
            ]
          },
          {
            categories: [
              { label: 'Vehicles', emoji: '🚗', label_hi: 'गाड़ी' },
              { label: 'Clothes', emoji: '👕', label_hi: 'कपड़े' },
            ],
            items: [
              { label: 'Bus', emoji: '🚌', category: 'Vehicles', label_hi: 'बस', category_hi: 'गाड़ी' },
              { label: 'Shirt', emoji: '👕', category: 'Clothes', label_hi: 'कमीज़', category_hi: 'कपड़े' },
              { label: 'Train', emoji: '🚂', category: 'Vehicles', label_hi: 'ट्रेन', category_hi: 'गाड़ी' },
              { label: 'Saree', emoji: '🥻', category: 'Clothes', label_hi: 'साड़ी', category_hi: 'कपड़े' },
              { label: 'Cycle', emoji: '🚲', category: 'Vehicles', label_hi: 'साइकिल', category_hi: 'गाड़ी' },
              { label: 'Shoes', emoji: '👟', category: 'Clothes', label_hi: 'जूते', category_hi: 'कपड़े' },
            ]
          },
        ]
      },
      {
        level: 2,
        rounds: [
          {
            categories: [
              { label: 'Fruits', emoji: '🍎', label_hi: 'फल' },
              { label: 'Vegetables', emoji: '🥦', label_hi: 'सब्ज़ी' },
              { label: 'Animals', emoji: '🐕', label_hi: 'जानवर' },
            ],
            items: [
              { label: 'Apple', emoji: '🍎', category: 'Fruits', label_hi: 'सेब', category_hi: 'फल' },
              { label: 'Carrot', emoji: '🥕', category: 'Vegetables', label_hi: 'गाजर', category_hi: 'सब्ज़ी' },
              { label: 'Dog', emoji: '🐕', category: 'Animals', label_hi: 'कुत्ता', category_hi: 'जानवर' },
              { label: 'Orange', emoji: '🍊', category: 'Fruits', label_hi: 'संतरा', category_hi: 'फल' },
              { label: 'Tomato', emoji: '🍅', category: 'Vegetables', label_hi: 'टमाटर', category_hi: 'सब्ज़ी' },
              { label: 'Elephant', emoji: '🐘', category: 'Animals', label_hi: 'हाथी', category_hi: 'जानवर' },
              { label: 'Potato', emoji: '🥔', category: 'Vegetables', label_hi: 'आलू', category_hi: 'सब्ज़ी' },
              { label: 'Mango', emoji: '🥭', category: 'Fruits', label_hi: 'आम', category_hi: 'फल' },
              { label: 'Goat', emoji: '🐐', category: 'Animals', label_hi: 'बकरी', category_hi: 'जानवर' },
            ]
          },
          {
            categories: [
              { label: 'Birds', emoji: '🐦', label_hi: 'पंछी' },
              { label: 'Flowers', emoji: '🌷', label_hi: 'फूल' },
              { label: 'Vehicles', emoji: '🚗', label_hi: 'गाड़ी' },
            ],
            items: [
              { label: 'Parrot', emoji: '🦜', category: 'Birds', label_hi: 'तोता', category_hi: 'पंछी' },
              { label: 'Rose', emoji: '🌹', category: 'Flowers', label_hi: 'गुलाब', category_hi: 'फूल' },
              { label: 'Car', emoji: '🚗', category: 'Vehicles', label_hi: 'कार', category_hi: 'गाड़ी' },
              { label: 'Peacock', emoji: '🦚', category: 'Birds', label_hi: 'मोर', category_hi: 'पंछी' },
              { label: 'Lotus', emoji: '🪷', category: 'Flowers', label_hi: 'कमल', category_hi: 'फूल' },
              { label: 'Auto', emoji: '🛺', category: 'Vehicles', label_hi: 'ऑटो', category_hi: 'गाड़ी' },
              { label: 'Crow', emoji: '🐦‍⬛', category: 'Birds', label_hi: 'कौआ', category_hi: 'पंछी' },
              { label: 'Sunflower', emoji: '🌻', category: 'Flowers', label_hi: 'सूरजमुखी', category_hi: 'फूल' },
              { label: 'Bus', emoji: '🚌', category: 'Vehicles', label_hi: 'बस', category_hi: 'गाड़ी' },
            ]
          },
        ]
      },
      {
        level: 3,
        rounds: [
          {
            categories: [
              { label: 'Fruits', emoji: '🍎', label_hi: 'फल' },
              { label: 'Vegetables', emoji: '🥦', label_hi: 'सब्ज़ी' },
              { label: 'Animals', emoji: '🐕', label_hi: 'जानवर' },
              { label: 'Vehicles', emoji: '🚗', label_hi: 'गाड़ी' },
            ],
            items: [
              { label: 'Banana', emoji: '🍌', category: 'Fruits', label_hi: 'केला', category_hi: 'फल' },
              { label: 'Cabbage', emoji: '🥬', category: 'Vegetables', label_hi: 'पत्ता गोभी', category_hi: 'सब्ज़ी' },
              { label: 'Tiger', emoji: '🐯', category: 'Animals', label_hi: 'बाघ', category_hi: 'जानवर' },
              { label: 'Train', emoji: '🚂', category: 'Vehicles', label_hi: 'ट्रेन', category_hi: 'गाड़ी' },
              { label: 'Grapes', emoji: '🍇', category: 'Fruits', label_hi: 'अंगूर', category_hi: 'फल' },
              { label: 'Onion', emoji: '🧅', category: 'Vegetables', label_hi: 'प्याज़', category_hi: 'सब्ज़ी' },
              { label: 'Monkey', emoji: '🐒', category: 'Animals', label_hi: 'बंदर', category_hi: 'जानवर' },
              { label: 'Bike', emoji: '🏍️', category: 'Vehicles', label_hi: 'बाइक', category_hi: 'गाड़ी' },
              { label: 'Watermelon', emoji: '🍉', category: 'Fruits', label_hi: 'तरबूज़', category_hi: 'फल' },
              { label: 'Brinjal', emoji: '🍆', category: 'Vegetables', label_hi: 'बैंगन', category_hi: 'सब्ज़ी' },
              { label: 'Rabbit', emoji: '🐇', category: 'Animals', label_hi: 'खरगोश', category_hi: 'जानवर' },
              { label: 'Boat', emoji: '⛵', category: 'Vehicles', label_hi: 'नाव', category_hi: 'गाड़ी' },
            ]
          },
        ]
      }
    ]
  },

  {
    id: 'delayed-recall',
    category: 'Short Term Memory',
    title: 'Delayed Recall',
    title_hi: 'बाद में याद करो',
    icon: '⏳',
    description: 'Remember items, do a small task, then recall them',
    description_hi: 'चीज़ें याद करें, एक छोटा काम करें, फिर याद करें',
    levels: [
      {
        level: 1,
        showDuration: 5000,
        rounds: [
          {
            items: ['Apple', 'Bus', 'Dog'],
            items_hi: ['सेब', 'बस', 'कुत्ता'],
            distraction: [
              { question: 'What comes after 5?', answer: '6', question_hi: '5 के बाद क्या आता है?', answer_hi: '6' },
              { question: '2 + 3 = ?', answer: '5', question_hi: '2 + 3 = ?', answer_hi: '5' },
            ]
          },
          {
            items: ['Rose', 'Cup', 'Sun'],
            items_hi: ['गुलाब', 'कप', 'सूरज'],
            distraction: [
              { question: 'Count back from 10: 10, 9, ...?', answer: '8', question_hi: '10 से उल्टी गिनती: 10, 9, ...?', answer_hi: '8' },
              { question: '4 + 1 = ?', answer: '5', question_hi: '4 + 1 = ?', answer_hi: '5' },
            ]
          },
        ]
      },
      {
        level: 2,
        showDuration: 5000,
        rounds: [
          {
            items: ['Mango', 'River', 'Doctor', 'Temple'],
            items_hi: ['आम', 'नदी', 'डॉक्टर', 'मंदिर'],
            distraction: [
              { question: '7 + 5 = ?', answer: '12', question_hi: '7 + 5 = ?', answer_hi: '12' },
              { question: 'What day comes after Monday?', answer: 'Tuesday', question_hi: 'सोमवार के बाद कौन सा दिन आता है?', answer_hi: 'मंगलवार' },
              { question: '9 − 4 = ?', answer: '5', question_hi: '9 − 4 = ?', answer_hi: '5' },
            ]
          },
          {
            items: ['Tiger', 'Lamp', 'School', 'Cloud'],
            items_hi: ['बाघ', 'दीया', 'स्कूल', 'बादल'],
            distraction: [
              { question: 'Count back from 20: 20, 18, ...?', answer: '16', question_hi: '20 से उल्टी गिनती: 20, 18, ...?', answer_hi: '16' },
              { question: '6 + 6 = ?', answer: '12', question_hi: '6 + 6 = ?', answer_hi: '12' },
              { question: 'How many days in a week?', answer: '7', question_hi: 'एक हफ़्ते में कितने दिन होते हैं?', answer_hi: '7' },
            ]
          },
        ]
      },
      {
        level: 3,
        showDuration: 4500,
        rounds: [
          {
            items: ['Delhi', 'Banana', 'Elephant', 'Doctor', 'River'],
            items_hi: ['दिल्ली', 'केला', 'हाथी', 'डॉक्टर', 'नदी'],
            distraction: [
              { question: '15 + 8 = ?', answer: '23', question_hi: '15 + 8 = ?', answer_hi: '23' },
              { question: 'What month comes after April?', answer: 'May', question_hi: 'अप्रैल के बाद कौन सा महीना आता है?', answer_hi: 'मई' },
              { question: '30 − 12 = ?', answer: '18', question_hi: '30 − 12 = ?', answer_hi: '18' },
              { question: 'How many hours in a day?', answer: '24', question_hi: 'एक दिन में कितने घंटे होते हैं?', answer_hi: '24' },
            ]
          },
          {
            items: ['Mumbai', 'Orange', 'Lion', 'Teacher', 'Drum'],
            items_hi: ['मुंबई', 'संतरा', 'शेर', 'टीचर', 'ढोल'],
            distraction: [
              { question: 'Count back by 2 from 50: 50, 48, ...?', answer: '46', question_hi: '50 से 2-2 करके उल्टी गिनती: 50, 48, ...?', answer_hi: '46' },
              { question: '13 + 9 = ?', answer: '22', question_hi: '13 + 9 = ?', answer_hi: '22' },
              { question: 'What season has rain in India?', answer: 'Monsoon', question_hi: 'भारत में बारिश किस मौसम में होती है?', answer_hi: 'बरसात' },
              { question: '100 − 25 = ?', answer: '75', question_hi: '100 − 25 = ?', answer_hi: '75' },
            ]
          },
        ]
      }
    ]
  },

  {
    id: 'describe-picture',
    category: 'Narration',
    title: 'Describe the Picture',
    title_hi: 'तस्वीर बताओ',
    icon: '🗣️',
    description: 'Look at the scene and describe it in a few sentences',
    description_hi: 'तस्वीर देखें और कुछ वाक्यों में बताएँ',
    levels: [
      {
        level: 1,
        sentenceTarget: 2,
        scenes: [
          { emoji: '🏞️', title: 'A Park', prompt: 'What do you see in the park?', hints: ['trees', 'children playing', 'a bench'], title_hi: 'एक पार्क', prompt_hi: 'पार्क में आपको क्या दिखता है?', hints_hi: ['पेड़', 'खेलते बच्चे', 'एक बेंच'] },
          { emoji: '🍽️', title: 'Dinner Time', prompt: 'Describe the dinner table.', hints: ['food on plates', 'family sitting', 'water glasses'], title_hi: 'खाने का समय', prompt_hi: 'खाने की मेज़ के बारे में बताएँ।', hints_hi: ['थाली में खाना', 'बैठा हुआ परिवार', 'पानी के गिलास'] },
          { emoji: '🏖️', title: 'The Beach', prompt: 'What is happening at the beach?', hints: ['sand', 'waves', 'sun'], title_hi: 'समुद्र किनारा', prompt_hi: 'समुद्र किनारे क्या हो रहा है?', hints_hi: ['रेत', 'लहरें', 'सूरज'] },
        ]
      },
      {
        level: 2,
        sentenceTarget: 3,
        scenes: [
          { emoji: '🏫', title: 'A Classroom', prompt: 'Describe what is happening in the classroom.', hints: ['teacher', 'blackboard', 'students writing'], title_hi: 'एक क्लासरूम', prompt_hi: 'क्लासरूम में क्या हो रहा है, बताएँ।', hints_hi: ['टीचर', 'ब्लैकबोर्ड', 'लिखते हुए बच्चे'] },
          { emoji: '🛒', title: 'The Market', prompt: 'Describe the busy market.', hints: ['vegetables', 'shopkeeper', 'people buying'], title_hi: 'बाज़ार', prompt_hi: 'भीड़भाड़ वाले बाज़ार के बारे में बताएँ।', hints_hi: ['सब्ज़ियाँ', 'दुकानदार', 'खरीदते लोग'] },
          { emoji: '👩‍⚕️', title: 'A Doctor', prompt: 'Describe this person — who are they and what do they do?', hints: ['wears a coat', 'helps sick people', 'works in a hospital'], title_hi: 'एक डॉक्टर', prompt_hi: 'इस इंसान के बारे में बताएँ — ये कौन हैं और क्या करते हैं?', hints_hi: ['कोट पहनते हैं', 'बीमारों की मदद करते हैं', 'अस्पताल में काम करते हैं'] },
        ]
      },
      {
        level: 3,
        sentenceTarget: 5,
        scenes: [
          { emoji: '🎉', title: 'A Festival', prompt: 'Describe this festival scene in 5 sentences.', hints: ['decorations', 'people celebrating', 'lights', 'food', 'happy mood'], title_hi: 'एक त्योहार', prompt_hi: 'इस त्योहार के नज़ारे को 5 वाक्यों में बताएँ।', hints_hi: ['सजावट', 'खुशियाँ मनाते लोग', 'रोशनी', 'खाना', 'खुशी का माहौल'] },
          { emoji: '👵', title: 'Describe a Person', prompt: 'Think of your grandmother. Describe her in 5 sentences.', hints: ['how she looks', 'what she wears', 'what she likes', 'what she does', 'how you feel about her'], title_hi: 'किसी के बारे में बताएँ', prompt_hi: 'अपनी दादी के बारे में सोचें। उन्हें 5 वाक्यों में बताएँ।', hints_hi: ['वे कैसी दिखती हैं', 'क्या पहनती हैं', 'उन्हें क्या पसंद है', 'क्या करती हैं', 'आप उनके बारे में कैसा महसूस करते हैं'] },
          { emoji: '🚉', title: 'Railway Station', prompt: 'Describe everything happening at the railway station.', hints: ['trains', 'crowd', 'luggage', 'announcements', 'people waiting'], title_hi: 'रेलवे स्टेशन', prompt_hi: 'रेलवे स्टेशन पर जो कुछ हो रहा है, सब बताएँ।', hints_hi: ['ट्रेनें', 'भीड़', 'सामान', 'अनाउंसमेंट', 'इंतज़ार करते लोग'] },
        ]
      }
    ]
  },

  {
    id: 'breath-count',
    category: 'Topic Maintenance',
    title: 'Breath Count',
    title_hi: 'साँस गिनती',
    icon: '🌬️',
    description: 'Breathe slowly and count each breath to calm and focus',
    description_hi: 'धीरे साँस लें और शांत होने के लिए हर साँस गिनें',
    levels: [
      { level: 1, breaths: 3, inhale: 4, hold: 2, exhale: 4 },
      { level: 2, breaths: 5, inhale: 4, hold: 4, exhale: 6 },
      { level: 3, breaths: 8, inhale: 4, hold: 4, exhale: 6 },
    ]
  },
  {
    id: 'clap-when',
    category: 'Topic Maintenance',
    title: 'Clap on the Word',
    title_hi: 'शब्द पर ताली',
    icon: '👏',
    description: 'Listen carefully and clap only when you hear the chosen word',
    description_hi: 'ध्यान से सुनें और सिर्फ़ चुने हुए शब्द पर ताली बजाएँ',
    levels: [
      {
        level: 1,
        rounds: [
          {
            target: 'Apple', target_hi: 'सेब',
            words: ['Apple', 'Mango', 'Apple', 'Chair', 'Apple', 'Banana', 'Apple', 'Table', 'Cup', 'Apple', 'Pen'],
            words_hi: ['सेब', 'आम', 'सेब', 'कुर्सी', 'सेब', 'केला', 'सेब', 'मेज़', 'कप', 'सेब', 'कलम'],
          },
          {
            target: 'Dog', target_hi: 'कुत्ता',
            words: ['Cat', 'Dog', 'Sun', 'Dog', 'Book', 'Dog', 'Cup', 'Dog', 'Moon', 'Dog', 'Ball'],
            words_hi: ['बिल्ली', 'कुत्ता', 'सूरज', 'कुत्ता', 'किताब', 'कुत्ता', 'कप', 'कुत्ता', 'चाँद', 'कुत्ता', 'गेंद'],
          },
          {
            target: 'Sun', target_hi: 'सूरज',
            words: ['Moon', 'Sun', 'Tree', 'Sun', 'Car', 'Sun', 'Fish', 'Sun', 'Cup', 'Sun', 'Book'],
            words_hi: ['चाँद', 'सूरज', 'पेड़', 'सूरज', 'गाड़ी', 'सूरज', 'मछली', 'सूरज', 'कप', 'सूरज', 'किताब'],
          },
        ]
      },
      {
        level: 2,
        rounds: [
          {
            target: 'Ball', target_hi: 'गेंद',
            words: ['Cup', 'Ball', 'Book', 'Ball', 'Tree', 'Ball', 'Cup', 'Ball', 'Car', 'Ball', 'Moon', 'Ball', 'Pen'],
            words_hi: ['कप', 'गेंद', 'किताब', 'गेंद', 'पेड़', 'गेंद', 'कप', 'गेंद', 'गाड़ी', 'गेंद', 'चाँद', 'गेंद', 'कलम'],
          },
          {
            target: 'Cat', target_hi: 'बिल्ली',
            words: ['Dog', 'Cat', 'Fish', 'Cat', 'Sun', 'Cat', 'Dog', 'Cat', 'Moon', 'Cat', 'Tree', 'Cat', 'Cup'],
            words_hi: ['कुत्ता', 'बिल्ली', 'मछली', 'बिल्ली', 'सूरज', 'बिल्ली', 'कुत्ता', 'बिल्ली', 'चाँद', 'बिल्ली', 'पेड़', 'बिल्ली', 'कप'],
          },
          {
            target: 'Book', target_hi: 'किताब',
            words: ['Pen', 'Book', 'Cup', 'Book', 'Table', 'Book', 'Chair', 'Book', 'Ball', 'Book', 'Tree', 'Book', 'Sun'],
            words_hi: ['कलम', 'किताब', 'कप', 'किताब', 'मेज़', 'किताब', 'कुर्सी', 'किताब', 'गेंद', 'किताब', 'पेड़', 'किताब', 'सूरज'],
          },
        ]
      },
      {
        level: 3,
        rounds: [
          {
            target: 'Tree', target_hi: 'पेड़',
            words: ['Car', 'Tree', 'Fish', 'Tree', 'Moon', 'Tree', 'Cup', 'Tree', 'Book', 'Tree', 'Ball', 'Tree', 'Sun', 'Cat'],
            words_hi: ['गाड़ी', 'पेड़', 'मछली', 'पेड़', 'चाँद', 'पेड़', 'कप', 'पेड़', 'किताब', 'पेड़', 'गेंद', 'पेड़', 'सूरज', 'बिल्ली'],
          },
          {
            target: 'Fish', target_hi: 'मछली',
            words: ['Tree', 'Fish', 'Cat', 'Fish', 'Cup', 'Fish', 'Dog', 'Fish', 'Moon', 'Fish', 'Car', 'Fish', 'Sun', 'Ball'],
            words_hi: ['पेड़', 'मछली', 'बिल्ली', 'मछली', 'कप', 'मछली', 'कुत्ता', 'मछली', 'चाँद', 'मछली', 'गाड़ी', 'मछली', 'सूरज', 'गेंद'],
          },
          {
            target: 'Moon', target_hi: 'चाँद',
            words: ['Sun', 'Moon', 'Ball', 'Moon', 'Tree', 'Moon', 'Fish', 'Moon', 'Cup', 'Moon', 'Dog', 'Moon', 'Book', 'Cat'],
            words_hi: ['सूरज', 'चाँद', 'गेंद', 'चाँद', 'पेड़', 'चाँद', 'मछली', 'चाँद', 'कप', 'चाँद', 'कुत्ता', 'चाँद', 'किताब', 'बिल्ली'],
          },
        ]
      },
    ]
  },
]

// Deep-localize content: for any field `x` that has a sibling `x_hi`, use the
// Hindi value when lang === 'hi'. Recurses through objects and arrays so that
// nested questions/items/options/panels are all translated together.
export function localize(node, lang) {
  if (lang !== 'hi' || node == null) return node
  if (Array.isArray(node)) return node.map(n => localize(n, lang))
  if (typeof node === 'object') {
    const out = {}
    for (const k of Object.keys(node)) {
      if (k.endsWith('_hi')) continue            // raw hindi siblings handled below
      const hiKey = `${k}_hi`
      const val = hiKey in node ? node[hiKey] : node[k]
      out[k] = localize(val, lang)
    }
    return out
  }
  return node
}

export function getActivity(id, lang) {
  const a = ACTIVITIES.find(x => x.id === id)
  return a && lang === 'hi' ? localize(a, lang) : a
}

export function getActivityLevel(id, level, lang) {
  const activity = ACTIVITIES.find(x => x.id === id)
  if (!activity || !activity.levels) return null
  const lv = activity.levels.find(l => l.level === level) || activity.levels[0]
  return lv && lang === 'hi' ? localize(lv, lang) : lv
}

// All of an activity's levels in easy→hard order, localized. Used to build the
// difficulty "ladder" — the full question bank across every level.
export function getOrderedLevels(id, lang) {
  const a = ACTIVITIES.find(x => x.id === id)
  if (!a || !a.levels) return []
  const levels = [...a.levels].sort((x, y) => x.level - y.level)
  return lang === 'hi' ? levels.map(l => localize(l, lang)) : levels
}

// Take `n` items from `arr` starting at the exposure offset, wrapping at the end:
// exposure 0 → items 0..n-1, exposure 1 → items n..2n-1, … so each repeat of an
// activity serves the next, tougher questions.
export function ladderWindow(arr, exposure = 0, n = 2) {
  if (!arr || !arr.length) return []
  const span = Math.min(n, arr.length)
  const start = ((exposure * n) % arr.length + arr.length) % arr.length
  const out = []
  for (let i = 0; i < span; i++) out.push(arr[(start + i) % arr.length])
  return out
}

// Which array on a level object holds that activity's questions. (copy-text and
// sentence-repeat are excluded — they tag rows by language inside one array and
// are windowed in-component after the language filter.)
const CONTENT_KEY = {
  'memory-numbers': 'numbers',
  'items-recall': 'lists',
  'reverse-counting': 'sequences',
  'cause-effect': 'pairs',
  'picture-story': 'stories',
  'story-narration': 'stories',
  'cooking-plan': 'recipes',
  'delayed-recall': 'rounds',
  'describe-picture': 'scenes',
  'clap-when': 'rounds',
}

// Walk the full easy→hard question bank (all levels) and return a window of `n`
// items for the given exposure. Non-content level metadata (showDuration,
// sentenceTarget…) comes from the window's first item's level. Shaped like a
// level object so callers are a drop-in swap for getActivityLevel. Localises
// before windowing so _hi sibling arrays survive. Returns null if no bank.
export function getLadderContent(id, exposure = 0, lang, n = 2) {
  const activity = ACTIVITIES.find(x => x.id === id)
  const key = CONTENT_KEY[id]
  if (!activity || !activity.levels || !key) return null
  const levels = [...activity.levels]
    .sort((a, b) => a.level - b.level)
    .map(lv => (lang === 'hi' ? localize(lv, lang) : lv))
  const bank = []
  for (const lv of levels) for (const item of (lv[key] || [])) bank.push({ item, lv })
  if (!bank.length) return null
  const win = ladderWindow(bank, exposure, n)
  return { ...win[0].lv, [key]: win.map(w => w.item) }
}
