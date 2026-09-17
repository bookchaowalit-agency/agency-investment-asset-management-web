export type PseoService = Readonly<{
  kind: 'service';
  slug: string;
  name: string;
  title: string;
  description: string;
  intent: string;
  buyer: string;
  context: string;
  workflow: readonly string[];
  deliverables: readonly string[];
  evidence: readonly string[];
  readiness: string;
  agencySlug: string;
  agencyName: string;
  agencyThaiName: string;
  agencyStatus: 'incubating' | 'target' | 'locked';
  agencyStage: string;
}>;

export const pseoService: PseoService = {
  "kind": "service",
  "slug": "investment-operating-model",
  "name": "Investment operating model (future)",
  "title": "Investment Operating Model สำหรับการตัดสินใจทุนและ portfolio",
  "description": "วางกรอบ portfolio diligence, decision record และ operating model ก่อนรับหรือจัดการทุน",
  "intent": "ต้องการจัดโครงสร้าง thesis, risk, governance และ portfolio operations ให้ตรวจสอบได้",
  "buyer": "Capital owner, family office และ institutional partner",
  "context": "เป็น future capability สำหรับ operating model ยังไม่มีการชักชวนลงทุนหรือจัดการเงินของบุคคลอื่น",
  "workflow": [
    "กำหนด investment question และ decision rights",
    "จัด thesis, risk, evidence และ monitoring assumption",
    "ออกแบบ portfolio operating cadence และ escalation",
    "ส่ง decision record ให้ capital owner ตรวจ"
  ],
  "deliverables": [
    "investment decision boundary",
    "thesis/risk/evidence register",
    "portfolio operating cadence",
    "governance และ review template"
  ],
  "evidence": [
    "ไม่อ้างผลตอบแทน, AUM, track record หรือการชักชวนลงทุน",
    "ไม่รับข้อมูลบัญชีหรือ portfolio ส่วนบุคคลใน public site",
    "กิจกรรมที่อยู่ภายใต้กฎกำกับต้องส่งต่อผู้มีใบอนุญาต"
  ],
  "readiness": "ต้องมี investment lead, compliance/legal reviewer, capital boundary และ partner authorization ก่อนเปิด inquiry",
  "agencySlug": "investment-asset-management",
  "agencyName": "Investment & Asset Management",
  "agencyThaiName": "การลงทุนและจัดการสินทรัพย์",
  "agencyStatus": "locked",
  "agencyStage": "P3"
};
