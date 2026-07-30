'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw } from 'lucide-react';

export interface MotivationQuote {
  quote: string;
  author: string;
}

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { quote: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { quote: "Focus on progress, not perfection.", author: "Bill Phillips" },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { quote: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { quote: "First we make our habits, then our habits make us.", author: "John Dryden" },
  { quote: "Continuous effort, not strength or intelligence, is the key to unlocking our potential.", author: "Winston Churchill" },
  { quote: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { quote: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { quote: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { quote: "Small steps in the right direction can turn out to be the biggest step of your life.", author: "Unknown" },
  { quote: "Motivation gets you going, but habit gets you there.", author: "Zig Ziglar" },
  { quote: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { quote: "Patience, persistence and perspiration make an unbeatable combination for success.", author: "Napoleon Hill" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Mastering others is strength. Mastering yourself is true power.", author: "Lao Tzu" },
  { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
  { quote: "To govern yourself is the greatest empire.", author: "Seneca" },
  { quote: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { quote: "Difficulty is what wakes up the genius.", author: "Nassim Nicholas Taleb" },
  { quote: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { quote: "If you are working on something that you really care about, you don't have to be pushed.", author: "Steve Jobs" },
  { quote: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "Never surrender your momentum to minor distractions.", author: "Epictetus" },
  { quote: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { quote: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
  { quote: "Be not afraid of going slowly, be afraid only of standing still.", author: "Chinese Proverb" },
  { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
  { quote: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { quote: "Perfection is not attainable, but if we chase perfection we can catch excellence.", author: "Vince Lombardi" },
  { quote: "Character is destiny.", author: "Heraclitus" },
  { quote: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { quote: "Show me your habits and I will show you your future.", author: "Mark Batterson" },
  { quote: "Success is built day by day, not in a single leap.", author: "Unknown" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Visualise your goal, execution will follow.", author: "Kobe Bryant" },
  { quote: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { quote: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
  { quote: "Step by step, day by day, we forge our destiny.", author: "Seneca" },
  { quote: "He who moves with purpose cannot be easily shaken.", author: "Epictetus" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { quote: "Consistency over intensity produces enduring success.", author: "Unknown" },
  { quote: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { quote: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { quote: "Courage is resistance to fear, mastery of fear - not absence of fear.", author: "Mark Twain" },
  { quote: "What you do every day matters more than what you do every once in a while.", author: "Gretchen Rubin" },
  { quote: "Action expresses priorities.", author: "Mahatma Gandhi" },
  { quote: "Light tomorrow with today.", author: "Elizabeth Barrett Browning" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { quote: "No citizen has a right to be an amateur in the matter of physical and mental training.", author: "Socrates" },
  { quote: "Discipline is freedom.", author: "Jocko Willink" },
  { quote: "Win the morning, win the day.", author: "Tim Ferriss" },
  { quote: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb" },
  { quote: "Success is how high you bounce when you hit bottom.", author: "George S. Patton" },
  { quote: "Build habits that strengthen your mind, body, and soul.", author: "Unknown" },
  { quote: "Focus on the process, and the outcome will take care of itself.", author: "Nick Saban" },
  { quote: "Clear your mind of can't.", author: "Samuel Johnson" },
  { quote: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
  { quote: "Create the highest, grandest vision possible for your life.", author: "Oprah Winfrey" },
  { quote: "If you cannot do great things, do small things in a great way.", author: "Napoleon Hill" },
  { quote: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { quote: "Little by little, a little becomes a lot.", author: "Tanzanian Proverb" },
  { quote: "Without self-discipline, success is impossible.", author: "Lou Holtz" },
  { quote: "The power of habit is stronger than willpower.", author: "Charles Duhigg" },
  { quote: "The distance between dreams and reality is called action.", author: "Unknown" },
  { quote: "Do not let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { quote: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
  { quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { quote: "Small keys open big locks.", author: "Turkish Proverb" },
  { quote: "What we fear of doing most is usually what we most need to do.", author: "Tim Ferriss" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { quote: "Habit is a cable; we weave a thread of it each day.", author: "Horace Mann" },
  { quote: "The energy of the mind is the essence of life.", author: "Aristotle" },
  { quote: "Greatness is consistency in the fundamentals.", author: "Ray Dalio" },
  { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { quote: "You can't cross the sea merely by standing and staring at the water.", author: "Rabindranath Tagore" },
  { quote: "Drop by drop, the bucket gets filled.", author: "Buddha" },
  { quote: "The key to immortality is first living a life worth remembering.", author: "Bruce Lee" },
  { quote: "An unexamined life is not worth living.", author: "Socrates" },
  { quote: "Commitment is doing the thing you said you would do.", author: "Darren Hardy" },
  { quote: "Small wins compound into giant breakthroughs.", author: "Unknown" },
  { quote: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { quote: "Keep your face always toward the sunshine - and shadows will fall behind you.", author: "Walt Whitman" }
];

export const MotivationCard: React.FC = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MOTIVATION_QUOTES.length));

  const pickNextRandom = () => {
    setIndex((prev) => {
      let next = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
      if (MOTIVATION_QUOTES.length > 1 && next === prev) {
        next = (next + 1) % MOTIVATION_QUOTES.length;
      }
      return next;
    });
  };

  useEffect(() => {
    // Auto cycle random quote every 8 seconds with smooth fade
    const timer = setInterval(() => {
      pickNextRandom();
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    pickNextRandom();
  };

  const current = MOTIVATION_QUOTES[index];

  return (
    <div className="claude-card p-5 border-l-4 border-[var(--green)] select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" 
            style={{ background: 'var(--green)', borderRadius: '10px' }}
          >
            <Quote className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header with NO emoji */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h4 className="text-[11px] font-mono text-[var(--green)] uppercase tracking-wider font-bold">
                MOTIVATION
              </h4>

              <button
                onClick={handleNext}
                title="Next Quote"
                className="p-1 rounded-lg text-[var(--muted-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Smooth Fade In / Out Animated Quote */}
            <div className="min-h-[48px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="space-y-1"
                >
                  <p className="text-sm font-medium text-[var(--body)] leading-relaxed font-serif italic">
                    "{current.quote}"
                  </p>
                  <p className="text-[11px] font-mono text-[var(--muted-soft)] font-medium">
                    — {current.author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
