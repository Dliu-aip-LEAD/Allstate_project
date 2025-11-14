import React from 'react';
import { useParams } from 'react-router-dom';
import EmailCrimeInvestigation from './EmailCrimeInvestigation';
import FakeGiveawayInvestigation from './FakeGiveawayInvestigation';
import { missions } from '../data/missions';

const InvestigationRouter = () => {
  const { missionId } = useParams();
  const mission = missionId ? missions[missionId] : null;

  // Route to specific investigation component based on mission type or ID
  if (missionId === 'fake-giveaway-detector') {
    return <FakeGiveawayInvestigation />;
  }

  // Check if mission has social-media-posts type
  if (mission && mission.content?.type === 'social-media-posts') {
    return <FakeGiveawayInvestigation />;
  }

  // Default to EmailCrimeInvestigation for all other missions
  return <EmailCrimeInvestigation />;
};

export default InvestigationRouter;

