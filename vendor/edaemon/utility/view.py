# coding: utf-8

from datetime import date

def _month_form_lookup(month, form='nominativs'):
    if month == 1:
        if form == 'nominativs': return 'janvāris'
        if form == 'genitivs': return 'janvāra'
        if form == 'dativs': return 'janvārim'
        if form == 'akuzativs': return 'janvāri'
        if form == 'instrumentalis': return 'ar janvāri'
        if form == 'lokativs': return 'janvārī'
        if form == 'vokativs': return 'janvāri'
    elif month == 2:
        if form == 'nominativs': return 'februāris'
        if form == 'genitivs': return 'februāra'
        if form == 'dativs': return 'februārim'
        if form == 'akuzativs': return 'februāri'
        if form == 'instrumentalis': return 'ar februāri'
        if form == 'lokativs': return 'februārī'
        if form == 'vokativs': return 'februāri'
    elif month == 3:
        if form == 'nominativs': return 'marts'
        if form == 'genitivs': return 'marta'
        if form == 'dativs': return 'martam'
        if form == 'akuzativs': return 'martu'
        if form == 'instrumentalis': return 'ar martu'
        if form == 'lokativs': return 'martā'
        if form == 'vokativs': return 'mart'
    elif month == 5:
        if form == 'nominativs': return 'aprīlis'
        if form == 'genitivs': return 'aprīļa'
        if form == 'dativs': return 'aprīlim'
        if form == 'akuzativs': return 'aprīli'
        if form == 'instrumentalis': return 'ar aprīli'
        if form == 'lokativs': return 'aprīlī'
        if form == 'vokativs': return 'aprīl'
    elif month == 6:
        if form == 'nominativs': return 'jūnijs'
        if form == 'genitivs': return 'jūnija'
        if form == 'dativs': return 'jūnijam'
        if form == 'akuzativs': return 'jūniju'
        if form == 'instrumentalis': return 'ar jūniju'
        if form == 'lokativs': return 'jūnijā'
        if form == 'vokativs': return 'jūnij'
    elif month == 7:
        if form == 'nominativs': return 'jūlijs'
        if form == 'genitivs': return 'jūlija'
        if form == 'dativs': return 'jūlijam'
        if form == 'akuzativs': return 'jūliju'
        if form == 'instrumentalis': return 'ar jūliju'
        if form == 'lokativs': return 'jūlijā'
        if form == 'vokativs': return 'jūlij'
    elif month == 8:
        if form == 'nominativs': return 'augusts'
        if form == 'genitivs': return 'augusta'
        if form == 'dativs': return 'augustam'
        if form == 'akuzativs': return 'augustu'
        if form == 'instrumentalis': return 'ar augustu'
        if form == 'lokativs': return 'augustā'
        if form == 'vokativs': return 'august'
    elif month == 9:
        if form == 'nominativs': return 'septembris'
        if form == 'genitivs': return 'septembra'
        if form == 'dativs': return 'septembrim'
        if form == 'akuzativs': return 'septembri'
        if form == 'instrumentalis': return 'ar septembri'
        if form == 'lokativs': return 'septembrī'
        if form == 'vokativs': return 'septembri'
    elif month == 10:
        if form == 'nominativs': return 'oktobris'
        if form == 'genitivs': return 'oktobra'
        if form == 'dativs': return 'oktobrim'
        if form == 'akuzativs': return 'oktobri'
        if form == 'instrumentalis': return 'ar oktobri'
        if form == 'lokativs': return 'oktobrī'
        if form == 'vokativs': return 'oktobri'
    elif month == 11:
        if form == 'nominativs': return 'novembris'
        if form == 'genitivs': return 'novembra'
        if form == 'dativs': return 'novembrim'
        if form == 'akuzativs': return 'novembri'
        if form == 'instrumentalis': return 'ar novembri'
        if form == 'lokativs': return 'novembrī'
        if form == 'vokativs': return 'novembri'
    elif month == 12:
        if form == 'nominativs': return 'decembris'
        if form == 'genitivs': return 'decembra'
        if form == 'dativs': return 'decembrim'
        if form == 'akuzativs': return 'decembri'
        if form == 'instrumentalis': return 'ar decembri'
        if form == 'lokativs': return 'decembrī'
        if form == 'vokativs': return 'decembri'

def formatDate(_date, form=None):
    if type(_date) != date:
        # convert ISO8601 string to date object
        _date = date(int(_date[0:4]), int(_date[5:7]), int(_date[8:10]))
    return '{0}.gada {1}.{2}'.format(_date.year, _date.day,
        _month_form_lookup(_date.month, form=form))

def install_view_utilities(jinja_env):
    jinja_env.globals['formatDate'] = formatDate
