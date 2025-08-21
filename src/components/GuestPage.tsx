import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FileText, Search, ArrowLeft, Plus } from 'lucide-react';

interface GuestPageProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export default function GuestPage({ onNavigate, onBack }: GuestPageProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Guest Portal</h2>
          <p className="text-muted-foreground">Submit new requests or check existing status</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Permohonan Baru</CardTitle>
            <CardDescription>
              Submit a new project request with all required details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Fill out the project request form including:
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Project details and purpose</li>
                <li>Data collection requirements</li>
                <li>Officer and contact information</li>
              </ul>
              <Button className="w-full" onClick={() => onNavigate('permohonan-baru')}>
                Start New Request
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle>Semak Status</CardTitle>
            <CardDescription>
              Check the status of your existing project requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                View the current status of your submissions:
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Pending review</li>
                <li>Under evaluation</li>
                <li>Approved or rejected</li>
              </ul>
              <Button variant="secondary" className="w-full" onClick={() => onNavigate('semak-status')}>
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}