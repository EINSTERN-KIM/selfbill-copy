import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Smartphone, CheckCircle2 } from 'lucide-react';

export default function PhoneVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // 'input', 'verify', 'success'
  const [phone, setPhone] = useState({ part1: '010', part2: '', part3: '' });
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    const phoneNumber = `${phone.part1}-${phone.part2}-${phone.part3}`;
    
    if (phone.part2.length !== 4 || phone.part3.length !== 4) {
      setError('올바른 전화번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await base44.functions.invoke('sendPhoneVerification', { phone: phoneNumber });
      
      if (data.success) {
        setStep('verify');
      } else {
        setError(data.error || '인증번호 발송에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error sending code:', err);
      setError('인증번호 발송 중 오류가 발생했습니다.');
    }
    
    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('6자리 인증번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const phoneNumber = `${phone.part1}-${phone.part2}-${phone.part3}`;
      const { data } = await base44.functions.invoke('verifyPhoneCode', { phone: phoneNumber, code });
      
      if (data.success) {
        setStep('success');
        setTimeout(() => {
          navigate(createPageUrl('Onboarding'));
        }, 2000);
      } else {
        setError(data.error || '인증번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('인증 중 오류가 발생했습니다.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-primary-dark/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-rounded shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">휴대폰 인증</CardTitle>
          <p className="text-sm text-slate-500 mt-2">
            {step === 'input' && '본인 인증을 위해 휴대폰 번호를 입력해주세요'}
            {step === 'verify' && '인증번호가 발송되었습니다'}
            {step === 'success' && '인증이 완료되었습니다!'}
          </p>
        </CardHeader>
        
        <CardContent>
          {step === 'input' && (
            <>
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  value={phone.part1}
                  onChange={(e) => setPhone({ ...phone, part1: e.target.value })}
                  className="w-20 text-center"
                  maxLength={3}
                  placeholder="010"
                />
                <span className="flex items-center">-</span>
                <Input
                  type="tel"
                  value={phone.part2}
                  onChange={(e) => setPhone({ ...phone, part2: e.target.value.replace(/\D/g, '') })}
                  className="flex-1 text-center"
                  maxLength={4}
                  placeholder="1234"
                />
                <span className="flex items-center">-</span>
                <Input
                  type="tel"
                  value={phone.part3}
                  onChange={(e) => setPhone({ ...phone, part3: e.target.value.replace(/\D/g, '') })}
                  className="flex-1 text-center"
                  maxLength={4}
                  placeholder="5678"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
              )}

              <Button
                onClick={handleSendCode}
                disabled={isLoading || !phone.part2 || !phone.part3}
                className="w-full btn-primary"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  '인증번호 받기'
                )}
              </Button>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="mb-4">
                <Input
                  type="tel"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  placeholder="000000"
                />
                <p className="text-xs text-slate-500 text-center mt-2">
                  {phone.part1}-{phone.part2}-{phone.part3}로 발송된 6자리 숫자를 입력하세요
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading || code.length !== 6}
                  className="w-full btn-primary"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    '인증 완료'
                  )}
                </Button>
                
                <Button
                  onClick={() => setStep('input')}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  번호 다시 입력
                </Button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-2">인증 완료!</p>
              <p className="text-sm text-slate-500">
                잠시 후 다음 단계로 이동합니다...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}