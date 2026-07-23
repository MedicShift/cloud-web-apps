export enum EncounterStatus {
  PENDING = 'pending', // bed assigned, patient not yet physically arrived
  ACTIVE = 'active', // patient is currently in this bed, ongoing care
  TRANSFERRED = 'transferred', // moved to a different department/bed — this encounter closes, a new one opens
  DISCHARGED = 'discharged', // care complete, patient left normally
  LEFT_AMA = 'left_ama', // left against medical advice
  DECEASED = 'deceased', // patient died during this encounter
  CANCELLED = 'cancelled', // encounter created in error, or admission never happened
}
