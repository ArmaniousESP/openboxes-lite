import { AppState, Product, InventoryItem, Location } from "./types";

const locations: Location[] = [
  { id: "loc-1", name: "PFA Main Warehouse", type: "DEPOT" },
  { id: "loc-2", name: "Near Expire Zone", type: "ZONE", parentId: "loc-1" },
  { id: "loc-3", name: "Strips(Near Expire)10", type: "BIN", parentId: "loc-2" },
  { id: "loc-4", name: "Strips(Near Expire)11", type: "BIN", parentId: "loc-2" },
  { id: "loc-5", name: "Strips(Near Expire)12", type: "BIN", parentId: "loc-2" },
];

const rawMedicines = [
  { code: "FP-VA-663.01", name: "DALAFUNGIL 100 MG POWDER FOR IV INFUSION", lot: "2412169", locator: "Strips(Near Expire)10", qty: 658, exp: "2026-12-31", price: 1346 },
  { code: "FP-TB-565", name: "MELLITOFIX 10 MG 30 TAB", lot: "2312768A", locator: "Strips(Near Expire)11", qty: 2388, exp: "2026-12-31", price: 204 },
  { code: "FP-CP-059.06", name: "CYMBATEX 20 MG 30 CAPSULES", lot: "2311408", locator: "Strips(Near Expire)12", qty: 11433, exp: "2026-11-30", price: 174 },
  { code: "FP-CP-059.03", name: "CYMBATEX 30 MG 30 CAPSULES", lot: "2311409", locator: "Strips(Near Expire)12", qty: 11468, exp: "2026-11-30", price: 228 },
  { code: "FP-VA-270.01", name: "NAUSETRON 0.05 MG/ 1ML VIAL 1.5ML FOR IV INJECTION", lot: "2411449", locator: "Strips(Near Expire)10", qty: 13692, exp: "2026-12-31", price: 127.5 },
  { code: "FP-TB-127.01", name: "GLIMITOID 2MG 30 TABLETS", lot: "2309678", locator: "Strips(Near Expire)12", qty: 715, exp: "2026-09-30", price: 19.5 },
  { code: "FP-TB-395.07", name: "TECAVIR 1 MG 30 TAB", lot: "2409534", locator: "Strips(Near Expire)12", qty: 926, exp: "2026-09-30", price: 2517 },
  { code: "FP-UE-291", name: "OPTILUBRIC 1.6 MG /0.5 ML UNI-DOSE EYE DROP 30 UNIT", lot: "2409590B", locator: "Strips(Near Expire)1", qty: 1964, exp: "2026-09-30", price: 96 },
  { code: "FP-CR-387", name: "TRITOSPOT CREAM 15 GM", lot: "2310281", locator: "Strips(Near Expire)17", qty: 46, exp: "2026-10-31", price: 38 },
  { code: "FP-CR-246", name: "MOOV MASSAGE CREAM 40 GM", lot: "2310292", locator: "Strips(Near Expire)17", qty: 71, exp: "2026-10-31", price: 23 },
  { code: "FP-CP-639.02", name: "SERINOMANTINE 28 MG 30 CAP", lot: "2410606", locator: "Strips(Near Expire)12", qty: 394, exp: "2026-10-31", price: 480 },
  { code: "FP-TB-442.01", name: "VORTOXICALM 10 MG 20 FCT", lot: "2410980", locator: "Strips(Near Expire)12", qty: 487, exp: "2026-10-31", price: 340 },
  { code: "FP-CP-639.01", name: "SERINOMANTINE 14 MG 30 CAP", lot: "2410605", locator: "Strips(Near Expire)12", qty: 499, exp: "2026-10-31", price: 294 },
  { code: "FP-DR-522", name: "CORNEFRESH 5 ML EYE DROP", lot: "2310927", locator: "Strips(Near Expire)15", qty: 2505, exp: "2026-10-31", price: 67 },
  { code: "FP-CR-102", name: "FUSIDERM CREAM 15GM", lot: "2411341", locator: "Strips(Near Expire)17", qty: 19, exp: "2026-11-30", price: 44 },
  { code: "FP-TB-540", name: "DACLAVIRDIN 60 MG 28 TAB", lot: "2311477A", locator: "Strips(Near Expire)12", qty: 107, exp: "2026-11-30", price: 120 },
  { code: "FP-DR-250.03", name: "MOXIFLOX EYE DROPS 5 ML (EVAPHARMA)", lot: "2311675A", locator: "Strips(Near Expire)1", qty: 349, exp: "2026-11-30", price: 33 },
  { code: "FP-TB-070.07", name: "DONAZIL 5 MG ODT 20 TAB", lot: "2410932", locator: "Strips(Near Expire)11", qty: 754, exp: "2026-11-30", price: 88 },
  { code: "FP-TB-312.07", name: "PAROXTINE 37.5 MG CR 30 TAB", lot: "2311583A", locator: "Strips(Near Expire)11", qty: 1231, exp: "2026-11-30", price: 132 },
  { code: "FP-DR-541.01", name: "TEKLIVA 2.5 ML EYE DROPS", lot: "2411623", locator: "Strips(Near Expire)15", qty: 3909, exp: "2026-11-30", price: 79 },
  { code: "FP-DR-541", name: "TEKLIVA PLUS 2.5 ML EYE DROPS", lot: "2411624", locator: "Strips(Near Expire)14", qty: 4268, exp: "2026-11-30", price: 116 },
  { code: "FP-SY-421", name: "VENDEXINE SYRUP 125ML", lot: "2411659", locator: "Strips(Near Expire)17", qty: 46, exp: "2026-12-31", price: 29 },
  { code: "FP-SY-077", name: "DESLORATE SYRUP 0.5 MG/ML - 100 ML", lot: "2312021", locator: "Strips(Near Expire)10", qty: 96, exp: "2026-12-31", price: 26 },
  { code: "FP-CP-165", name: "INDACTOVEN 110/50 MCG 30 CAP", lot: "2505281", locator: "Strips(Near Expire)12", qty: 365, exp: "2026-12-31", price: 463 },
  { code: "FP-TB-127.02", name: "GLIMITOID 4MG 30 TABLETS", lot: "2312752", locator: "Strips(Near Expire)12", qty: 598, exp: "2026-12-31", price: 18 },
  { code: "FP-SY-077-B", name: "DESLORATE SYRUP 0.5 MG/ML - 100 ML", lot: "2312717", locator: "Strips(Near Expire)10", qty: 4777, exp: "2026-12-31", price: 26 },
  { code: "FP-TB-565-B", name: "MELLITOFIX 10 MG 30 TAB", lot: "2312767A", locator: "Strips(Near Expire)12", qty: 7084, exp: "2026-12-31", price: 204 },
  { code: "FP-SY-077-C", name: "DESLORATE SYRUP 0.5 MG/ML - 100 ML", lot: "2312133", locator: "Strips(Near Expire)10", qty: 12486, exp: "2026-12-31", price: 26 },
  { code: "FP-SY-077-D", name: "DESLORATE SYRUP 0.5 MG/ML - 100 ML", lot: "2312716", locator: "Strips(Near Expire)10", qty: 14752, exp: "2026-12-31", price: 26 },
];

function buildSeed(): AppState {
  const productMap = new Map<string, Product>();
  const inventory: InventoryItem[] = [];
  rawMedicines.forEach((m, idx) => {
    if (!productMap.has(m.code)) {
      productMap.set(m.code, {
        id: `prod-${m.code}`,
        productCode: m.code,
        name: m.name,
        description: m.name,
        category: "Donation Stock",
        unitOfMeasure: "EA",
        lotAndExpiryControl: true,
        active: true,
        unitPrice: m.price,
        createdAt: new Date().toISOString(),
      });
    }
    inventory.push({
      id: `inv-${idx + 1}`,
      productId: `prod-${m.code}`,
      lotNumber: m.lot,
      expirationDate: m.exp,
      quantity: m.qty,
      binLocation: m.locator,
      orgCode: "PFA",
    });
  });
  return {
    products: Array.from(productMap.values()),
    inventory,
    locations,
    transactions: [],
  };
}

export const SEED_DATA = buildSeed();
