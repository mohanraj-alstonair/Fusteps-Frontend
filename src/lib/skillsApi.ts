import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/skills/api';

export interface SkillToken {
  id: number;
  skill: { name: string; category: string };
  token_id: string;
  verification_status: string;
  verification_method: string;
  metadata: any;
  created_at: string;
}

export interface SkillGap {
  id: number;
  skill: { name: string; category: string };
  target_role: string;
  importance_score: number;
  recommendation_text: string;
  created_at: string;
}

export interface UpgradeRecommendation {
  id: number;
  skill: { name: string };
  course_title: string;
  provider: string;
  duration: string;
  difficulty_level: string;
  course_url?: string;
  priority_score: number;
  created_at: string;
}

export const skillsApi = {
  // Skill Tokens
  getSkillTokens: async (userId: string): Promise<SkillToken[]> => {
    const response = await axios.get(`${API_BASE}/skill-tokens/?user_id=${userId}`);
    return response.data;
  },

  verifyToken: async (tokenId: number) => {
    const response = await axios.get(`${API_BASE}/skill-tokens/${tokenId}/verify_token/`);
    return response.data;
  },

  // Skill Gap Analysis
  getSkillGaps: async (userId: string): Promise<SkillGap[]> => {
    const response = await axios.get(`${API_BASE}/skill-gaps/?user_id=${userId}`);
    return response.data;
  },

  analyzeSkillGaps: async (userId: string, targetRole: string): Promise<SkillGap[]> => {
    const response = await axios.post(`${API_BASE}/skill-gaps/analyze_gaps/`, {
      user_id: userId,
      target_role: targetRole
    });
    return response.data;
  },

  // Upgrade Recommendations
  getUpgradeRecommendations: async (userId: string): Promise<UpgradeRecommendation[]> => {
    const response = await axios.get(`${API_BASE}/upgrade-recommendations/?user_id=${userId}`);
    return response.data;
  },

  // Enhanced skill addition with tokenization
  addSkillWithToken: async (skillId: number, userId: string, skillData: any) => {
    const response = await axios.post(`${API_BASE}/skills/${skillId}/add_to_profile/`, {
      user_id: userId,
      ...skillData
    });
    return response.data;
  }
};