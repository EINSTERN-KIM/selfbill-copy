// 데모 전용 Mock 데이터 (실제 DB와 완전히 분리)

export const DEMO_BUILDING = {
  id: 'demo-building',
  name: '똑똑한빌라',
  address: '서울시 마포구 연남동 123-45',
  building_units_count: 12,
  billing_due_day: 25,
  billing_method: '균등 배분',
  bank_name: '국민은행',
  bank_account: '123-456-789012',
  bank_holder: '똑똑한빌라 관리비',
};

export const DEMO_UNITS = [
  { id: 'u1',  unit_name: '101호', tenant_name: '김민준', tenant_phone: '010-1234-5678', floor: '1', status: 'active' },
  { id: 'u2',  unit_name: '102호', tenant_name: '이서연', tenant_phone: '010-2345-6789', floor: '1', status: 'active' },
  { id: 'u3',  unit_name: '201호', tenant_name: '박지호', tenant_phone: '010-3456-7890', floor: '2', status: 'active' },
  { id: 'u4',  unit_name: '202호', tenant_name: '최유나', tenant_phone: '010-4567-8901', floor: '2', status: 'active' },
  { id: 'u5',  unit_name: '301호', tenant_name: '정현우', tenant_phone: '010-5678-9012', floor: '3', status: 'active' },
  { id: 'u6',  unit_name: '302호', tenant_name: '강소희', tenant_phone: '010-6789-0123', floor: '3', status: 'active' },
  { id: 'u7',  unit_name: '401호', tenant_name: '윤태민', tenant_phone: '010-7890-1234', floor: '4', status: 'active' },
  { id: 'u8',  unit_name: '402호', tenant_name: '임채원', tenant_phone: '010-8901-2345', floor: '4', status: 'active' },
  { id: 'u9',  unit_name: '501호', tenant_name: '한지수', tenant_phone: '010-9012-3456', floor: '5', status: 'active' },
  { id: 'u10', unit_name: '502호', tenant_name: '오승준', tenant_phone: '010-0123-4567', floor: '5', status: 'active' },
  { id: 'u11', unit_name: '601호', tenant_name: '신예린', tenant_phone: '010-1111-2222', floor: '6', status: 'active' },
  { id: 'u12', unit_name: '602호', tenant_name: '배민석', tenant_phone: '010-3333-4444', floor: '6', status: 'active' },
];

// 초대 상태: 완료 7세대, 발송중 3세대, 미초대 2세대
export const DEMO_INVITATIONS = [
  { id: 'i1',  unit_id: 'u1',  unit_name: '101호', tenant_name: '김민준', status: '가입 완료' },
  { id: 'i2',  unit_id: 'u2',  unit_name: '102호', tenant_name: '이서연', status: '가입 완료' },
  { id: 'i3',  unit_id: 'u3',  unit_name: '201호', tenant_name: '박지호', status: '가입 완료' },
  { id: 'i4',  unit_id: 'u4',  unit_name: '202호', tenant_name: '최유나', status: '가입 완료' },
  { id: 'i5',  unit_id: 'u5',  unit_name: '301호', tenant_name: '정현우', status: '가입 완료' },
  { id: 'i6',  unit_id: 'u6',  unit_name: '302호', tenant_name: '강소희', status: '가입 완료' },
  { id: 'i7',  unit_id: 'u7',  unit_name: '401호', tenant_name: '윤태민', status: '가입 완료' },
  { id: 'i8',  unit_id: 'u8',  unit_name: '402호', tenant_name: '임채원', status: '초대 발송' },
  { id: 'i9',  unit_id: 'u9',  unit_name: '501호', tenant_name: '한지수', status: '초대 발송' },
  { id: 'i10', unit_id: 'u10', unit_name: '502호', tenant_name: '오승준', status: '초대 발송' },
  { id: 'i11', unit_id: 'u11', unit_name: '601호', tenant_name: '신예린', status: '초대 전' },
  { id: 'i12', unit_id: 'u12', unit_name: '602호', tenant_name: '배민석', status: '초대 전' },
];

export const DEMO_FEE_ITEMS = [
  { id: 'f1', name: '공용전기료',      category: '일반', amount_total: 180000, type: '공용' },
  { id: 'f2', name: '공용수도료',      category: '일반', amount_total:  96000, type: '공용' },
  { id: 'f3', name: '청소비',          category: '일반', amount_total: 120000, type: '공용' },
  { id: 'f4', name: '엘리베이터 유지비', category: '일반', amount_total: 60000, type: '공용' },
  { id: 'f5', name: '소방점검비',      category: '수선', amount_total:  24000, type: '공용' },
];

const totalFee = DEMO_FEE_ITEMS.reduce((s, f) => s + f.amount_total, 0);
const perUnit = Math.round(totalFee / DEMO_UNITS.length);

export const DEMO_BILL_CYCLE = {
  id: 'bc1',
  year_month: '2026-03',
  year: 2026,
  month: 3,
  due_date: '2026-03-25',
  period_start: '2026-03-01',
  period_end: '2026-03-31',
  status: 'sent',
  total_amount: totalFee,
};

// 청구서 발송: 10세대 발송완료, 2세대 미발송
export const DEMO_UNIT_CHARGES = DEMO_UNITS.map((u, i) => ({
  id: `uc${i + 1}`,
  unit_id: u.id,
  unit_name: u.unit_name,
  tenant_name: u.tenant_name,
  amount_total: perUnit,
  is_sent: i < 10,
}));

// 납부 현황: 7세대 완납, 2세대 부분납, 3세대 미납
export const DEMO_PAYMENTS = DEMO_UNITS.map((u, i) => {
  let status, paid_amount;
  if (i < 7)       { status = '완납';  paid_amount = perUnit; }
  else if (i < 9)  { status = '부분납'; paid_amount = Math.round(perUnit * 0.5); }
  else             { status = '미납';  paid_amount = 0; }
  return {
    id: `p${i + 1}`,
    unit_id: u.id,
    unit_name: u.unit_name,
    tenant_name: u.tenant_name,
    year_month: '2026-03',
    status,
    charged_amount: perUnit,
    paid_amount,
  };
});

// 입주자 체험용 (101호 기준)
export const DEMO_MY_UNIT   = DEMO_UNITS[0];
export const DEMO_MY_CHARGE = DEMO_UNIT_CHARGES[0];
export const DEMO_MY_PAYMENT = DEMO_PAYMENTS[0];

export const DEMO_PAST_BILLS = [
  { year_month: '2026-02', amount_total: perUnit - 2000, status: '완납' },
  { year_month: '2026-01', amount_total: perUnit + 3000, status: '완납' },
  { year_month: '2025-12', amount_total: perUnit - 1000, status: '완납' },
];

export const DEMO_BREAKDOWN = DEMO_FEE_ITEMS.map(f => ({
  name: f.name,
  amount: Math.round(f.amount_total / DEMO_UNITS.length),
}));