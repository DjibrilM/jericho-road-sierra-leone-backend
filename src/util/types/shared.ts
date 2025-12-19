export type AuthRequestPayload = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type Role =
  | 'admin'
  | 'doctor'
  | 'reception'
  | 'entry-checker'
  | 'checkup-agent'
  | 'comptable'
  | 'pharmacy-stock-manager'
  | 'on-sell-pharamacy-stock-manager';

export type HospitalizationImgergencyMedicine = {
  createdAt: string;
  description: string;
  name: string;
  price: '1';
  quantity: number;
  updatedAt: string;
};

export type surgeryEmergencyRequest = {
  createAt: string;
  recordId: string;
  medicines: HospitalizationImgergencyMedicine[];
  patientId: string;
};

export type hopsitalizationEmergencyRequest = {
  createAt: string;
  recordId: string;
  medicines: HospitalizationImgergencyMedicine[];
  patientId: string;
};