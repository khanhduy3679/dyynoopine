const Appointment = require('../../models/Appointment');

class Handler {
  setNext(handler) { this.next = handler; return handler; }
  async handle(ctx) { return this.next ? this.next.handle(ctx) : ctx; }
}

// Chain of Responsibility: mỗi handler kiểm tra 1 luật, fail thì dừng ngay.
class ServiceActiveHandler extends Handler {
  async handle(ctx) {
    if (!ctx.service) throw Object.assign(new Error('Dịch vụ không tồn tại'), { status: 404 });
    if (ctx.service.isActive === false) throw Object.assign(new Error('Dịch vụ đang tạm ngưng'), { status: 400 });
    return super.handle(ctx);
  }
}

class StaffCanDoServiceHandler extends Handler {
  async handle(ctx) {
    if (ctx.staffId && !ctx.staff) throw Object.assign(new Error('Stylist không tồn tại hoặc đang nghỉ'), { status: 404 });
    if (ctx.staff && Array.isArray(ctx.staff.serviceIds) && ctx.staff.serviceIds.length > 0 && !ctx.staff.serviceIds.some((id) => String(id) === String(ctx.service._id))) {
      throw Object.assign(new Error('Stylist không thực hiện dịch vụ này'), { status: 400 });
    }
    return super.handle(ctx);
  }
}

class SlotAvailableHandler extends Handler {
  async handle(ctx) {
    if (!ctx.staff) return super.handle(ctx);
    const conflict = await Appointment.findOne({ staffId: ctx.staff._id, status: { $in: ['pending_otp', 'confirmed', 'checked_in', 'in_progress'] }, startTime: { $lt: ctx.endTime }, endTime: { $gt: ctx.startTime } });
    if (conflict) throw Object.assign(new Error('Khung giờ này đã có người đặt'), { status: 409 });
    return super.handle(ctx);
  }
}

class WorkingHoursHandler extends Handler {
  async handle(ctx) {
    const h = ctx.startTime.getHours();
    if (h < 8 || h >= 20) throw Object.assign(new Error('Salon chỉ nhận lịch từ 08:00 đến 20:00'), { status: 400 });
    return super.handle(ctx);
  }
}

function buildBookingValidationChain() {
  const first = new ServiceActiveHandler();
  first.setNext(new StaffCanDoServiceHandler()).setNext(new SlotAvailableHandler()).setNext(new WorkingHoursHandler());
  return first;
}

module.exports = buildBookingValidationChain;
