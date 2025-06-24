import cron from 'node-cron'
import LeaveTypeModel from '../models/HRM/leaveType.model.js'
import EmployeeLeaveBalanceModel from '../models/HRM/employeeLeaveBalance.model.js'


// Runs at 12:00 AM on the 1st of every month
cron.schedule('0 0 1 * *', async () => {
  console.log('🔁 Running leave balance reset job');

  const today = new Date();
  const isJanuary = today.getMonth() === 0; // 0 = January

  try {
    // Fetch all leave types
    const leaveTypes = await LeaveTypeModel.find();

    for (const leaveType of leaveTypes) {
      const shouldReset =
        leaveType.interval === 'Current Month' ||
        (leaveType.interval === 'Current Financial Year' && isJanuary);

      if (shouldReset) {
        const result = await EmployeeLeaveBalanceModel.updateMany(
          { leaveType: leaveType._id },
          { $set: { usedLeaves: 0 } }
        );

        console.log(
          `✅ Reset usedLeaves for "${leaveType.leaveType}" — ${result.modifiedCount} records updated`
        );
      }
    }
  } catch (err) {
    console.error('❌ Error resetting leave balances:', err);
  }
});