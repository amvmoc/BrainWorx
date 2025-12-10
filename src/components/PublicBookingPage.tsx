import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CustomerBookingCalendar } from './CustomerBookingCalendar';

interface PublicBookingPageProps {
  franchiseCode: string;
  onBack: () => void;
}

export function PublicBookingPage({ franchiseCode, onBack }: PublicBookingPageProps) {
  const [loading, setLoading] = useState(true);
  const [franchiseOwner, setFranchiseOwner] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFranchiseOwner();
  }, [franchiseCode]);

  const loadFranchiseOwner = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('franchise_owners')
        .select('id, name, email')
        .eq('unique_link_code', franchiseCode)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Franchise holder not found');
        return;
      }

      setFranchiseOwner(data);
    } catch (err: any) {
      console.error('Error loading franchise owner:', err);
      setError('Failed to load franchise holder information: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A2A5E] to-[#3DB3E3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !franchiseOwner) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A2A5E] to-[#3DB3E3] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#0A2A5E] mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Something went wrong'}</p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 mx-auto bg-[#0A2A5E] text-white px-6 py-3 rounded-lg hover:bg-[#3DB3E3] transition-all"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2A5E] to-[#3DB3E3] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-6 hover:text-[#E6E9EF] transition-all"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <CustomerBookingCalendar
          franchiseOwnerId={franchiseOwner.id}
          franchiseOwnerName={franchiseOwner.name}
          onBookingComplete={() => {
            setTimeout(() => {
              onBack();
            }, 3000);
          }}
        />
      </div>
    </div>
  );
}
