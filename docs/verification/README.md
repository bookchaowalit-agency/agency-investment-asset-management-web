# Verification

หลักฐานและ checklist สำหรับ Investment & Asset Management showcase

## pSEO service page

- Route: `/services/investment-operating-model/`
- ขอบเขต: workflow, deliverables, evidence boundary และ readiness ของ Investment & Asset Management
- ไม่มี lead form, API, database, analytics identifier หรือข้อมูลลูกค้า
- ค่าเริ่มต้นของ build เป็น `noindex` และ `Disallow: /`; เปิด index ได้เฉพาะเมื่อกำหนด `NEXT_PUBLIC_SITE_URL` และ `NEXT_PUBLIC_SITE_INDEXABLE=true` ที่ผ่านการอนุมัติ

## Local checks

```bash
npm run typecheck
npm run build
```
