/**
 * for-you.ts — Secret /for-you page content.
 * Edit reasons, private letter, and gallery here.
 */

import { SITE_CONFIG } from "./content";

export const SECRET_GALLERY = [
  {
    id: "sec-1",
    url: "/images/moments/01.jpg",
    caption: "Clocked in together — my favourite co-worker.",
    date: "",
  },
  {
    id: "sec-2",
    url: "/images/moments/02.jpg",
    caption: "Up in the clouds, still choosing you.",
    date: "",
  },
  {
    id: "sec-3",
    url: "/images/moments/03.jpg",
    caption: "Mountains behind us. Forever ahead.",
    date: "",
  },
  {
    id: "sec-4",
    url: "/images/moments/04.jpg",
    caption: "The day everything changed — yes forever.",
    date: "",
  },
  {
    id: "sec-5",
    url: "/images/moments/05.jpg",
    caption: "Stolen kisses and late-night laughs.",
    date: "",
  },
  {
    id: "sec-6",
    url: "/images/moments/06.jpg",
    caption: "Happy birthday, my love — cake and roses.",
    date: "",
  },
  {
    id: "sec-7",
    url: "/images/moments/07.jpg",
    caption: "Just us in the back seat of forever.",
    date: "",
  },
];

export const FIFTY_REASONS = [
  "1. The way your eyes light up when you talk about something you're passionate about.",
  "2. How you somehow know exactly when I need a hug without me saying a word.",
  "3. The tiny nose scrunch you do when you're concentrating.",
  "4. Your laugh — the loud, unguarded one that makes my entire day brighter.",
  "5. How safe I feel just sitting in silence next to you.",
  "6. The way you care for your friends with fierce loyalty.",
  "7. Your resilience — you've walked through hard days and kept your heart soft.",
  "8. How you remember the smallest details about the things I like.",
  "9. The gentle way your fingers move when we're watching something together.",
  "10. Your ambition and the fire in you when you set your mind on a goal.",
  "11. The way your hair smells like something entirely uniquely you.",
  "12. How you challenge me to be better by inspiring it, not demanding it.",
  "13. Your ridiculous jokes that somehow make me laugh harder than good ones.",
  "14. The fact that you sing completely out of tune in the car and own it.",
  "15. How fiercely independent you are, yet how willingly you share your world.",
  "16. The way you drag me outside to look at the moon or a sunset.",
  "17. Your kindness to strangers — it shows the gold in your heart.",
  "18. How you fit into spaces of my soul I didn't know were empty.",
  "19. The way you sleep — tangled in blankets, completely at peace.",
  "20. Your stubbornness when you know you're right (and you usually are).",
  "21. How you make mundane things like grocery runs feel like an adventure.",
  "22. The empathy in your voice when someone is hurting.",
  "23. That specific smile from across a room that says I see you.",
  "24. How you steal the covers and I somehow never mind.",
  "25. Your courage to be vulnerable with me.",
  "26. The way you lose track of time in a good book or a good song.",
  "27. How your hand feels perfectly made to hold mine.",
  "28. The little sounds you make when you're stretching in the morning.",
  "29. Your ability to find a silver lining in almost anything.",
  "30. How passionately you argue over movie plots.",
  "31. The way you look at me like I am the only person in the room.",
  "32. Your patience with me on my worst days.",
  "33. How you can say a whole paragraph with one raised eyebrow.",
  "34. The feeling of home the second I see you.",
  "35. Your sweet tooth and how excited you get over dessert.",
  "36. How deeply you love — holding nothing back.",
  "37. The way you hum to yourself while doing ordinary things.",
  "38. Your inability to lie to me — your face gives you away every time.",
  "39. How you ground me when my thoughts spiral.",
  "40. The way you believed in me before I knew how to believe in myself.",
  "41. How seamlessly our lives merged.",
  "42. Your curiosity about the world.",
  "43. The quiet sleepy I love you's before you drift off.",
  "44. How you defend the people you love.",
  "45. The way your face softens around animals.",
  "46. How you are both my safest harbor and my greatest adventure.",
  "47. The beautiful mess you make when you bake.",
  "48. Your mind — endlessly fascinating.",
  "49. The simple fact that you chose me.",
  `50. Because you are ${SITE_CONFIG.herName}. And loving you is the easiest thing I have ever done.`,
];

export const SECRET_LETTER = {
  title: "To My Forever,",
  paragraphs: [
    `I don't think I'll ever fully find the right words for the day everything changed. I thought it was just another day. I had no idea I was looking at the person who would rewrite the rest of my life.`,
    `You haven't just been my partner — you've been my sanctuary. The world can be loud, but with you everything goes quiet. You are the deep breath my soul takes.`,
    `I've watched you grow, fight, triumph, and heal. With every day my respect for you deepens. Someone as extraordinary as you choosing me is the greatest honor of my life.`,
    `This page is hidden because these words aren't for the world. They are just for you — a quiet corner where I can remind you that you are my favourite person, my best friend, and the love of my life.`,
    `Happy Birthday, my beautiful ${SITE_CONFIG.herName}. You are my today, and you are all of my tomorrows.`,
  ],
  signoff: "Forever entirely yours,",
  signature: SITE_CONFIG.yourName,
};
