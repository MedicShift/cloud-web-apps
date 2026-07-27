export enum EncounterType {
  ADMISSION = 'admission', // full inpatient stay, assigned a bed
  CONSULTATION = 'consultation', // specialist reviews patient, no bed of their own
  OBSERVATION = 'observation', // short-stay, under 24-48h, not a full admission
  EMERGENCY = 'emergency', // ED visit
  DAY_CASE = 'day_case', // same-day procedure, no overnight stay
  OUTPATIENT = 'outpatient', // scheduled visit, no bed needed
}
