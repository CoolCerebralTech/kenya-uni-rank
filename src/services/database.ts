import { supabase } from '../lib/supabase';
import type { Poll, PollResult, University } from '../types';

// Fetch all active polls
export async function getActivePolls(): Promise<Poll[]> {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching polls:', error);
    return [];
  }

  return data as Poll[];
}

// Fetch a single poll with results
export async function getPollWithResults(slug: string): Promise<{
  poll: Poll | null;
  results: PollResult[];
  totalVotes: number;
}> {
  // Get the poll
  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .select('*')
    .eq('slug', slug)
    .single();

  if (pollError || !pollData) {
    return { poll: null, results: [], totalVotes: 0 };
  }

  // Get results from the view
  const { data: resultsData, error: resultsError } = await supabase
    .from('poll_results')
    .select('*')
    .eq('poll_id', pollData.id);

  if (resultsError) {
    return { poll: pollData as Poll, results: [], totalVotes: 0 };
  }

  // Calculate percentages
  const totalVotes = resultsData.reduce((sum, item) => sum + item.vote_count, 0);
  
  const results: PollResult[] = resultsData.map((item) => ({
    universityId: item.university_id,
    universityName: item.university_name,
    universityColor: item.university_color,
    votes: item.vote_count,
    percentage: totalVotes > 0 ? (item.vote_count / totalVotes) * 100 : 0,
  }));

  return {
    poll: pollData as Poll,
    results,
    totalVotes,
  };
}

// Submit a vote
export async function submitVote(
  pollId: string,
  universityId: string,
  fingerprint: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('votes').insert({
      poll_id: pollId,
      university_id: universityId,
      fingerprint_hash: fingerprint,
    });

    if (error) {
      // Check if it's a duplicate vote error
      if (error.code === '23505') {
        return { success: false, error: 'You have already voted in this poll' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting vote:', err);
    return { success: false, error: 'Failed to submit vote' };
  }
}

// Get all universities
export async function getUniversities(): Promise<University[]> {
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching universities:', error);
    return [];
  }

  return data as University[];
}