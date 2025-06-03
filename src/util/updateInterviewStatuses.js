import Interview from '../models/interviwe.model.js'; // Fix typo here

async function updateInterviewStatuses() {
  try {
    const interviews = await Interview.find({ status: { $ne: 'completed' } });
    const now = new Date();
    for (let interview of interviews) {
      const { date, endTime } = interview;
    
      if (!date || !endTime) {
        console.warn(`Interview ${interview._id} is missing date or endTime`);
        continue;
      }
    
      const dateStr = date.toISOString().split('T')[0];
    
      const endDateTimeStr = `${dateStr}T${endTime}`;
      const endDateTime = new Date(endDateTimeStr);
    
      console.log(`End DateTime String: ${endDateTimeStr}`);
      console.log(`Parsed End Time: ${endDateTime.toString()}`);
    
      if (isNaN(endDateTime)) {
        console.warn(`Interview ${interview._id} has invalid endDateTime: ${endDateTimeStr}`);
        continue;
      }
    
      if (new Date() > endDateTime) {
        interview.status = 'completed';
        await interview.save();
        console.log(`Interview ${interview._id} marked as completed`);
      }
    }
    
  } catch (err) {
    console.error("Error updating interview statuses:", err);
  }
}

export default updateInterviewStatuses;
