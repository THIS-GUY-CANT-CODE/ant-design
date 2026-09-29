from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.comments import Comment
from openpyxl.utils import get_column_letter as L

wb = Workbook()
F = 'Arial'
blue = Font(name=F, color='0000FF'); black = Font(name=F); bold = Font(name=F, bold=True)
green = Font(name=F, color='008000'); title = Font(name=F, bold=True, size=14)
yellow = PatternFill('solid', fgColor='FFFF00'); grey = PatternFill('solid', fgColor='EEEEEE')
GBP = '£#,##0;(£#,##0);-'; GBP2 = '£#,##0.00;(£#,##0.00);-'; PCT = '0.0%;(0.0%);-'; NUM = '#,##0.0;(#,##0.0);-'; INT = '#,##0;(#,##0);-'
thin = Border(bottom=Side(style='thin', color='999999'))

# ---------- Assumptions ----------
a = wb.active; a.title = 'Assumptions'
a['A1'] = 'Second Coat: 12-month model, assumptions'; a['A1'].font = title
a['A2'] = 'Edit the blue cells (yellow = the key levers). Every other number in the workbook is a formula.'; a['A2'].font = Font(name=F, italic=True)
rows = [
 # key, label, value, fmt, note, key-lever
 ('demos_wk', 'Demos built per week (month 1)', 4, NUM, 'Your call. With build.js about 1–2 hrs each once research is done.', True),
 ('demo_growth', 'Monthly growth in demos built', 0.05, PCT, 'Assumption: gets faster as the templates mature.', False),
 ('weeks_mo', 'Weeks per month', 4.33, NUM, '52 / 12', False),
 ('conv', 'Demo → paid conversion', 0.125, PCT, 'Assumption from PLAN.md: 1 in 8 cold demos. Replace with real data after the first 20 pitches.', True),
 ('rebrand_mix', 'Share of paid clients choosing Rebrand', 0.25, PCT, 'Assumption.', True),
 ('p_refresh', 'Refresh price (£)', 500, GBP, 'PLAN.md price.', True),
 ('p_rebrand', 'Rebrand price (£)', 1200, GBP, 'PLAN.md price.', False),
 ('care_uptake', 'Share of new clients taking the Care plan', 0.5, PCT, 'Assumption.', True),
 ('p_care', 'Care plan price (£ / month)', 49, GBP, 'PLAN.md price.', False),
 ('churn', 'Care plan monthly churn', 0.03, PCT, 'Assumption (about 30% lost per year).', False),
 ('hrs_demo', 'Hours per demo (research + build + pitch)', 2.5, NUM, 'Assumption with the generator pipeline.', False),
 ('hrs_refresh', 'Hours to deliver a Refresh after payment', 4, NUM, 'Intake, edits, go-live checklist.', False),
 ('hrs_rebrand', 'Hours to deliver a Rebrand after payment', 10, NUM, 'Assumption.', False),
 ('hrs_care', 'Hours per care client per month', 0.5, NUM, 'Monthly update plus the report.', False),
 ('fee_pct', 'Card fee (% of payment)', 0.015, PCT, 'Typical UK card rate. Check your provider (e.g. Stripe UK pricing).', False),
 ('fee_fixed', 'Card fee (fixed £ per payment)', 0.20, GBP2, 'Typical UK card rate. Check your provider.', False),
 ('host_cost', 'Hosting + domain cost per care client (£ / month)', 2, GBP2, 'Vercel Hobby is free for small static sites, and a domain is about £10–15/yr. Check current pricing.', False),
 ('tools', 'Fixed tools and software (£ / month)', 40, GBP, 'Assumption: Places API, email, Stripe, etc.', False),
]
R = {}
a['A4'], a['B4'], a['C4'] = 'Assumption', 'Value', 'Note / source'
for c in ('A4', 'B4', 'C4'): a[c].font = bold; a[c].fill = grey
for i, (k, lab, v, fmt, note, key) in enumerate(rows, start=5):
    a.cell(i, 1, lab).font = black
    c = a.cell(i, 2, v); c.font = blue; c.number_format = fmt
    if key: c.fill = yellow
    a.cell(i, 3, note).font = Font(name=F, color='555555')
    R[k] = f"Assumptions!$B${i}"
