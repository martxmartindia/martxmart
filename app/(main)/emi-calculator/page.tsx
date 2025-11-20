'use client';

import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface AmortizationEntry {
  month: number;
  principal: string;
  interest: string;
  balance: string;
}

const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const EMICalculator = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const updateChartWidth = () => {
      setChartWidth(isDesktop ? 600 : window.innerWidth - 48);
    };
    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);
    return () => window.removeEventListener('resize', updateChartWidth);
  }, [isDesktop]);

  // State for input fields (initially empty)
  const [machinePrice, setMachinePrice] = useState('10000');
  const [downPayment, setDownPayment] = useState('1000');
  const [loanTenure, setLoanTenure] = useState('24');
  const [interestRate, setInterestRate] = useState('10');
  const [moratoriumPeriod, setMoratoriumPeriod] = useState('0');
  const [interestType, setInterestType] = useState('Reducing');
  const [processingFee, setProcessingFee] = useState('0');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State for output fields
  const [emiAmount, setEmiAmount] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);

  // Validate inputs
  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!machinePrice || Number(machinePrice) < 1000 || Number(machinePrice) > 10000000) {
      newErrors.machinePrice = 'Loan Amount must be between ₹1000 and ₹1,00,00,000';
    }

    if (!downPayment || Number(downPayment) < 0 || Number(downPayment) >= Number(machinePrice)) {
      newErrors.downPayment = 'Down payment must be less than loan amount';
    }

    if (!loanTenure || Number(loanTenure) < 6 || Number(loanTenure) > 120) {
      newErrors.loanTenure = 'Loan tenure must be between 6 and 120 months';
    }

    if (!interestRate || Number(interestRate) < 1 || Number(interestRate) > 35) {
      newErrors.interestRate = 'Interest rate must be between 1% and 35%';
    }

    if (!processingFee || Number(processingFee) < 0 || Number(processingFee) > 5) {
      newErrors.processingFee = 'Processing fee must be between 0% and 5%';
    }

    if (!moratoriumPeriod || Number(moratoriumPeriod) < 0 || Number(moratoriumPeriod) >= Number(loanTenure)) {
      newErrors.moratoriumPeriod = 'Moratorium period must be between 0 and less than loan tenure';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate EMI with moratorium period
  const calculateEMI = () => {
    if (!validateInputs()) {
      setEmiAmount('');
      setTotalInterest('');
      setTotalPayment('');
      setAmortizationSchedule([]);
      return;
    }

    const principal = new Decimal(machinePrice).minus(downPayment);
    const monthlyRate = new Decimal(interestRate).div(1200);
    const tenure = new Decimal(loanTenure);
    const moratorium = new Decimal(moratoriumPeriod || 0);
    const repaymentTenure = tenure.minus(moratorium);

    let emi = new Decimal(0);
    let totalInt = new Decimal(0);
    let adjustedPrincipal = new Decimal(principal);

    if (interestType === 'Reducing') {
      // Moratorium: Interest accrues, increasing the principal
      if (moratorium.greaterThan(0)) {
        for (let i = 0; i < moratorium.toNumber(); i++) {
          const interest = adjustedPrincipal.times(monthlyRate);
          adjustedPrincipal = adjustedPrincipal.plus(interest);
        }
      }

      // EMI for remaining tenure
      const onePlusR = new Decimal(1).plus(monthlyRate);
      const onePlusRPowerN = onePlusR.pow(repaymentTenure);
      const emiDecimal = adjustedPrincipal
        .times(monthlyRate)
        .times(onePlusRPowerN)
        .div(onePlusRPowerN.minus(1));
      emi = new Decimal(emiDecimal.toFixed(2));

      // Total interest: Interest during moratorium + interest during repayment
      const moratoriumInterest = adjustedPrincipal.minus(principal);
      const repaymentInterest = emi.times(repaymentTenure).minus(adjustedPrincipal);
      totalInt = new Decimal(moratoriumInterest.plus(repaymentInterest).toFixed(2));
    } else {
      // Flat Rate: Simple interest on initial principal
      totalInt = new Decimal(principal.times(interestRate).times(tenure).div(1200).toFixed(2));
      emi = new Decimal(principal.plus(totalInt).div(tenure).toFixed(2));
    }

    // Processing fee
    const procFee = principal.times(new Decimal(processingFee)).div(100).toFixed(2);
    const totalPay = principal.plus(new Decimal(totalInt)).plus(new Decimal(procFee)).toFixed(2);

    setEmiAmount(emi.toString());
    setTotalInterest(totalInt.toString());
    setTotalPayment(totalPay);

    // Generate amortization schedule (for Reducing Balance)
    if (interestType === 'Reducing') {
      let balance = new Decimal(principal);
      const schedule: AmortizationEntry[] = [];

      // Moratorium period: Interest-only payments
      for (let i = 1; i <= moratorium.toNumber(); i++) {
        const interest = balance.times(monthlyRate);
        balance = balance.plus(interest);
        schedule.push({
          month: i,
          principal: '0',
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
        });
      }

      // Repayment period
      for (let i = moratorium.toNumber() + 1; i <= tenure.toNumber(); i++) {
        const interest = balance.times(monthlyRate);
        const principalPaid = new Decimal(emi).minus(interest);
        balance = balance.minus(principalPaid);
        schedule.push({
          month: i,
          principal: principalPaid.toFixed(2),
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
        });
      }
      setAmortizationSchedule(schedule);
    } else {
      setAmortizationSchedule([]);
    }
  };

  // Recalculate EMI on input changes
  useEffect(() => {
    calculateEMI();
  }, [machinePrice, downPayment, loanTenure, interestRate, moratoriumPeriod, interestType, processingFee]);

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">EMI Calculator</h2>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Machine Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Loan Amount (₹)</label>
            <Input
              type="number"
              value={machinePrice}
              onChange={(e) => setMachinePrice(e.target.value)}
              placeholder="Enter loan amount"
              className={errors.machinePrice ? 'border-red-500' : ''}
            />
            {errors.machinePrice && (
              <p className="text-red-500 text-xs mt-1">{errors.machinePrice}</p>
            )}
            <Slider
              value={[Number(machinePrice) || 1000]}
              onValueChange={(value) => setMachinePrice(value[0].toString())}
              min={1000}
              max={10000000}
              step={1000}
              className="mt-2"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium mb-1">Down Payment (₹)</label>
            <Input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="Enter down payment"
              className={errors.downPayment ? 'border-red-500' : ''}
            />
            {errors.downPayment && (
              <p className="text-red-500 text-xs mt-1">{errors.downPayment}</p>
            )}
            <Slider
              value={[Number(downPayment) || 0]}
              onValueChange={(value) => setDownPayment(value[0].toString())}
              min={0}
              max={Number(machinePrice) || 10000000}
              step={1000}
              className="mt-2"
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <label className="block text-sm font-medium mb-1">Loan Tenure (Months)</label>
            <Input
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              placeholder="Enter loan tenure"
              className={errors.loanTenure ? 'border-red-500' : ''}
            />
            {errors.loanTenure && (
              <p className="text-red-500 text-xs mt-1">{errors.loanTenure}</p>
            )}
            <Slider
              value={[Number(loanTenure) || 6]}
              onValueChange={(value) => setLoanTenure(value[0].toString())}
              min={6}
              max={120}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter interest rate"
              step="0.1"
              className={errors.interestRate ? 'border-red-500' : ''}
            />
            {errors.interestRate && (
              <p className="text-red-500 text-xs mt-1">{errors.interestRate}</p>
            )}
            <Slider
              value={[Number(interestRate) || 1]}
              onValueChange={(value) => setInterestRate(value[0].toString())}
              min={1}
              max={35}
              step={0.1}
              className="mt-2"
            />
          </div>

          {/* Moratorium Period */}
          <div>
            <label className="block text-sm font-medium mb-1">Moratorium Period (Months)</label>
            <Input
              type="number"
              value={moratoriumPeriod}
              onChange={(e) => setMoratoriumPeriod(e.target.value)}
              placeholder="Enter moratorium period"
              className={errors.moratoriumPeriod ? 'border-red-500' : ''}
            />
            {errors.moratoriumPeriod && (
              <p className="text-red-500 text-xs mt-1">{errors.moratoriumPeriod}</p>
            )}
            <Slider
              value={[Number(moratoriumPeriod) || 0]}
              onValueChange={(value) => setMoratoriumPeriod(value[0].toString())}
              min={0}
              max={Number(loanTenure) - 1 || 119}
              step={1}
              className="mt-2"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-gray-500 underline cursor-pointer">
                  What's this?
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  The moratorium period is the duration during which you are not required to pay the full EMI. Interest may still accrue, increasing the loan balance.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Interest Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Interest Type</label>
            <Select value={interestType} onValueChange={setInterestType}>
              <SelectTrigger>
                <SelectValue placeholder="Select interest type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Reducing">Reducing Balance</SelectItem>
                <SelectItem value="Flat">Flat Rate</SelectItem>
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-gray-500 underline cursor-pointer">
                  What's this?
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <strong>Reducing:</strong> Interest is calculated on the outstanding loan balance, which decreases over time.
                </p>
                <p>
                  <strong>Flat:</strong> Interest is calculated on the initial loan amount for the entire tenure.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Processing Fee */}
          <div>
            <label className="block text-sm font-medium mb-1">Processing Fee (%)</label>
            <Input
              type="number"
              value={processingFee}
              onChange={(e) => setProcessingFee(e.target.value)}
              placeholder="Enter processing fee"
              step="0.1"
              className={errors.processingFee ? 'border-red-500' : ''}
            />
            {errors.processingFee && (
              <p className="text-red-500 text-xs mt-1">{errors.processingFee}</p>
            )}
          </div>
        </div>

        {/* Output Fields */}
        {emiAmount && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">EMI Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-xl font-bold">{formatCurrency(emiAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interest Payable</p>
                <p className="text-xl font-bold">{formatCurrency(totalInterest)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payment</p>
                <p className="text-xl font-bold">{formatCurrency(totalPayment)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Amortization Schedule (for Reducing Balance) */}
        {interestType === 'Reducing' && amortizationSchedule.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Amortization Schedule</h3>
            <LineChart
              width={chartWidth}
              height={300}
              data={amortizationSchedule}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="principal" stroke="#8884d8" name="Principal Paid" />
              <Line type="monotone" dataKey="interest" stroke="#82ca9d" name="Interest Paid" />
            </LineChart>
            <div className="overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Principal (₹)</TableHead>
                    <TableHead>Interest (₹)</TableHead>
                    <TableHead>Balance (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amortizationSchedule.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{formatCurrency(row.principal)}</TableCell>
                      <TableCell>{formatCurrency(row.interest)}</TableCell>
                      <TableCell>{formatCurrency(row.balance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default EMICalculator;