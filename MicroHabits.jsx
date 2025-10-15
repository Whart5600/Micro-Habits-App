import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Home, Plus, Trash2, Edit2, Code, Eye, Target, LogIn, UserPlus, LogOut, User } from 'lucide-react';

const MicroHabitsApp = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const [viewMode, setViewMode] = useState('preview');
  const [habits, setHabits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [editingHabit, setEditingHabit] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editableCode, setEditableCode] = useState('');
  const [newHabit, setNewHabit] = useState({
    name: '',
    time: '',
    days: [],
    color: '#60a5fa',
    startDate: '',
    endDate: ''
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    steps: [],
    color: '#60a5fa'
  });
  const [newStep, setNewStep] = useState('');
  const [pressedHabit, setPressedHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [metricsDate, setMetricsDate] = useState(new Date());
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ emailOrUsername: '', password: '', name: '', username: '' });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'];

  useEffect(() => {
    const savedUser = localStorage.getItem('microHabitsUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadUserData(userData.email);
    }
  }, []);

  const loadUserData = (email) => {
    const userKey = `microHabits_${email}`;
    const saved = localStorage.getItem(userKey);
    if (saved) {
      const data = JSON.parse(saved);
      setHabits(data.habits || []);
      setProjects(data.projects || []);
    }
  };

  const saveUserData = (email, habitsData, projectsData) => {
    const userKey = `microHabits_${email}`;
    localStorage.setItem(userKey, JSON.stringify({
      habits: habitsData,
      projects: projectsData
    }));
  };

  useEffect(() => {
    if (user) {
      saveUserData(user.email, habits, projects);
    }
  }, [habits, projects, user]);

  const handleAuth = () => {
    if (authMode === 'signin') {
      // Sign in with username only
      if (!authForm.emailOrUsername.trim()) {
        alert('Please enter your username');
        return;
      }
      
      // Search for username
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('microHabitsUser_'));
      let savedUser = null;
      let userKey = null;
      
      for (const key of userKeys) {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData.username === authForm.emailOrUsername) {
          savedUser = localStorage.getItem(key);
          userKey = key;
          break;
        }
      }
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.password === authForm.password) {
          const userInfo = { 
            name: userData.name, 
            username: userData.username 
          };
          setUser(userInfo);
          localStorage.setItem('microHabitsUser', JSON.stringify(userInfo));
          loadUserData(userData.username);
          setShowAuthModal(false);
          setAuthForm({ emailOrUsername: '', password: '', name: '', username: '' });
        } else {
          alert('Incorrect password');
        }
      } else {
        alert('User not found');
      }
    } else {
      // Sign up
      if (!authForm.username || authForm.username.trim() === '') {
        alert('Please enter a username');
        return;
      }
      
      // Check if username already exists
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('microHabitsUser_'));
      for (const key of userKeys) {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData.username === authForm.username) {
          alert('This username is already taken');
          return;
        }
      }
      
      const userKey = `microHabitsUser_${authForm.username}`;
      localStorage.setItem(userKey, JSON.stringify({
        password: authForm.password,
        name: authForm.name || authForm.username,
        username: authForm.username
      }));
      const userInfo = { 
        name: authForm.name || authForm.username, 
        username: authForm.username 
      };
      setUser(userInfo);
      localStorage.setItem('microHabitsUser', JSON.stringify(userInfo));
      setShowAuthModal(false);
      setAuthForm({ emailOrUsername: '', password: '', name: '', username: '' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setHabits([]);
    setProjects([]);
    localStorage.removeItem('microHabitsUser');
  };

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const createHabit = () => {
    if (!user) {
      alert('Please sign in to create habits');
      return;
    }
    if (newHabit.name.trim()) {
      if (editingHabit) {
        setHabits(habits.map(h => h.id === editingHabit.id ? { ...editingHabit, ...newHabit } : h));
        setEditingHabit(null);
      } else {
        setHabits([...habits, { 
          ...newHabit, 
          id: Date.now(), 
          completedDates: [],
          createdDate: getTodayString()
        }]);
      }
      setNewHabit({ name: '', time: '', days: [], color: '#60a5fa' });
      setShowCreateModal(false);
    }
  };

  const createProject = () => {
    if (!user) {
      alert('Please sign in to create projects');
      return;
    }
    if (newProject.name.trim()) {
      if (editingProject) {
        setProjects(projects.map(p => p.id === editingProject.id ? { ...editingProject, ...newProject } : p));
        setEditingProject(null);
      } else {
        setProjects([...projects, {
          ...newProject,
          id: Date.now(),
          createdDate: getTodayString()
        }]);
      }
      setNewProject({ name: '', description: '', steps: [], color: '#60a5fa' });
      setShowProjectModal(false);
    }
  };

  const addStep = () => {
    if (newStep.trim()) {
      setNewProject({
        ...newProject,
        steps: [...newProject.steps, { id: Date.now(), text: newStep, completed: false }]
      });
      setNewStep('');
    }
  };

  const toggleStepComplete = (projectId, stepId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          steps: project.steps.map(step =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          )
        };
      }
      return project;
    }));
  };

  const deleteStep = (stepId) => {
    setNewProject({
      ...newProject,
      steps: newProject.steps.filter(s => s.id !== stepId)
    });
  };

  const toggleHabitComplete = (habitId) => {
    const today = getTodayString();
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completedDates || [];
        if (completed.includes(today)) {
          return { ...habit, completedDates: completed.filter(d => d !== today) };
        } else {
          return { ...habit, completedDates: [...completed, today] };
        }
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const startEditHabit = (habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      time: habit.time,
      days: habit.days,
      color: habit.color,
      startDate: habit.startDate || '',
      endDate: habit.endDate || ''
    });
    setShowCreateModal(true);
  };

  const startEditProject = (project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      steps: project.steps,
      color: project.color
    });
    setShowProjectModal(true);
  };

  const calculateStreak = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const sorted = [...habit.completedDates].sort().reverse();
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sorted.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkString = checkDate.toISOString().split('T')[0];
      
      if (sorted.includes(checkString)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getStreakForMonth = (habit, date) => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const completedInMonth = habit.completedDates.filter(dateStr => {
      const d = new Date(dateStr);
      return d >= firstDay && d <= lastDay;
    });
    
    return completedInMonth.length;
  };

  const isHabitActiveOnDate = (habit, date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    if (habit.startDate && dateStr < habit.startDate) return false;
    if (habit.endDate && dateStr > habit.endDate) return false;
    
    return true;
  };

  const isHabitCompletedToday = (habit) => {
    return habit.completedDates?.includes(getTodayString()) || false;
  };

  const isHabitCompletedOnDate = (habit, date) => {
    return habit.completedDates?.includes(getDateString(date)) || false;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
    const blanks = Array((startingDayOfWeek + 6) % 7).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <div key={i} className="text-center text-sm font-semibold text-cyan-400 mb-2">
            {day}
          </div>
        ))}
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map(day => {
          const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
          const dateString = getDateString(date);
          const completedHabits = habits.filter(h => h.completedDates?.includes(dateString));
          const isToday = dateString === getTodayString();
          const isViewDate = getDateString(viewDate) === dateString;
          
          return (
            <button
              key={day}
              onClick={() => setViewDate(date)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${
                isViewDate ? 'border-purple-400 bg-purple-900/40 shadow-lg shadow-purple-500/50 scale-105' :
                isToday ? 'border-cyan-400 bg-cyan-900/30 shadow-lg shadow-cyan-500/50' : 
                'border-cyan-800/50 bg-gray-900/30 hover:border-cyan-600/50 hover:bg-cyan-900/20'
              } relative backdrop-blur-sm cursor-pointer`}
            >
              <span className={`text-sm ${
                isViewDate ? 'font-bold text-purple-300' :
                isToday ? 'font-bold text-cyan-300' : 
                'text-gray-400'
              }`}>
                {day}
              </span>
              {completedHabits.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {completedHabits.slice(0, 3).map((habit, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full shadow-lg"
                      style={{ 
                        backgroundColor: habit.color,
                        boxShadow: `0 0 8px ${habit.color}`
                      }}
                    />
                  ))}
                  {completedHabits.length > 3 && (
                    <div className="text-xs text-cyan-400">+{completedHabits.length - 3}</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const getCodeForCurrentTab = () => {
    const code = {
      landing: `// LANDING PAGE CODE - Edit this code and click "Apply Changes"
const LandingPage = () => {
  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text 
          bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{
            textShadow: '0 0 40px rgba(6,182,212,0.6)'
          }}>
          Micro Habits
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Small steps, big momentum. Build atomic habits that transform your life.
        </p>
        
        <div className="space-y-4">
          <button 
            className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 
              text-white rounded-2xl font-semibold text-lg"
            onClick={() => setActiveTab('home')}
          >
            Get Started
          </button>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-900/40 p-4 rounded-xl border border-cyan-500/30">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm text-gray-300">Track Habits</p>
            </div>
            <div className="bg-gray-900/40 p-4 rounded-xl border border-cyan-500/30">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm text-gray-300">View Metrics</p>
            </div>
            <div className="bg-gray-900/40 p-4 rounded-xl border border-cyan-500/30">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-gray-300">Plan Projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};`,
      home: `// HOME PAGE CODE - Edit this code and click "Apply Changes"
const HomePage = () => {
  return (
    <div className="p-6 space-y-4">
      {habits.map(habit => {
        const streak = calculateStreak(habit);
        return (
          <div
            key={habit.id}
            className="relative bg-gray-900/40 rounded-2xl p-5 
              border-2 border-cyan-500/30 backdrop-blur-sm"
            onClick={() => toggleHabitComplete(habit.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 rounded-full"
                  style={{ 
                    backgroundColor: habit.color,
                    boxShadow: \`0 0 20px \${habit.color}\`
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-100 text-lg">
                    {habit.name}
                  </h3>
                  <p className="text-sm text-cyan-400 font-bold">
                    {streak} day streak 🔥
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold text-cyan-300">
                {streak}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Note: This is a simplified version for editing.
// The actual page includes edit/delete buttons and more features.`,

      calendar: `// CALENDAR PAGE CODE - Edit this code and click "Apply Changes"
const CalendarPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={previousMonth}
          className="px-4 py-2 bg-cyan-500/20 rounded-lg 
            border border-cyan-500/50 text-cyan-300"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-cyan-300">
          {selectedDate.toLocaleDateString('en-US', { 
            month: 'long', year: 'numeric' 
          })}
        </h2>
        <button 
          onClick={nextMonth}
          className="px-4 py-2 bg-cyan-500/20 rounded-lg 
            border border-cyan-500/50 text-cyan-300"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
          <div key={day} className="text-center text-cyan-400">
            {day}
          </div>
        ))}
        {/* Calendar grid renders here */}
      </div>
    </div>
  );
};`,

      metrics: `// METRICS PAGE CODE - Edit this code and click "Apply Changes"
const MetricsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-cyan-300">
        Your Streaks
      </h2>
      {habits.map(habit => {
        const streak = calculateStreak(habit);
        const total = habit.completedDates?.length || 0;
        
        return (
          <div 
            key={habit.id} 
            className="bg-gray-900/40 rounded-2xl p-6 
              border-2 border-cyan-500/30"
          >
            <h3 className="font-bold text-xl text-gray-100 mb-4">
              {habit.name}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-xl p-4">
                <p className="text-sm text-gray-400">Current Streak</p>
                <p className="text-3xl font-bold text-cyan-300">
                  {streak}
                </p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              
              <div className="bg-black/40 rounded-xl p-4">
                <p className="text-sm text-gray-400">Total Completed</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {total}
                </p>
                <p className="text-xs text-gray-500">times</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};`,

      projects: `// PROJECTS PAGE CODE - Edit this code and click "Apply Changes"
const ProjectsPage = () => {
  return (
    <div className="p-6 space-y-4">
      {projects.map(project => {
        const completed = project.steps.filter(s => s.completed).length;
        const total = project.steps.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        
        return (
          <div 
            key={project.id}
            className="bg-gray-900/40 rounded-2xl p-6 
              border-2 border-cyan-500/30"
          >
            <h3 className="font-bold text-xl text-gray-100 mb-2">
              {project.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {project.description}
            </p>
            
            {/* Neon Progress Bar */}
            <div className="h-3 bg-gray-800 rounded-full mb-4">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: \`\${progress}%\`,
                  backgroundColor: project.color,
                  boxShadow: \`0 0 15px \${project.color}\`
                }}
              />
            </div>
            
            <div className="space-y-2">
              {project.steps.map((step, idx) => (
                <div 
                  key={step.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                >
                  <input 
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => toggleStep(project.id, step.id)}
                  />
                  <span className={step.completed ? 'line-through' : ''}>
                    {idx + 1}. {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};`
    };
    
    return code[activeTab] || '// Select a tab to view its code';
  };

  useEffect(() => {
    setEditableCode(getCodeForCurrentTab());
  }, [activeTab, habits, projects]);

  const applyCodeChanges = () => {
    try {
      // Validate that the code is not empty
      if (!editableCode.trim()) {
        alert('Code cannot be empty');
        return;
      }
      
      // Store the edited code in localStorage
      const customCodeKey = `microHabits_customCode_${user?.username || 'guest'}_${activeTab}`;
      localStorage.setItem(customCodeKey, editableCode);
      
      // Also update the state to reflect changes immediately
      setEditableCode(editableCode);
      
      alert('✅ Code changes saved successfully! Your customizations have been stored.');
    } catch (error) {
      alert('❌ Error applying changes: ' + error.message);
    }
  };

  const renderContent = () => {
    if (viewMode === 'code') {
      return (
        <div className="p-6 h-full flex flex-col bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-cyan-300 font-semibold">Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page Code</h3>
            <button
              onClick={applyCodeChanges}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 border border-cyan-400/50 font-semibold"
            >
              Apply Changes
            </button>
          </div>
          <textarea
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            className="flex-1 bg-black/60 text-green-400 p-6 rounded-xl text-sm border border-cyan-500/30 backdrop-blur-sm font-mono resize-none focus:outline-none focus:border-cyan-500"
            spellCheck="false"
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Edit the code above and click "Apply Changes" to save your customizations
          </p>
        </div>
      );
    }

    if (activeTab === 'landing') {
      return (
        <div className="p-6 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center max-w-2xl">
            <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500"
                style={{
                  textShadow: '0 0 40px rgba(6,182,212,0.6)'
                }}>
              Micro Habits
            </h1>
            
            <p className="text-2xl text-gray-300 mb-4 font-light">
              Small steps, big momentum
            </p>
            
            <p className="text-lg text-gray-400 mb-12">
              Build atomic habits that transform your life. Track daily progress, maintain streaks, and achieve your goals.
            </p>
            
            <button 
              className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 border border-cyan-400/50 mb-12"
              onClick={() => setActiveTab('home')}
            >
              Get Started →
            </button>
            
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-900/40 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-sm font-semibold text-cyan-300 mb-2">Track Habits</p>
                <p className="text-xs text-gray-400">Build consistent daily routines</p>
              </div>
              <div className="bg-gray-900/40 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-sm font-semibold text-cyan-300 mb-2">View Metrics</p>
                <p className="text-xs text-gray-400">Monitor your progress over time</p>
              </div>
              <div className="bg-gray-900/40 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
                <div className="text-4xl mb-3">🚀</div>
                <p className="text-sm font-semibold text-cyan-300 mb-2">Plan Projects</p>
                <p className="text-xs text-gray-400">Break down goals into steps</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'home') {
      return (
        <div className="p-6 space-y-4">
          {!user && (
            <div className="text-center py-8 bg-gray-900/40 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
              <p className="text-cyan-300 mb-4">Sign in to start building your micro habits</p>
            </div>
          )}
          {habits.length === 0 && user ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No habits yet. Start building your micro habits!</p>
            </div>
          ) : (
            habits.map(habit => {
              const streak = calculateStreak(habit);
              const isActive = isHabitActiveOnDate(habit, new Date());
              
              return (
                <div
                  key={habit.id}
                  className={`relative bg-gray-900/40 rounded-2xl p-5 border-2 transition-all duration-200 backdrop-blur-sm ${
                    !isActive ? 'opacity-50' :
                    isHabitCompletedToday(habit)
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
                      : 'border-cyan-800/50 hover:border-cyan-600/50 hover:shadow-lg hover:shadow-cyan-500/30'
                  } ${pressedHabit === habit.id ? 'scale-95' : 'scale-100'}`}
                  onMouseDown={() => isActive && setPressedHabit(habit.id)}
                  onMouseUp={() => {
                    if (isActive) {
                      setPressedHabit(null);
                      toggleHabitComplete(habit.id);
                    }
                  }}
                  onMouseLeave={() => setPressedHabit(null)}
                  onTouchStart={() => isActive && setPressedHabit(habit.id)}
                  onTouchEnd={() => {
                    if (isActive) {
                      setPressedHabit(null);
                      toggleHabitComplete(habit.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-12 rounded-full"
                        style={{ 
                          backgroundColor: habit.color,
                          boxShadow: `0 0 20px ${habit.color}`
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-100 text-lg">{habit.name}</h3>
                        {habit.time && (
                          <p className="text-sm text-gray-400">{habit.time}</p>
                        )}
                        <p className="text-sm text-cyan-400 font-bold mt-1">{streak} day streak 🔥</p>
                        {(habit.startDate || habit.endDate) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {habit.startDate && `From ${new Date(habit.startDate).toLocaleDateString()}`}
                            {habit.startDate && habit.endDate && ' - '}
                            {habit.endDate && `To ${new Date(habit.endDate).toLocaleDateString()}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-2">
                        <div className="text-3xl font-bold text-cyan-300">{streak}</div>
                        <div className="text-xs text-gray-500">DAYS</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditHabit(habit);
                        }}
                        className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHabit(habit.id);
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          isHabitCompletedToday(habit)
                            ? 'bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50'
                            : 'border-cyan-700'
                        }`}
                      >
                        {isHabitCompletedToday(habit) && (
                          <span className="text-gray-900 text-lg font-bold">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" 
                       style={{ 
                         boxShadow: pressedHabit === habit.id ? `inset 0 0 30px ${habit.color}40` : 'none'
                       }} 
                  />
                </div>
              );
            })
          )}

          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 border border-cyan-400/50"
            >
              <Plus className="w-5 h-5" />
              Create Habit
            </button>
          )}
        </div>
      );
    }

    if (activeTab === 'calendar') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/50"
            >
              ←
            </button>
            <h2 className="text-xl font-bold text-cyan-300">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/50"
            >
              →
            </button>
          </div>
          
          {renderCalendar()}
          
          {/* Selected Date Habits View */}
          <div className="mt-6 bg-gray-900/40 rounded-xl p-4 border border-cyan-500/30 backdrop-blur-sm">
            <h3 className="font-semibold text-cyan-300 mb-4 flex items-center justify-between">
              <span>Habits for {viewDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {getDateString(viewDate) !== getTodayString() && (
                <button
                  onClick={() => setViewDate(new Date())}
                  className="text-xs px-3 py-1 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                  Today
                </button>
              )}
            </h3>
            
            {habits.length === 0 ? (
              <p className="text-gray-400 text-sm">No habits created yet</p>
            ) : (
              <div className="space-y-2">
                {habits.filter(habit => isHabitActiveOnDate(habit, viewDate)).map(habit => {
                  const isCompleted = habit.completedDates?.includes(getDateString(viewDate));
                  return (
                    <div
                      key={habit.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isCompleted
                          ? 'bg-cyan-900/20 border-cyan-600/50'
                          : 'bg-black/20 border-gray-700/50'
                      }`}
                    >
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ 
                          backgroundColor: habit.color,
                          boxShadow: `0 0 10px ${habit.color}`
                        }}
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? 'text-cyan-300' : 'text-gray-200'}`}>
                          {habit.name}
                        </p>
                        {habit.time && (
                          <p className="text-xs text-gray-500">{habit.time}</p>
                        )}
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? 'bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50'
                            : 'border-cyan-700'
                        }`}
                      >
                        {isCompleted && (
                          <span className="text-gray-900 text-sm font-bold">✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {habits.filter(habit => isHabitActiveOnDate(habit, viewDate)).length === 0 && (
                  <p className="text-gray-400 text-sm">No active habits for this date</p>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-2 bg-gray-900/40 rounded-xl p-4 border border-cyan-500/30 backdrop-blur-sm">
            <h3 className="font-semibold text-cyan-300 mb-3">Habit Legend</h3>
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: habit.color,
                    boxShadow: `0 0 8px ${habit.color}`
                  }}
                />
                <span className="text-sm text-gray-300">{habit.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'metrics') {
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setMetricsDate(new Date(metricsDate.getFullYear(), metricsDate.getMonth() - 1))}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/50"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-cyan-300">
              {metricsDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setMetricsDate(new Date(metricsDate.getFullYear(), metricsDate.getMonth() + 1))}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/50"
            >
              →
            </button>
          </div>
          
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Create habits to track your streaks!</p>
            </div>
          ) : (
            habits.map(habit => {
              const currentStreak = calculateStreak(habit);
              const monthStreak = getStreakForMonth(habit, metricsDate);
              const totalCompleted = habit.completedDates?.length || 0;
              return (
                <div
                  key={habit.id}
                  className="bg-gray-900/40 rounded-2xl p-6 border-2 border-cyan-500/30 shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-16 rounded-full"
                        style={{ 
                          backgroundColor: habit.color,
                          boxShadow: `0 0 20px ${habit.color}`
                        }}
                      />
                      <h3 className="font-bold text-xl text-gray-100">{habit.name}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/40 rounded-xl p-4 border border-cyan-600/30">
                      <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                      <p className="text-3xl font-bold text-cyan-300">
                        {currentStreak}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">days</p>
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-4 border border-cyan-600/30">
                      <p className="text-sm text-gray-400 mb-1">This Month</p>
                      <p className="text-3xl font-bold text-purple-400">
                        {monthStreak}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">days</p>
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-4 border border-cyan-600/30">
                      <p className="text-sm text-gray-400 mb-1">Total</p>
                      <p className="text-3xl font-bold text-emerald-400">
                        {totalCompleted}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">times</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-black/40 rounded-xl p-4 border border-cyan-600/30">
                    <p className="text-sm text-gray-400 mb-2">Recent Activity</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const checkDate = new Date();
                        checkDate.setDate(checkDate.getDate() - (29 - i));
                        const isCompleted = isHabitCompletedOnDate(habit, checkDate);
                        return (
                          <div
                            key={i}
                            className={`flex-1 h-8 rounded ${
                              isCompleted 
                                ? 'opacity-100' 
                                : 'bg-gray-800'
                            }`}
                            style={{ 
                              backgroundColor: isCompleted ? habit.color : undefined,
                              boxShadow: isCompleted ? `0 0 8px ${habit.color}` : 'none'
                            }}
                            title={checkDate.toLocaleDateString()}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      );
    }

    if (activeTab === 'projects') {
      return (
        <div className="p-6 space-y-4">
          {!user && (
            <div className="text-center py-8 bg-gray-900/40 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
              <p className="text-cyan-300 mb-4">Sign in to create projects</p>
            </div>
          )}
          {projects.length === 0 && user ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No projects yet. Start planning your action steps!</p>
            </div>
          ) : (
            projects.map(project => {
              const completed = project.steps.filter(s => s.completed).length;
              const total = project.steps.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;
              
              return (
                <div
                  key={project.id}
                  className="bg-gray-900/40 rounded-2xl p-6 border-2 border-cyan-500/30 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-cyan-400" />
                      <div>
                        <h3 className="font-bold text-xl text-gray-100">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditProject(project)}
                        className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-300 font-bold">{completed}/{total} steps</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-cyan-700/50">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: project.color,
                          boxShadow: `0 0 15px ${project.color}, inset 0 1px 0 rgba(255,255,255,0.3)`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {project.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          step.completed
                            ? 'bg-cyan-900/20 border-cyan-600/50'
                            : 'bg-black/20 border-gray-700/50 hover:border-cyan-700/50'
                        }`}
                      >
                        <button
                          onClick={() => toggleStepComplete(project.id, step.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                            step.completed
                              ? 'bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50'
                              : 'border-cyan-700 hover:border-cyan-500'
                          }`}
                        >
                          {step.completed && (
                            <span className="text-gray-900 text-sm font-bold">✓</span>
                          )}
                        </button>
                        <span className={`flex-1 ${step.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                          {index + 1}. {step.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {user && (
            <button
              onClick={() => setShowProjectModal(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 border border-cyan-400/50"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex flex-col relative">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeOut">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-white"
                style={{
                  textShadow: '0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(6,182,212,0.6)',
                  animation: 'glow 2s ease-in-out infinite'
                }}>
              Welcome
            </h1>
            <p className="text-2xl text-cyan-300 animate-pulse"
               style={{
                 textShadow: '0 0 20px rgba(6,182,212,0.8)'
               }}>
              to Micro Habits
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s', boxShadow: '0 0 20px rgba(255,255,255,0.8)' }}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s', boxShadow: '0 0 20px rgba(6,182,212,0.8)' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s', boxShadow: '0 0 20px rgba(255,255,255,0.8)' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(6,182,212,0.6);
          }
          50% {
            text-shadow: 0 0 60px rgba(255,255,255,1), 0 0 120px rgba(6,182,212,0.9);
          }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        .animate-fadeOut {
          animation: fadeOut 2s ease-in-out forwards;
        }
      `}</style>
      <div className="bg-black/40 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20 backdrop-blur-md">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Micro Habits
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-black/60 rounded-lg p-1 border border-cyan-500/30">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all ${
                  viewMode === 'preview'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/50'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all ${
                  viewMode === 'code'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/50'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Code</span>
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-cyan-900/30 px-3 py-2 rounded-lg border border-cyan-500/30">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">{user.name || user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 border border-cyan-400/50 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/60 border-t border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-md">
        <div className="flex justify-around py-3">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === 'landing'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Habits</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === 'metrics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">Projects</span>
          </button>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border-2 border-cyan-500/30">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            
            <div className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Name (Optional)</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Username *</label>
                    <input
                      type="text"
                      value={authForm.username}
                      onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                      placeholder="Choose a username"
                    />
                  </div>
                </>
              )}
              
              {authMode === 'signin' && (
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={authForm.emailOrUsername}
                    onChange={(e) => setAuthForm({ ...authForm, emailOrUsername: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                    placeholder="Your username"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthForm({ emailOrUsername: '', password: '', name: '', username: '' });
                }}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAuth}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border-2 border-cyan-500/30">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                  placeholder="e.g., Morning Workout"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Time (Optional)</label>
                <input
                  type="time"
                  value={newHabit.time}
                  onChange={(e) => setNewHabit({ ...newHabit, time: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        const days = newHabit.days.includes(day)
                          ? newHabit.days.filter(d => d !== day)
                          : [...newHabit.days, day];
                        setNewHabit({ ...newHabit, days });
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        newHabit.days.includes(day)
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Start Date (Optional)</label>
                  <input
                    type="date"
                    value={newHabit.startDate}
                    onChange={(e) => setNewHabit({ ...newHabit, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={newHabit.endDate}
                    onChange={(e) => setNewHabit({ ...newHabit, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Color</label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewHabit({ ...newHabit, color })}
                      className={`w-10 h-10 rounded-full transition-all ${
                        newHabit.color === color ? 'ring-4 ring-cyan-400 scale-110' : ''
                      }`}
                      style={{ 
                        backgroundColor: color,
                        boxShadow: newHabit.color === color ? `0 0 20px ${color}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingHabit(null);
                  setNewHabit({ name: '', time: '', days: [], color: '#60a5fa', startDate: '', endDate: '' });
                }}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createHabit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50"
              >
                {editingHabit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border-2 border-cyan-500/30 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                  placeholder="e.g., Launch New Product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Description (Optional)</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white resize-none"
                  rows="2"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Action Steps</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addStep()}
                    className="flex-1 px-4 py-3 bg-black/40 border-2 border-cyan-700/50 rounded-xl focus:border-cyan-500 focus:outline-none text-white"
                    placeholder="Add a step..."
                  />
                  <button
                    onClick={addStep}
                    className="px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {newProject.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 p-3 bg-black/40 rounded-lg border border-cyan-700/50"
                    >
                      <span className="text-cyan-400 font-bold">{index + 1}.</span>
                      <span className="flex-1 text-gray-200 text-sm">{step.text}</span>
                      <button
                        onClick={() => deleteStep(step.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Color</label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewProject({ ...newProject, color })}
                      className={`w-10 h-10 rounded-full transition-all ${
                        newProject.color === color ? 'ring-4 ring-cyan-400 scale-110' : ''
                      }`}
                      style={{ 
                        backgroundColor: color,
                        boxShadow: newProject.color === color ? `0 0 20px ${color}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  setEditingProject(null);
                  setNewProject({ name: '', description: '', steps: [], color: '#60a5fa' });
                  setNewStep('');
                }}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50"
              >
                {editingProject ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroHabitsApp;
