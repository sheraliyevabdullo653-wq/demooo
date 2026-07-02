import cron from 'node-cron';
import { getActiveReminders, deactivateReminder } from './db.js';

/**
 * Starts the reminder scheduler.
 * @param {Telegraf} bot - Telegraf bot instance
 */
export function startReminderScheduler(bot) {
  console.log("Reminder scheduler started...");

  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // We format hours/minutes in system local time (Tashkent is usually system time here)
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const hhmm = `${hh}:${mm}`;

      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const dateHhmm = `${day}.${month}.${year} ${hhmm}`;

      const activeReminders = await getActiveReminders();

      for (const rem of activeReminders) {
        let shouldTrigger = false;
        
        // 1. Daily time format: "08:30"
        if (rem.time === hhmm) {
          shouldTrigger = true;
        }
        // 2. Specific date-time format: "15.06.2026 08:30"
        else if (rem.time === dateHhmm) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          console.log(`Triggering reminder ID: ${rem.id} for user ${rem.user_id}`);
          
          let emoji = rem.type === 'pill' ? '💊' : '📅';
          let titlePrefix = rem.type === 'pill' ? 'Dori ichish vaqti' : 'Shifokor qabuli';
          
          let message = `${emoji} **${titlePrefix}!**\n\n📝 **Eslatma:** ${rem.title}\n⏰ **Vaqt:** ${rem.time}`;

          try {
            await bot.telegram.sendMessage(rem.user_id, message, { parse_mode: 'Markdown' });
            
            // If it's an appointment (one-off), we deactivate it.
            // If it's a pill reminder, it's recurring daily, so we keep it active.
            if (rem.type === 'appointment') {
              await deactivateReminder(rem.id);
            }
          } catch (err) {
            console.error(`Failed to send reminder to user ${rem.user_id}:`, err.message);
          }
        }
      }
    } catch (error) {
      console.error("Error in reminder scheduler tick:", error);
    }
  });
}
