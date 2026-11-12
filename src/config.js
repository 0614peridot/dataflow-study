// Shared study content. Change names and facts here so every site stays consistent.

export const PRODUCT = {
  name: 'Lumen',
  pricePerUser: 18, // USD per user / month (PRD §5)
};

// Shared prompt for the single personalized study journey.
export const SHARED_PROMPT =
  "I'm the operations lead at Brightloop, a seed-stage startup with 7 people and no dedicated data engineer. Our sales reps update a pipeline spreadsheet every Friday, we have about 340 studio accounts in our CRM, and we export billing data to CSV each month. I spend around 4 hours every Monday combining this data for the founders' review, and the spreadsheet often doesn't match the CRM. We want one shared dashboard for recurring revenue, new studios, and accounts at risk of cancelling. Our budget is about $150 per month. What software should we consider?";

// Fictional persona used by the personalized recommendation.
export const PERSONA = {
  company: 'Brightloop',
  teamSize: 7,
  budget: 150,
};

// Required Phase 2 evidence sources. Participants may visit them in either order.
export const NEXT_ACTIONS = [
  { id: 'website', label: `Visit the ${PRODUCT.name} website` },
  { id: 'demo', label: 'Try the guided sample-data demo' },
  { id: 'community', label: 'Check community reactions' },
];
