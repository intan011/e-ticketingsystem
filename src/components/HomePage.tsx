import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, UserCheck, FileText, Search } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-medium text-foreground">Welcome to Project Booking System</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose your access level to proceed with project requests and management
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('guest')}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Guest Access</CardTitle>
            <CardDescription>
              Submit new project requests and check status of existing applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                New Request
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                Check Status
              </div>
            </div>
            <Button className="w-full" onClick={(e) => {
              e.stopPropagation();
              onNavigate('guest');
            }}>
              Access Guest Portal
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('internal')}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <UserCheck className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle>Internal Access</CardTitle>
            <CardDescription>
              Manage project requests, update status, and view all submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Submit & Manage
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                Status Control
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={(e) => {
              e.stopPropagation();
              onNavigate('internal');
            }}>
              Access Internal Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}