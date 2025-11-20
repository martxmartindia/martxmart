export interface Slide {
  id: number;
  type: "MACHINE" | "SHOP";
  imageorVideo: string;
  mobileImageorVideo: string;
  link?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlideData {
  type: "MACHINE" | "SHOP";
  imageorVideo: string;
  mobileImageorVideo: string;
  link?: string;
  isActive: boolean;
}

export interface UpdateSlideData {
  type?: "MACHINE" | "SHOP";
  imageorVideo?: string;
  mobileImageorVideo?: string;
  link?: string | null;
  isActive?: boolean;
}

export interface SlideResponse {
  slides: Slide[];
}

export interface SlideApiResponse {
  message: string;
  slide: Slide;
}