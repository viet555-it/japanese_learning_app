import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, MousePointer2, Keyboard, CircleCheck, Loader2 } from 'lucide-react';
import { getLessons, getQuizzesByLesson, createTrainingSession } from '../../api/learningApi';
import { useAuth } from '../../context/AuthContext';

export default function TrainingSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { lessonId, type } = location.state || {};
  
  const [lesson, setLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('pick'); // 'pick' or 'type'

  useEffect(() => {
    if (!lessonId) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch lessons to get title
        const lessons = await getLessons({ type });
        const currentLesson = lessons.find(l => l.LessonID === lessonId);
        setLesson(currentLesson);

        // Fetch available quizzes for this lesson
        const quizData = await getQuizzesByLesson(lessonId);
        setQuizzes(quizData);
      } catch (error) {
        console.error("Error loading setup data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, type]);

  const handleStart = async () => {
    if (quizzes.length === 0) {
      alert("No quizzes available for this lesson yet.");
      return;
    }

    try {
      // Create session in backend
      const session = await createTrainingSession(user?.UserID || null, lessonId);
      
      // Navigate to Play page
      navigate('/training/play', { 
        state: { 
          quizId: quizzes[0].QuizID, 
          sessionId: session.sessionId,
          mode,
          lessonTitle: lesson?.Title,
          type
        } 
      });
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            {type} Training
          </h1>
          <p className="text-gray-400 text-lg">Practice in a classic, endless way</p>
        </div>

        {/* Info Card */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <CircleCheck size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Selected Lesson:</span>
          </div>
          <div className="pl-11">
             <div className="text-2xl font-bold text-[#6a9fc0]">{lesson?.Title}</div>
             <div className="text-gray-500 mt-1">{type} • Level {lesson?.JLPT_Level || 'Basic'}</div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="space-y-4 mb-12">
           <button 
             onClick={() => setMode('pick')}
             className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-6 group ${
               mode === 'pick' ? 'bg-white border-white scale-[1.02]' : 'bg-[#141414] border-white/5 hover:border-white/20'
             }`}
           >
             <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
               mode === 'pick' ? 'bg-black text-white' : 'bg-white/5 text-gray-400'
             }`}>
               <MousePointer2 size={24} />
             </div>
             <div className="text-left flex-1">
               <div className={`text-xl font-bold ${mode === 'pick' ? 'text-black' : 'text-white'}`}>Pick</div>
               <div className={mode === 'pick' ? 'text-black/60' : 'text-gray-500'}>Pick the correct answer from multiple options</div>
             </div>
             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
               mode === 'pick' ? 'border-black' : 'border-white/20'
             }`}>
               {mode === 'pick' && <div className="w-3 h-3 rounded-full bg-black" />}
             </div>
           </button>

           <button 
             onClick={() => setMode('type')}
             className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-6 group ${
               mode === 'type' ? 'bg-white border-white scale-[1.02]' : 'bg-[#141414] border-white/5 hover:border-white/20'
             }`}
           >
             <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
               mode === 'type' ? 'bg-black text-white' : 'bg-white/5 text-gray-400'
             }`}>
               <Keyboard size={24} />
             </div>
             <div className="text-left flex-1">
               <div className={`text-xl font-bold ${mode === 'type' ? 'text-black' : 'text-white'}`}>Type</div>
               <div className={mode === 'type' ? 'text-black/60' : 'text-gray-500'}>Type the correct answer</div>
             </div>
             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
               mode === 'type' ? 'border-black' : 'border-white/20'
             }`}>
               {mode === 'type' && <div className="w-3 h-3 rounded-full bg-black" />}
             </div>
           </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
           <button 
             onClick={() => navigate(-1)}
             className="flex-1 py-5 rounded-2xl bg-[#2a2a2a] text-white font-bold text-lg hover:bg-[#333] transition-all flex items-center justify-center gap-2"
           >
             <ArrowLeft size={20} />
             Back
           </button>
           <button 
             onClick={handleStart}
             className="flex-[2] py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
           >
             <Play size={20} fill="black" />
             Start Training
           </button>
        </div>

      </div>
    </div>
  );
}
