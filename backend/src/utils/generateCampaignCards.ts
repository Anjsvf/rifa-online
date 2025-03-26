// import Card from "../model/Card";

export const generateCampaignCards = async (
  campaignId: string, 
  quota: number
) => {
  const cards = [];
  
  for (let i = 1; i <= quota; i++) {
    
    const numbers = Array.from({ length: 10 }, (_, index) => i * 10 + index);
    
    cards.push({
      campaignId,
      numbers, 
      status: "available" as const,
    });
  }
  
  return cards;
};