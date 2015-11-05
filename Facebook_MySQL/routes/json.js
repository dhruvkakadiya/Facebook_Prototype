var data = '[{"SponsorID":382,"SponsorName":"Test Name","MonthEndReport":true,"AccountingManager":"Me","UnboundProperties":[],"State":16}]';
data = JSON.parse(data);
console.log(data.SponsorName);