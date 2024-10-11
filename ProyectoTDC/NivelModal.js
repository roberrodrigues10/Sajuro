import React, { useState, useEffect } from 'react';

const ExperienceLevelCounter = () => {
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(33);
  const experienceToNextLevel = 100;

  useEffect(() => {
    if (experience >= experienceToNextLevel) {
      setLevel(prevLevel => prevLevel + 1);
      setExperience(prevExperience => prevExperience - experienceToNextLevel);
    }
  }, [experience]);

  const handleExperienceAdd = (value) => {
    setExperience(prevExperience => Math.min(prevExperience + value, experienceToNextLevel));
  };

  const experienceValues = [50, 25, 10];

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-80 p-6 bg-gradient-to-b from-emerald-400 to-purple-500 rounded-xl shadow-lg">
        <div className="mb-4">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${(experience / experienceToNextLevel) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-white text-sm mt-1">
            <span>{level}</span>
            <span>{level + 1}</span>
          </div>
        </div>
        <div className="text-center text-white mb-4">
          Experiencia: {experience}/{experienceToNextLevel}
        </div>
        <div className="flex justify-between mt-4">
          {experienceValues.map((value, index) => (
            <span
              key={index}
              onClick={() => handleExperienceAdd(value)}
              className="text-white text-2xl font-bold cursor-pointer hover:text-yellow-300 transition-colors duration-300"
            >
              +{value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceLevelCounter;