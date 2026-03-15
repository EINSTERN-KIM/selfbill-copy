import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, FileText, Phone, Send, Loader2, ArrowLeft, BookOpen } from 'lucide-react';

export default function SupportDialog({ isOpen, onClose }) {
  const [view, setView] = useState('main'); // main, email, myInquiries
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  
  const [emailForm, setEmailForm] = useState({
    replyEmail: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadUser();
    }
  }, [isOpen]);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setEmailForm(prev => ({ ...prev, replyEmail: currentUser.email }));
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const loadMyInquiries = async () => {
    if (!user) return;
    setIsLoadingInquiries(true);
    try {
      const data = await base44.entities.Inquiry.filter({ user_id: user.id });
      setInquiries(data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    } catch (err) {
      console.error('Error loading inquiries:', err);
    }
    setIsLoadingInquiries(false);
  };

  const handleKakaoClick = () => {
    window.open('https://open.kakao.com/o/sNDmqqdi', '_blank');
  };

  const handleEmailSubmit = async () => {
    if (!emailForm.replyEmail || !emailForm.subject || !emailForm.message) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create inquiry record
      await base44.entities.Inquiry.create({
        user_id: user.id,
        user_email: user.email,
        reply_email: emailForm.replyEmail,
        subject: emailForm.subject,
        message: emailForm.message,
        status: '접수'
      });

      // Send email to support
      await base44.integrations.Core.SendEmail({
        from_name: '똑빌 고객센터',
        to: 'ttokbill.service@gmail.com',
        subject: `[똑빌 문의] ${emailForm.subject}`,
        body: `
문의자: ${user.full_name} (${user.email})
회신 이메일: ${emailForm.replyEmail}

제목: ${emailForm.subject}

내용:
${emailForm.message}
        `
      });

      alert('문의가 접수되었습니다. 영업일 1-2일 내에 회신드리겠습니다.');
      setEmailForm({ replyEmail: user.email, subject: '', message: '' });
      setView('main');
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('문의 전송 중 오류가 발생했습니다.');
    }
    setIsSubmitting(false);
  };

  const handleViewMyInquiries = async () => {
    setView('myInquiries');
    await loadMyInquiries();
  };

  const handleClose = () => {
    setView('main');
    setEmailForm({ replyEmail: user?.email || '', subject: '', message: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {view !== 'main' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('main')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            고객센터
          </DialogTitle>
        </DialogHeader>

        {view === 'main' && (
          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleKakaoClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">카카오톡 문의하기</h3>
                    <p className="text-sm text-slate-500">실시간 채팅 상담</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setView('email')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">이메일 문의하기</h3>
                    <p className="text-sm text-slate-500">ttokbill.service@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleViewMyInquiries}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">나의 문의</h3>
                    <p className="text-sm text-slate-500">문의 내역 확인</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-2 pt-4 text-xs text-slate-400">
              <Phone className="w-3 h-3" />
              <span>똑빌 전화문의: 010-5945-0198</span>
            </div>
          </div>
        )}

        {view === 'email' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                ℹ️ 입력하신 메일로 영업일 1-2일 내에 회신을 보내드리겠습니다.
              </p>
            </div>

            <div className="space-y-2">
              <Label>회신받을 이메일 *</Label>
              <Input
                type="email"
                value={emailForm.replyEmail}
                onChange={(e) => setEmailForm({ ...emailForm, replyEmail: e.target.value })}
                placeholder="example@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label>제목 *</Label>
              <Input
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="문의 제목을 입력해주세요"
              />
            </div>

            <div className="space-y-2">
              <Label>문의 내용 *</Label>
              <Textarea
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="문의하실 내용을 자세히 입력해주세요"
                rows={8}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setView('main')}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleEmailSubmit}
                disabled={isSubmitting || !emailForm.replyEmail || !emailForm.subject || !emailForm.message}
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    문의하기
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {view === 'myInquiries' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                ℹ️ 답변은 입력하신 메일로 영업일 1-2일 내에 회신을 보내드리겠습니다.
              </p>
            </div>

            {isLoadingInquiries ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">문의 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{inquiry.subject}</h4>
                        <Badge 
                          variant={inquiry.status === '답변완료' ? 'default' : 'secondary'}
                          className={inquiry.status === '답변완료' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 whitespace-pre-wrap">{inquiry.message}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>회신 이메일: {inquiry.reply_email}</span>
                        <span>•</span>
                        <span>{new Date(inquiry.created_date).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}