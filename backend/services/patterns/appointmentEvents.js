const EventEmitter = require('events');

// Observer Pattern: service phát event khi lịch hẹn đổi trạng thái, Notification lắng nghe riêng.
const appointmentEvents = new EventEmitter();

appointmentEvents.on('statusChanged', ({ appointmentId, from, to }) => {
  console.log(`[Notification] Appointment ${appointmentId}: ${from} -> ${to}`);
});

module.exports = appointmentEvents;