a.column_dimensions['A'].width = 48; a.column_dimensions['B'].width = 14; a.column_dimensions['C'].width = 80

# ---------- Model ----------
m = wb.create_sheet('Model')
m['A1'] = 'Monthly projection (£)'; m['A1'].font = title
m['A3'] = 'Line'; m['A3'].font = bold; m['A3'].fill = grey
for j in range(12):
    c = m.cell(3, 2 + j, f'M{j+1}'); c.font = bold; c.fill = grey; c.alignment = Alignment(horizontal='center')
m.cell(3, 14, 'Total').font = bold; m.cell(3, 14).fill = grey
lines = ['Demos built', 'New paid clients', '  of which Refresh', '  of which Rebrand', 'Project revenue',
         'Care clients at start', 'New care clients', 'Care clients lost', 'Care clients at end', 'Care revenue',
         'Total revenue', 'Card fees', 'Hosting + domains', 'Tools', 'Total costs', 'Profit',
         'Cumulative profit', 'Hours worked', 'Effective £ per hour', 'Monthly recurring revenue (end)']
row = {n: 4 + i for i, n in enumerate(lines)}
for n, r in row.items():
    m.cell(r, 1, n).font = bold if n in ('Total revenue', 'Profit', 'Cumulative profit') else black
sumrows = ['Demos built', 'New paid clients', '  of which Refresh', '  of which Rebrand', 'Project revenue', 'New care clients',
           'Care clients lost', 'Care revenue', 'Total revenue', 'Card fees', 'Hosting + domains', 'Tools', 'Total costs', 'Profit', 'Hours worked']
for j in range(12):
    col = L(2 + j); prev = L(1 + j)
    f = {}
    f['Demos built'] = f"={R['demos_wk']}*{R['weeks_mo']}*(1+{R['demo_growth']})^{j}"
    f['New paid clients'] = f"={col}{row['Demos built']}*{R['conv']}"
    f['  of which Refresh'] = f"={col}{row['New paid clients']}*(1-{R['rebrand_mix']})"
    f['  of which Rebrand'] = f"={col}{row['New paid clients']}*{R['rebrand_mix']}"
    f['Project revenue'] = f"={col}{row['  of which Refresh']}*{R['p_refresh']}+{col}{row['  of which Rebrand']}*{R['p_rebrand']}"
    f['Care clients at start'] = '=0' if j == 0 else f"={prev}{row['Care clients at end']}"
    f['New care clients'] = f"={col}{row['New paid clients']}*{R['care_uptake']}"
    f['Care clients lost'] = f"={col}{row['Care clients at start']}*{R['churn']}"
    f['Care clients at end'] = f"={col}{row['Care clients at start']}+{col}{row['New care clients']}-{col}{row['Care clients lost']}"
    f['Care revenue'] = f"={col}{row['Care clients at start']}*{R['p_care']}"
    f['Total revenue'] = f"={col}{row['Project revenue']}+{col}{row['Care revenue']}"
    f['Card fees'] = f"={col}{row['Total revenue']}*{R['fee_pct']}+({col}{row['New paid clients']}+{col}{row['Care clients at start']})*{R['fee_fixed']}"
    f['Hosting + domains'] = f"={col}{row['Care clients at end']}*{R['host_cost']}"
    f['Tools'] = f"={R['tools']}"
    f['Total costs'] = f"={col}{row['Card fees']}+{col}{row['Hosting + domains']}+{col}{row['Tools']}"
    f['Profit'] = f"={col}{row['Total revenue']}-{col}{row['Total costs']}"
    f['Cumulative profit'] = f"={col}{row['Profit']}" if j == 0 else f"={prev}{row['Cumulative profit']}+{col}{row['Profit']}"
    f['Hours worked'] = f"={col}{row['Demos built']}*{R['hrs_demo']}+{col}{row['  of which Refresh']}*{R['hrs_refresh']}+{col}{row['  of which Rebrand']}*{R['hrs_rebrand']}+{col}{row['Care clients at start']}*{R['hrs_care']}"
    f['Effective £ per hour'] = f"=IF({col}{row['Hours worked']}>0,{col}{row['Profit']}/{col}{row['Hours worked']},0)"
    f['Monthly recurring revenue (end)'] = f"={col}{row['Care clients at end']}*{R['p_care']}"
    for n, formula in f.items():
        c = m.cell(row[n], 2 + j, formula); c.font = black
        c.number_format = NUM if n in ('Demos built', 'New paid clients', '  of which Refresh', '  of which Rebrand', 'Care clients at start', 'New care clients', 'Care clients lost', 'Care clients at end', 'Hours worked') else GBP
