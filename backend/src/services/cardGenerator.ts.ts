export interface Card {
    number: number;
    campaignId: string;
    status: 'available' | 'reserved' | 'sold';
  }
  
  export const generateCampaignCards = async (campaignId: string, quota: number): Promise<Card[]> => {
    const cards: Card[] = [];
    
    for (let i = 1; i <= quota; i++) {
      cards.push({
        number: i,
        campaignId,
        status: 'available'
      });
    }
    
    return cards;
  };