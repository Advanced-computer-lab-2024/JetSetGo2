import React, { useState } from "react";

import axios from "axios";
import "../App.css";
import { useNavigate } from 'react-router-dom';

const VacationGuide = () => {
  const steps = [
    "Register or Login",
    "Set Preferences",
    "Search and Browse",
    "Add to Wishlist",
    "Book Events/Itineraries",
    "Plan Logistics",
    "Prepare for Your Trip"
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="vacation-guide">
      <h1>Step-by-Step Vacation Guide</h1>
      <div className="step">
        <h2>{steps[currentStep]}</h2>
        <p>
          {`Description or tips for step ${currentStep + 1}: ${steps[currentStep]}.`}
        </p>
      </div>
      <div className="navigation">
        <button onClick={prevStep} disabled={currentStep === 0}>Previous</button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1}>Next</button>
      </div>
      <p>{`Step ${currentStep + 1} of ${steps.length}`}</p>
    </div>
  );
};

export default VacationGuide;
