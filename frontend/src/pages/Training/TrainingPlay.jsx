import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Trophy, Timer, CircleCheck, CircleX, SkipForward, ArrowRight, Loader2, ChartBar, Clock } from 'lucide-react';
import { getQuestions, saveTrainingStats } from '../../api/learningApi';

export default function TrainingPlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId, sessionId, mode, lessonTitle, type } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [choices, setChoices] = useState([]);
  const [stats, setStats] = useState({
    correct: 0,
    wrong: 0,
    startTime: Date.now(),
    answersTimes: []
  });
  const [lastAnswerTime, setLastAnswerTime] = useState(Date.now());

  const inputRef = useRef(null);

  useEffect(() => {
    if (!quizId) {
      navigate('/');
      return;
    }

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestions(quizId);
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [quizId]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      if (mode === 'pick') {
        generateChoices();
      }
      setLastAnswerTime(Date.now());
      setIsAnswered(false);
      setIsCorrect(null);
      setUserAnswer('');
      
      // Auto focus input in type mode
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [currentIndex, questions]);

  const generateChoices = () => {
    const current = questions[currentIndex];
    const correct = getTargetValue(current);
    
    // Pick 3 random wrong answers from other questions
    let wrongOnes = questions
      .filter(q => getTargetValue(q) !== correct)
      .map(q => getTargetValue(q));
    
    // Shuffle and pick 3
    const shuffledWrong = [...new Set(wrongOnes)].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine and shuffle
    const allChoices = [...shuffledWrong, correct].sort(() => 0.5 - Math.random());
    setChoices(allChoices);
  };

  const getTargetValue = (q) => {
    if (type === 'Kana') return q.Romaji;
    if (type === 'Kanji' || type === 'Vocabulary') return q.Meaning;
    return '';
  };

  const getQuestionChar = (q) => {
    if (type === 'Kana') return q.Character;
    if (type === 'Kanji') return q.Character;
    if (type === 'Vocabulary') return q.Word;
    return '';
  };

  const checkAnswer = (answer) => {
    if (isAnswered) return;

    const current = questions[currentIndex];
    const correctValue = getTargetValue(current).toLowerCase().trim();
    const providedValue = answer.toLowerCase().trim();
    
    const correct = providedValue === correctValue;
    const now = Date.now();
    const timeToAnswer = (now - lastAnswerTime) / 1000;

    setIsAnswered(true);
    setIsCorrect(correct);
    setUserAnswer(answer);
    
    setStats(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      wrong: !correct ? prev.wrong + 1 : prev.wrong,
      answersTimes: [...prev.answersTimes, timeToAnswer]
    }));

    // Auto next after delay if correct in pick mode
    if (correct && mode === 'pick') {
      setTimeout(handleNext, 800);
    }
  };

  const handleSkip = () => {
    if (isAnswered) return;
    checkAnswer(''); // Check empty answer (which translates to wrong)
  };

  const handleExit = () => {
    if (type) {
       navigate(`/${type.toLowerCase()}`, { replace: true });
    } else {
       navigate('/', { replace: true });
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish Session
      await finishSession();
    }
  };

  const finishSession = async () => {
    const totalTime = (Date.now() - stats.startTime) / 1000;
    const accuracy = (stats.correct / questions.length) * 100;
    
    const finalStats = {
      sessionId,
      score: stats.correct * 10,
      accuracyRate: accuracy,
      timeTaken: totalTime,
      heartsRemaining: null // Assuming endless/no heart system for now
    };

    try {
      await saveTrainingStats(finalStats);
      
      // Calculate additional metrics for UI
      const avgTime = stats.answersTimes.reduce((a, b) => a + b, 0) / stats.answersTimes.length;
      const fastest = Math.min(...stats.answersTimes);
      const slowest = Math.max(...stats.answersTimes);

      navigate('/training/stats', { 
        replace: true,
        state: { 
          stats: {
            ...finalStats,
            totalAnswers: questions.length,
            correct: stats.correct,
            wrong: stats.wrong,
            avgTime,
            fastest,
            slowest
          },
          lessonTitle,
          type
        } 
      });
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      
      {/* Top Navigation Bar */}
      <div className="px-6 py-8 flex items-center justify-between">
         <button onClick={handleExit} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer z-50">
            <X size={20} />
         </button>
         
         <div className="flex-1 max-w-md mx-8">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_white]"
                 style={{ width: `${progress}%` }}
               />
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <CircleCheck size={18} className="text-green-500" />
               <span className="font-bold text-lg">{stats.correct}</span>
            </div>
            <div className="flex items-center gap-2">
               <CircleX size={18} className="text-red-500" />
               <span className="font-bold text-lg">{stats.wrong}</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
               <ChartBar size={18} />
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
         
         <div className="text-center mb-16">
            <span className="text-gray-500 text-lg uppercase tracking-widest font-bold block mb-4">
              {mode} mode • {currentIndex + 1} of {questions.length}
            </span>
            <div className="text-[120px] font-black leading-none tracking-tighter">
              {getQuestionChar(currentQ)}
            </div>
         </div>

         {/* Mode Dependent Area */}
         <div className="w-full max-w-xl">
           
           {mode === 'pick' ? (
             <div className="grid grid-cols-2 gap-4">
                {choices.map((choice, i) => {
                  const isChoiceCorrect = choice === getTargetValue(currentQ);
                  const isChoiceSelected = userAnswer === choice;
                  
                  let style = "bg-[#141414] border-white/5 text-white hover:border-white/20";
                  if (isAnswered) {
                    if (isChoiceCorrect) style = "bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
                    else if (isChoiceSelected && !isCorrect) style = "bg-red-500/20 border-red-500 text-red-500 animate-shake";
                  }

                  return (
                    <button 
                      key={i}
                      disabled={isAnswered}
                      onClick={() => checkAnswer(choice)}
                      className={`p-8 rounded-2xl border text-3xl font-bold transition-all transform active:scale-[0.98] ${style}`}
                    >
                      {choice}
                    </button>
                  );
                })}
             </div>
           ) : (
             <div className="space-y-6">
                <div className={`relative p-1 rounded-2xl transition-all ${
                  isAnswered 
                  ? (isCorrect ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]') 
                  : 'bg-white/10 focus-within:bg-white'
                }`}>
                   <input 
                     ref={inputRef}
                     type="text" 
                     value={userAnswer}
                     onChange={(e) => !isAnswered && setUserAnswer(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         if (!isAnswered) checkAnswer(userAnswer);
                         else handleNext();
                       }
                     }}
                     autoComplete="off"
                     autoCorrect="off"
                     placeholder="Type the reading..."
                     className={`w-full bg-[#0a0a0a] rounded-[14px] p-6 text-2xl font-bold text-center border-none outline-none transition-colors ${
                       isAnswered ? 'text-white' : 'text-white group-focus-within:text-black'
                     }`}
                   />
                </div>
                
                {isAnswered && !isCorrect && (
                  <div className="text-center text-red-500 text-xl font-bold animate-fadeIn">
                     Correct: <span className="underline">{getTargetValue(currentQ)}</span>
                  </div>
                )}
             </div>
           )}

         </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-8 border-t border-white/5 flex items-center justify-between">
         <button 
           onClick={handleSkip}
           disabled={isAnswered}
           className="flex items-center gap-2 text-gray-500 font-bold hover:text-white transition-colors disabled:opacity-50"
         >
            <SkipForward size={20} />
            SKIP
         </button>
         
         <button 
            onClick={isAnswered ? handleNext : () => checkAnswer(userAnswer)}
            className={`px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all min-w-[200px] justify-center ${
              (userAnswer || isAnswered) 
              ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:scale-[1.05]' 
              : 'bg-white/5 text-gray-600 grayscale'
            }`}
         >
            {isAnswered ? 'CONTINUE' : 'CHECK'}
            <ArrowRight size={24} />
         </button>
      </div>

    </div>
  );
}

