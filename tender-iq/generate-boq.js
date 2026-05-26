const XLSX = require('xlsx');

const data = [
  { 'Description': 'Site Clearance', 'Unit': 'm2', 'Quantity': 500, 'Rate': 10, 'Amount': 5000 },
  { 'Description': 'Excavation in soft soil', 'Unit': 'm3', 'Quantity': 200, 'Rate': 25, 'Amount': 5000 },
  { 'Description': 'Concrete Class C25', 'Unit': 'm3', 'Quantity': 100, 'Rate': 150, 'Amount': 15000 },
  { 'Description': 'Reinforcement bars', 'Unit': 'kg', 'Quantity': 5000, 'Rate': 1.2, 'Amount': 6000 },
  { 'Description': 'Brickwork 200mm thick', 'Unit': 'm2', 'Quantity': 300, 'Rate': 45, 'Amount': 13500 }
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "BOQ");

XLSX.writeFile(wb, "sample-boq.xlsx");
console.log("sample-boq.xlsx generated");