for n in sumrows:
    c = m.cell(row[n], 14, f"=SUM(B{row[n]}:M{row[n]})"); c.font = bold
    c.number_format = m.cell(row[n], 2).number_format
c = m.cell(row['Effective £ per hour'], 14, f"=IF(N{row['Hours worked']}>0,N{row['Profit']}/N{row['Hours worked']},0)"); c.font = bold; c.number_format = GBP
for r in (row['Total revenue'], row['Profit']):
    for j in range(1, 15): m.cell(r, j).border = thin
m.column_dimensions['A'].width = 34
for j in range(2, 15): m.column_dimensions[L(j)].width = 11
m.freeze_panes = 'B4'
m['A26'] = 'Care revenue is billed on clients at the start of each month. Fractional clients are averages (expected values), not literal half-clients.'
m['A26'].font = Font(name=F, italic=True, color='555555')

# ---------- Summary ----------
s = wb.create_sheet('Summary', 0)
s['A1'] = 'Second Coat: 12-month summary'; s['A1'].font = title
s['A2'] = 'Change the yellow cells on the Assumptions tab and everything here updates.'; s['A2'].font = Font(name=F, italic=True)
summ = [
 ('Demos built (12 months)', f"=Model!N{row['Demos built']}", NUM),
 ('Paid clients (12 months)', f"=Model!N{row['New paid clients']}", NUM),
 ('Total revenue (12 months)', f"=Model!N{row['Total revenue']}", GBP),
 ('Total profit (12 months)', f"=Model!N{row['Profit']}", GBP),
 ('Hours worked (12 months)', f"=Model!N{row['Hours worked']}", NUM),
 ('Effective £ per hour', f"=Model!N{row['Effective £ per hour']}", GBP),
 ('Care clients at month 12', f"=Model!M{row['Care clients at end']}", NUM),
 ('Monthly recurring revenue at month 12', f"=Model!M{row['Monthly recurring revenue (end)']}", GBP),
 ('Recurring revenue run-rate (× 12)', f"=Model!M{row['Monthly recurring revenue (end)']}*12", GBP),
 ('Demos needed per paid client', f"=IF({R['conv']}>0,1/{R['conv']},0)", NUM),
]
s['A4'], s['B4'] = 'Metric', 'Value'
for c in ('A4', 'B4'): s[c].font = bold; s[c].fill = grey
for i, (lab, frm, fmt) in enumerate(summ, start=5):
    s.cell(i, 1, lab).font = black
    c = s.cell(i, 2, frm); c.font = green; c.number_format = fmt
s['A17'] = 'Sensitivity: 12-month profit by conversion rate (other assumptions held)'; s['A17'].font = bold
s['A18'], s['B18'], s['C18'] = 'Conversion', 'Paid clients', 'Approx. 12-month project revenue'
for c in ('A18', 'B18', 'C18'): s[c].font = bold; s[c].fill = grey
for i, cv in enumerate([0.05, 0.10, 0.125, 0.20, 0.30], start=19):
    c = s.cell(i, 1, cv); c.font = blue; c.number_format = PCT
    c2 = s.cell(i, 2, f"=Model!N{row['Demos built']}*A{i}"); c2.number_format = NUM; c2.font = black
    c3 = s.cell(i, 3, f"=B{i}*((1-{R['rebrand_mix']})*{R['p_refresh']}+{R['rebrand_mix']}*{R['p_rebrand']})"); c3.number_format = GBP; c3.font = black
s['A25'] = 'The sensitivity table excludes care revenue, so it understates totals. Use it to compare conversion scenarios.'; s['A25'].font = Font(name=F, italic=True, color='555555')
s.column_dimensions['A'].width = 44; s.column_dimensions['B'].width = 16; s.column_dimensions['C'].width = 34
from openpyxl.workbook.properties import CalcProperties
wb.calculation = CalcProperties(fullCalcOnLoad=True)
import os; wb.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.xlsx'))
print('saved')
