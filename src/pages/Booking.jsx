import React, { useState } from 'react';
import Modal from '../components/Modal';

export default function Booking({ onSuccess, onNavigate }) {
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('any');
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mockServices, mockStaff, mockCustomers } = require('../data/mockData');
  const { formatVND, getCalendarDays, timeSlots, MONTHS_VI, DAYS_VI } = require('../utils');

  const categories = [...new Set(mockServices.filter(s => s.active).map(s => s.category))];
  const chosenServices = mockServices.filter(s => selectedServices.includes(s.id));
  const total = chosenServices.reduce((sum, s) => sum + s.price, 0);
  const duration = chosenServices.reduce((sum, s) => sum + s.duration, 0);
  const slots = timeSlots();
  const calDays = getCalendarDays(calYear, calMonth);

  const isoDate = selectedDate
    ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    : '';

  const canNext = [
    selectedServices.length > 0,
    true,
    !!selectedDate && !!selectedTime,
    !!(foundCustomer || (phoneInput && newName)),
    true,
  ];

  const searchCustomer = () => {
    const found = mockCustomers.find(c => c.phone === phoneInput.trim());
    setFoundCustomer(found || null);
    if (found) { setNewName(found.name); setNewEmail(found.email || ''); }
  };

  const handleSubmit = () => {
    // Tạo appointment object (sẽ gửi lên backend sau)
    const appointment = {
      customerName: foundCustomer?.name || newName,
      customerPhone: foundCustomer?.phone || phoneInput,
      staffId: selectedStaff === 'any' ? null : selectedStaff,
      staffName: selectedStaff === 'any' ? 'Tự phân công' : mockStaff.find(s => s.id === selectedStaff)?.name,
      services: chosenServices.map(s => ({ id: s.id, name: s.name, price: s.price })),
      date: isoDate,
      time: selectedTime,
      duration,
      status: 'pending',
      totalPrice: total,
      notes: notes || null,
    };
    console.log('Creating appointment:', appointment);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Modal maxWidth="420px" ariaLabel="Đặt lịch thành công">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold" style={{ color: '#3b2b25', marginBottom: '4px' }}>Đặt lịch thành công!</h2>
          <p style={{ color: '#78716c', marginBottom: '4px' }}>{foundCustomer?.name || newName}</p>
          <p style={{ color: '#78716c', fontSize: '13px', marginBottom: '20px' }}>
            {chosenServices.map(s => s.name).join(', ')} · {isoDate.split('-').reverse().join('/')} lúc {selectedTime}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setSubmitted(false); setStep(0); setSelectedServices([]); setSelectedStaff('any');
                setSelectedDate(''); setSelectedTime(''); setPhoneInput(''); setFoundCustomer(null);
                setNewName(''); setNewEmail(''); setNotes('');
              }}
              className="btn-secondary"
            >
              Đặt lịch mới
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setSelectedServices([]); setSelectedStaff('any'); setSelectedDate(''); setSelectedTime(''); }}
              className="btn-primary"
              style={{ background: '#b2775b' }}
            >
              Xem lịch hẹn
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="salon-card" style={{ marginBottom: '16px' }}>
        <div className="wizard-progress">
          {['Dịch vụ', 'Nhân viên', 'Ngày & Giờ', 'Khách hàng', 'Xác nhận'].map((label, i) => (
            <div key={label} className="wizard-step" style={{ flex: 1 }}>
              <div className={`wizard-step-num ${
                i < step ? 'step-circle-done' : i === step ? 'step-circle-active' : ''
              }`} style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                {i < step ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                    <path d="M2 6l3 3 4-4" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`step-label ${i === step ? 'font-medium text-neutral-800' : 'text-neutral-400'}`} style={{ fontSize: '12px' }}>
                {label}
              </span>
              {i < 4 && <div className="step-connector" style={{ background: i < step ? '#b2775b' : '#e5e7eb' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="salon-card">
        <div className="salon-table-header">
          <h2 style={{ fontWeight: 600, fontSize: '16px', color: '#3b2b25', margin: 0 }}>Bước {step + 1}: {['Dịch vụ', 'Nhân viên', 'Ngày & Giờ', 'Khách hàng', 'Xác nhận'][step]}</h2>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Step 0: Services */}
          {step === 0 && (
            <div className="space-y-4">
              {categories.map(cat => (
                <div key={cat}>
                  <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#78716c', marginBottom: '8px' }}>{cat}</h3>
                  <div className="choice-grid">
                    {mockServices.filter(s => s.active && s.category === cat).map(svc => {
                      const checked = selectedServices.includes(svc.id);
                      return (
                        <label key={svc.id} className={`choice-btn ${checked ? 'selected' : ''}`}>
                          <input type="checkbox" checked={checked} onChange={() => setSelectedServices(prev => prev.includes(svc.id) ? prev.filter(x => x !== svc.id) : [...prev, svc.id])} style={{ display: 'none' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                            <div style={{ flex: 1 }}>
                              <div className="choice-name">{svc.name}</div>
                              {svc.description && <div className="choice-detail">{svc.description}</div>}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontWeight: 700, color: '#b2775b', fontSize: '13px' }}>{formatVND(svc.price)}</div>
                              <div style={{ fontSize: '11px', color: '#78716c' }}>{svc.duration}ph</div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Staff */}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label className={`choice-btn ${selectedStaff === 'any' ? 'selected' : ''}`} style={{ gridColumn: '1/-1' }}>
                <input type="radio" name="staff" value="any" checked={selectedStaff === 'any'} onChange={() => setSelectedStaff('any')} style={{ display: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0e4d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>✨</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Bất kỳ nhân viên</div>
                    <div style={{ fontSize: '12px', color: '#78716c' }}>Hệ thống tự phân công</div>
                  </div>
                </div>
              </label>
              {mockStaff.filter(s => s.active).map(staff => (
                <label key={staff.id} className={`choice-btn ${selectedStaff === staff.id ? 'selected' : ''}`}>
                  <input type="radio" name="staff" value={staff.id} checked={selectedStaff === staff.id} onChange={() => setSelectedStaff(staff.id)} style={{ display: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#b2775b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                      {staff.name.split(' ').slice(-1)[0].charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{staff.name}</div>
                      <div style={{ fontSize: '11px', color: '#78716c' }}>{staff.role}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                        <span style={{ color: '#c9a84c' }}>★</span>
                        <span style={{ fontSize: '11px', color: '#78716c' }}>{staff.rating}</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Calendar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} className="btn-secondary" style={{ padding: '4px 8px', minWidth: 'auto' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2L5 6l4 4" /></svg>
                  </button>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{MONTHS_VI[calMonth]} {calYear}</span>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} className="btn-secondary" style={{ padding: '4px 8px', minWidth: 'auto' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2l4 4-4 4" /></svg>
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                  {DAYS_VI.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#a09080', padding: '4px 0' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                  {calDays.map((d, i) => {
                    const ds = d ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : '';
                    const isSelected = d !== null && selectedDate === String(d);
                    const isToday = ds === new Date().toISOString().split('T')[0];
                    return (
                      <button
                        key={i}
                        disabled={!d}
                        onClick={() => d && setSelectedDate(String(d))}
                        style={{
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid transparent',
                          background: isSelected ? '#b2775b' : 'transparent',
                          color: isSelected ? 'white' : isToday ? '#b2775b' : '#3b2b25',
                          fontWeight: isSelected || isToday ? 700 : 400,
                          fontSize: '12px',
                          cursor: d ? 'pointer' : 'default',
                          opacity: d ? 1 : 0,
                          transition: 'all 0.15s',
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: '#3b2b25' }}>
                  {selectedDate ? `Chọn giờ — ${String(selectedDate).padStart(2, '0')}/${String(calMonth + 1).padStart(2, '0')}/${calYear}` : 'Chọn ngày trước'}
                </p>
                {selectedDate && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                    {slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: selectedTime === slot ? '#b2775b' : '#f0e4d8',
                          background: selectedTime === slot ? '#b2775b' : 'white',
                          color: selectedTime === slot ? 'white' : '#3b2b25',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Customer */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>Tìm kiếm theo SĐT</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="0901234567"
                    className="input-field"
                    style={{ flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && searchCustomer()}
                  />
                  <button onClick={searchCustomer} className="btn-primary" style={{ padding: '9px 16px', fontSize: '13px', minWidth: 'auto' }}>
                    Tìm
                  </button>
                </div>
              </div>

              {foundCustomer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#fdf0ea', borderRadius: '10px', border: '1px solid #f0d0c0' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#b2775b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {foundCustomer.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{foundCustomer.name}</div>
                    <div style={{ fontSize: '12px', color: '#78716c' }}>{foundCustomer.phone} · {foundCustomer.totalVisits} lần đến · {formatVND(foundCustomer.totalSpent)}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#059669" strokeWidth="2"><path d="M2.5 8l4 4 7-7" /></svg>
                </div>
              )}

              {!foundCustomer && (
                <div style={{ paddingTop: '8px', borderTop: '1px solid #f0e4d8' }}>
                  <p style={{ fontSize: '12px', color: '#78716c', marginBottom: '8px' }}>Khách hàng mới — điền thông tin:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Họ và tên *</label>
                      <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nguyễn Thị Lan" className="input-field" />
                    </div>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Email</label>
                      <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@gmail.com" className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Ghi chú</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" placeholder="Yêu cầu đặc biệt, dị ứng hóa chất..." className="input-field" />
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div style={{ background: '#faf8f6', borderRadius: '12px', padding: '16px', space: '10px 0' }}>
              {[
                { label: 'Khách hàng', value: foundCustomer?.name || newName || '—' },
                { label: 'Nhân viên', value: selectedStaff === 'any' ? 'Bất kỳ NV' : mockStaff.find(s => s.id === selectedStaff)?.name },
                { label: 'Ngày & Giờ', value: `${isoDate.split('-').reverse().join('/')} lúc ${selectedTime}`, mono: true },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e4d8' }}>
                  <span style={{ color: '#78716c', fontSize: '13px' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{item.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #f0e4d8', paddingTop: '10px', marginTop: '6px' }}>
                <div style={{ fontSize: '12px', color: '#78716c', marginBottom: '4px' }}>Dịch vụ</div>
                {chosenServices.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '13px' }}>
                    <span style={{ color: '#3b2b25' }}>{s.name} ({s.duration}ph)</span>
                    <span>{formatVND(s.price)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', marginTop: '6px', borderTop: '1px solid #f0e4d8' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Tổng tiền</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#b2775b' }}>{formatVND(total)}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#78716c', marginTop: '4px' }}>Thời gian ước tính: {duration} phút</div>
              {notes && (
                <div style={{ marginTop: '10px', padding: '8px 10px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '12px', color: '#92400e' }}>
                  <span style={{ fontWeight: 600 }}>Ghi chú: </span>{notes}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="wizard-footer">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="btn-secondary"
          >
            ← Quay lại
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step < 4 && (
              <span style={{ fontSize: '13px', color: '#78716c' }}>
                {formatVND(total)} · {duration}p
              </span>
            )}
            <button
              onClick={() => step < 4 ? setStep(s => s + 1) : handleSubmit()}
              disabled={!canNext[step]}
              className="btn-primary"
            >
              {step === 4 ? 'Xác nhận đặt lịch ✓' : 'Tiếp theo →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
