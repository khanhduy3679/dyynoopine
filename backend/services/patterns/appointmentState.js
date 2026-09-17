// State Pattern: quản lý vòng đời Appointment và chặn chuyển trạng thái không hợp lệ.
class AppointmentStateMachine {
  constructor() {
    this.allowedTransitions = {
      pending_otp: ['confirmed', 'cancelled', 'expired'],
      confirmed: ['checked_in', 'cancelled'],
      checked_in: ['in_progress'],
      in_progress: ['completed'],
      completed: [],
      cancelled: [],
      expired: []
    };
  }

  canTransition(from, to) {
    return (this.allowedTransitions[from] || []).includes(to);
  }

  assertTransition(from, to) {
    if (!this.canTransition(from, to)) {
      throw new Error(`Không thể chuyển trạng thái từ ${from} sang ${to}`);
    }
  }
}

module.exports = new AppointmentStateMachine();
