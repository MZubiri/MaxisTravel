export interface TourItinerary { time: string; title: string; description?: string; icon?: string; }
export interface Tour {
  id?: string; slug: string; name: string; price: number; description: string; fullDescription?: string;
  duration: string; difficulty: string; type: string; isPublished: boolean; imageUrl?: string;
  altitude?: string; schedule?: string; modality?: string;
  itinerary?: TourItinerary[]; includes?: string[]; notIncludes?: string[]; whatToBring?: string[];
}
