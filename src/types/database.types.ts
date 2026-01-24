// ============================================================================
// AUTO-GENERATED DATABASE TYPES
// Generate using: npx supabase gen types typescript --local > database.types.ts
// Or manually update this file to match your schema
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      universities: {
        Row: {
          id: string
          slug: string
          name: string
          short_name: string
          type: 'Public' | 'Private'
          location: string
          color: string
          description: string | null
          established: number | null
          website: string | null
          student_population: number | null
          campus_size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          slug: string
          name: string
          short_name: string
          type: 'Public' | 'Private'
          location: string
          color?: string
          description?: string | null
          established?: number | null
          website?: string | null
          student_population?: number | null
          campus_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          short_name?: string
          type?: 'Public' | 'Private'
          location?: string
          color?: string
          description?: string | null
          established?: number | null
          website?: string | null
          student_population?: number | null
          campus_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      polls: {
        Row: {
          id: string
          question: string
          slug: string
          category: 'general' | 'vibes' | 'academics' | 'sports' | 'social' | 'facilities'
          starts_at: string | null
          ends_at: string | null
          cycle_month: string | null
          is_active: boolean
          display_order: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          slug: string
          category: 'general' | 'vibes' | 'academics' | 'sports' | 'social' | 'facilities'
          starts_at?: string | null
          ends_at?: string | null
          cycle_month?: string | null
          is_active?: boolean
          display_order?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          slug?: string
          category?: 'general' | 'vibes' | 'academics' | 'sports' | 'social' | 'facilities'
          starts_at?: string | null
          ends_at?: string | null
          cycle_month?: string | null
          is_active?: boolean
          display_order?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          university_id: string
          fingerprint_hash: string
          ip_hash: string | null
          voter_type: 'student' | 'alumni' | 'applicant' | 'other' | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          university_id: string
          fingerprint_hash: string
          ip_hash?: string | null
          voter_type?: 'student' | 'alumni' | 'applicant' | 'other' | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          university_id?: string
          fingerprint_hash?: string
          ip_hash?: string | null
          voter_type?: 'student' | 'alumni' | 'applicant' | 'other' | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          }
        ]
      }
      monthly_aggregates: {
        Row: {
          id: string
          poll_id: string
          university_id: string
          cycle_month: string
          votes: number
          percentage: number
          rank: number
          total_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          university_id: string
          cycle_month: string
          votes?: number
          percentage?: number
          rank?: number
          total_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          university_id?: string
          cycle_month?: string
          votes?: number
          percentage?: number
          rank?: number
          total_votes?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_aggregates_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_aggregates_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      poll_results: {
        Row: {
          poll_id: string
          poll_question: string
          category: string
          cycle_month: string | null
          university_id: string
          university_name: string
          university_short_name: string
          university_color: string
          university_type: string
          votes: number
          percentage: number
          rank: number
        }
        Relationships: []
      }
      trending_polls: {
        Row: {
          id: string
          question: string
          slug: string
          category: string
          cycle_month: string | null
          total_votes: number
          universities_competing: number
          last_vote_time: string
          competition_level: string
        }
        Relationships: []
      }
      university_leaderboard: {
        Row: {
          id: string
          name: string
          short_name: string
          type: string
          color: string
          location: string
          total_votes_received: number
          polls_participated: number
          first_place_finishes: number
        }
        Relationships: []
      }
      recent_activity: {
        Row: {
          created_at: string
          poll_question: string
          poll_slug: string
          category: string
          university_name: string
          university_short_name: string
          university_color: string
          university_type: string
          voter_type: string | null
        }
        Relationships: []
      }
      category_insights: {
        Row: {
          category: string
          total_polls: number
          total_votes: number
          universities_active: number
          recent_activity_percentage: number
          is_trending: boolean
        }
        Relationships: []
      }
    }
    Functions: {
      has_user_voted: {
        Args: {
          p_poll_id: string
          p_fingerprint: string
        }
        Returns: boolean
      }
      get_vote_count: {
        Args: {
          p_poll_id: string
          p_university_id: string
        }
        Returns: number
      }
      get_poll_status: {
        Args: {
          p_poll_id: string
        }
        Returns: {
          is_active: boolean
          is_in_cycle: boolean
          starts_at: string | null
          ends_at: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}