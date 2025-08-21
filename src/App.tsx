import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Users, UserCheck, ArrowLeft, Building, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import HomePage from './components/HomePage';
import GuestPage from './components/GuestPage';
import InternalPage from './components/InternalPage';
import PermohonanBaruPage from './components/PermohonanBaruPage';
import SemakStatusPage from './components/SemakStatusPage';
import { api } from './utils/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all submissions on app start
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.getAllSubmissions();
      setSubmissions(response.submissions || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const addSubmission = async (submissionData) => {
    try {
      setLoading(true);
      const response = await api.createSubmission(submissionData);
      
      if (response.success) {
        // Reload submissions to get the latest data
        await loadSubmissions();
        toast.success('Permohonan berjaya dihantar!');
        return true;
      } else {
        throw new Error('Failed to create submission');
      }
    } catch (error) {
      console.error('Error creating submission:', error);
      toast.error('Failed to submit request: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      const response = await api.updateSubmissionStatus(id, newStatus);
      
      if (response.success) {
        // Update local state
        setSubmissions(submissions.map(submission => 
          submission.id === id ? { ...submission, status: newStatus } : submission
        ));
        toast.success('Status updated successfully!');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionsByEmail = async (email) => {
    try {
      setLoading(true);
      const response = await api.getSubmissionsByEmail(email);
      return response.submissions || [];
    } catch (error) {
      console.error('Error fetching submissions by email:', error);
      toast.error('Failed to fetch submissions: ' + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'guest':
        return <GuestPage onNavigate={setCurrentPage} onBack={() => setCurrentPage('home')} />;
      case 'internal':
        return <InternalPage 
          onNavigate={setCurrentPage} 
          onBack={() => setCurrentPage('home')}
          submissions={submissions}
          onAddSubmission={addSubmission}
          onUpdateStatus={updateSubmissionStatus}
          loading={loading}
        />;
      case 'permohonan-baru':
        return <PermohonanBaruPage 
          onBack={() => setCurrentPage('guest')}
          onSubmit={async (data) => {
            const success = await addSubmission(data);
            if (success) {
              setCurrentPage('guest');
            }
          }}
          loading={loading}
        />;
      case 'semak-status':
        return <SemakStatusPage 
          onBack={() => setCurrentPage('guest')}
          onSearchByEmail={getSubmissionsByEmail}
          loading={loading}
        />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-medium text-foreground">Project Booking System</h1>
                <p className="text-sm text-muted-foreground">Sistem Permohonan Projek</p>
              </div>
            </div>
            {currentPage !== 'home' && (
              <Button
                variant="outline"
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}