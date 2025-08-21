import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Search, FileText, Loader2 } from 'lucide-react';

interface SemakStatusPageProps {
  onBack: () => void;
  onSearchByEmail: (email: string) => Promise<any[]>;
  loading?: boolean;
}

export default function SemakStatusPage({ onBack, onSearchByEmail, loading = false }: SemakStatusPageProps) {
  const [email, setEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!email) return;
    
    setSearching(true);
    setHasSearched(false);
    
    try {
      const results = await onSearchByEmail(email);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'under review':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-MY');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2" disabled={loading || searching}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Semak Status</h2>
          <p className="text-muted-foreground">Check the status of your project requests</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search by Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                onKeyDown={(e) => e.key === 'Enter' && !searching && handleSearch()}
                disabled={searching}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                disabled={!email || searching} 
                className="flex items-center gap-2"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No submissions found for this email address.</p>
                <p className="text-sm mt-2">Please check your email address and try again.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead>Data Collection</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{formatDate(submission.tarikh)}</TableCell>
                        <TableCell className="font-medium">{submission.namaProjek}</TableCell>
                        <TableCell>{submission.bahagian}</TableCell>
                        <TableCell>{submission.namaPengawai}</TableCell>
                        <TableCell className="capitalize">{submission.kutipanData}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(submission.updatedAt || submission.submittedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}