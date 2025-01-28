import Card from '../model/Card'; 

export const generateCampaignCards = async (campaignId: string, quota: number) => {
  const cards = [];

  for (let i = 0; i < quota; i++) {
    const card = new Card({
      campaignId,
      number: i + 1,
      
    });
    cards.push(card);
  }

  return cards;
};
