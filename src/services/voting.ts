import { supabase } from '../lib/supabase';
import type { Poll, PollResult } from '../types';

export class VotingService {
  
  /**
   * 1. Fetch Active Polls
   * Gets the questions (e.g., "Best Sports?")
   */
  static async getActivePolls() {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }); // Newest polls first

    if (error) {
      console.error('Error fetching polls:', error);
      throw error;
    }
    
    return data as Poll[];
  }

  /**
   * 2. Get Real-Time Results
   * Fetches from the SQL View 'poll_results'
   * Returns: [{ universityName: 'UoN', voteCount: 50 }, ...]
   */
  static async getPollResults(pollId: string) {
    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollId)
      .order('vote_count', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
      throw error;
    }

    return data as PollResult[];
  }

  /**
   * 3. Cast a Vote
   * Handles the vote insertion and catches "Already Voted" errors
   */
  static async castVote(
    pollId: string,
    universityId: string,
    fingerprintHash: string
  ) {
    // We don't need to check "if already voted" manually.
    // The Database UNIQUE constraint handles it faster.
    
    const { data, error } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        university_id: universityId,
        fingerprint_hash: fingerprintHash,
      })
      .select()
      .single();

    if (error) {
      // Postgres Error 23505 = Unique Violation
      if (error.code === '23505') {
        throw new Error('ALREADY_VOTED');
      }
      console.error('Vote failed:', error);
      throw error;
    }

    return data;
  }
  
  /**
   * 4. Check if user voted (Client-side optimization)
   * Useful to gray out buttons before they even click
   */
  static async hasUserVoted(pollId: string, fingerprintHash: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('votes')
      .select('id', { count: 'exact', head: true }) // head: true means "don't fetch data, just count"
      .eq('poll_id', pollId)
      .eq('fingerprint_hash', fingerprintHash);
      
    if (error) return false;
    return (count || 0) > 0;
  }
  static async getPollWithResults(pollId: string) {
  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .select('*')
    .eq('id', pollId)
    .single();

  if (pollError) throw pollError;

  const { data: resultsData, error: resultsError } = await supabase
    .from('poll_results')
    .select('*')
    .eq('poll_id', pollId);

  if (resultsError) throw resultsError;

  return {
    poll: pollData as Poll,
    results: resultsData as PollResult[],
  };
}
}