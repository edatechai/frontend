import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Loader2, TrendingUp, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCalculateEarningsPreviewMutation, useGetCommissionSettingsQuery } from '@/features/api/apiSlice';
import { toast } from 'sonner';

interface EarningsCalculatorProps {
  className?: string;
}

const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({ className }) => {
  const [tierLevel, setTierLevel] = useState<string>('');
  const [studentCount, setStudentCount] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  
  const [calculatePreview, { isLoading }] = useCalculateEarningsPreviewMutation();
  const { data: commissionSettings, isLoading: settingsLoading, error: settingsError } = useGetCommissionSettingsQuery();
  
  const [preview, setPreview] = useState<any>(null);

  const handleCalculate = async () => {
    if (!tierLevel || !studentCount || !serviceType) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseInt(studentCount) < 0) {
      toast.error('Student count must be a positive number');
      return;
    }

    try {
      const response = await calculatePreview({
        tierLevel: parseInt(tierLevel),
        studentCount: parseInt(studentCount),
        serviceType
      });

      if ('data' in response && response.data?.success) {
        setPreview(response.data.data);
      } else {
        const error = 'error' in response ? response.error : 'Unknown error';
        toast.error('Failed to calculate earnings');
        console.error('Calculation error:', error);
      }
    } catch (error) {
      toast.error('Error calculating earnings');
      console.error('Calculation error:', error);
    }
  };

  const handleReset = () => {
    setTierLevel('');
    setStudentCount('');
    setServiceType('');
    setPreview(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fallback commission settings if API fails
  const defaultSettings = {
    tierPrices: { tier1: 1000, tier2: 1500, tier3: 2000 },
    serviceRates: { introduction: 2000, conversion: 0.20, fullService: 0.50 }
  };

  const settings = commissionSettings?.data || defaultSettings;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Earnings Calculator
          {settingsLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
        </CardTitle>
        <CardDescription>
          Calculate your potential earnings based on school tier, student count, and service type
          {settingsError && <span className="text-red-500 block mt-1">Using default rates (API unavailable)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tier">School Tier</Label>
            <Select value={tierLevel} onValueChange={setTierLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  Tier 1 ({formatCurrency(settings.tierPrices.tier1)}/student)
                </SelectItem>
                <SelectItem value="2">
                  Tier 2 ({formatCurrency(settings.tierPrices.tier2)}/student)
                </SelectItem>
                <SelectItem value="3">
                  Tier 3 ({formatCurrency(settings.tierPrices.tier3)}/student)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="students">Number of Students</Label>
            <Input
              id="students"
              type="number"
              min="0"
              placeholder="Enter student count"
              value={studentCount}
              onChange={(e) => setStudentCount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="introduction">
                  Introduction ({formatCurrency(settings.serviceRates.introduction)} flat)
                </SelectItem>
                <SelectItem value="conversion">
                  Conversion ({(settings.serviceRates.conversion * 100)}%)
                </SelectItem>
                <SelectItem value="full_service">
                  Full Service ({(settings.serviceRates.fullService * 100)}%)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleCalculate} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Earnings
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {/* Preview Results */}
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Earnings Calculation</span>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {preview.description}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Your Earnings</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(preview.earnedAmount)}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Monthly Revenue</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(preview.baseAmount)}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Students × Tier Price:</span>
                <span>{preview.breakdown.studentsXTierPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission:</span>
                <span>{preview.breakdown.commission}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsCalculator;
