import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PermohonanBaruPageProps {
  onBack: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function PermohonanBaruPage({ onBack, onSubmit, loading = false }: PermohonanBaruPageProps) {
  const [formData, setFormData] = useState({
    tarikh: '',
    bahagian: '',
    namaProjek: '',
    tujuanProjek: '',
    websiteUrl: '',
    kutipanData: '',
    namaPengawai: '',
    email: '',
    catatan: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['tarikh', 'bahagian', 'namaProjek', 'tujuanProjek', 'kutipanData', 'namaPengawai', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2" disabled={loading}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Permohonan Baru</h2>
          <p className="text-muted-foreground">Submit a new project request</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tarikh">Tarikh *</Label>
                <Input
                  id="tarikh"
                  type="date"
                  value={formData.tarikh}
                  onChange={(e) => handleInputChange('tarikh', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bahagian">Bahagian *</Label>
                <Input
                  id="bahagian"
                  value={formData.bahagian}
                  onChange={(e) => handleInputChange('bahagian', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="namaProjek">Nama Projek *</Label>
              <Input
                id="namaProjek"
                value={formData.namaProjek}
                onChange={(e) => handleInputChange('namaProjek', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tujuanProjek">Tujuan Projek *</Label>
              <Textarea
                id="tujuanProjek"
                value={formData.tujuanProjek}
                onChange={(e) => handleInputChange('tujuanProjek', e.target.value)}
                rows={3}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website dan URL</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                placeholder="1. iProperty: https://www.iproperty.com.my/, 2. DurianProperty: https://www2.durianproperty.com.my/"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kutipanData">Kutipan Data *</Label>
              <Select value={formData.kutipanData} onValueChange={(value) => handleInputChange('kutipanData', value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data collection frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-off">One-off</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="namaPengawai">Nama Pengawai *</Label>
                <Input
                  id="namaPengawai"
                  value={formData.namaPengawai}
                  onChange={(e) => handleInputChange('namaPengawai', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => handleInputChange('catatan', e.target.value)}
                rows={3}
                placeholder="Additional notes or comments..."
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}