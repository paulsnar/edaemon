# coding: utf-8

from datetime import date

def _month_form_lookup(month, form='nominativs'):
    if month == 1:
        if form == 'nominativs': return u'janvāris'
        if form == 'genitivs': return u'janvāra'
        if form == 'dativs': return u'janvārim'
        if form == 'akuzativs': return u'janvāri'
        if form == 'instrumentalis': return u'ar janvāri'
        if form == 'lokativs': return u'janvārī'
        if form == 'vokativs': return u'janvāri'
    elif month == 2:
        if form == 'nominativs': return u'februāris'
        if form == 'genitivs': return u'februāra'
        if form == 'dativs': return u'februārim'
        if form == 'akuzativs': return u'februāri'
        if form == 'instrumentalis': return u'ar februāri'
        if form == 'lokativs': return u'februārī'
        if form == 'vokativs': return u'februāri'
    elif month == 3:
        if form == 'nominativs': return u'marts'
        if form == 'genitivs': return u'marta'
        if form == 'dativs': return u'martam'
        if form == 'akuzativs': return u'martu'
        if form == 'instrumentalis': return u'ar martu'
        if form == 'lokativs': return u'martā'
        if form == 'vokativs': return u'mart'
    elif month == 4:
        if form == 'nominativs': return u'aprīlis'
        if form == 'genitivs': return u'aprīļa'
        if form == 'dativs': return u'aprīlim'
        if form == 'akuzativs': return u'aprīli'
        if form == 'instrumentalis': return u'ar aprīli'
        if form == 'lokativs': return u'aprīlī'
        if form == 'vokativs': return u'aprīl'
    elif month == 5:
        if form == 'nominativs': return u'maijs'
        if form == 'genitivs': return u'maija'
        if form == 'dativs': return u'maijam'
        if form == 'akuzativs': return u'maiju'
        if form == 'instrumentalis': return u'ar maiju'
        if form == 'lokativs': return u'maijā'
        if form == 'vokativs': return u'maij'
    elif month == 6:
        if form == 'nominativs': return u'jūnijs'
        if form == 'genitivs': return u'jūnija'
        if form == 'dativs': return u'jūnijam'
        if form == 'akuzativs': return u'jūniju'
        if form == 'instrumentalis': return u'ar jūniju'
        if form == 'lokativs': return u'jūnijā'
        if form == 'vokativs': return u'jūnij'
    elif month == 7:
        if form == 'nominativs': return u'jūlijs'
        if form == 'genitivs': return u'jūlija'
        if form == 'dativs': return u'jūlijam'
        if form == 'akuzativs': return u'jūliju'
        if form == 'instrumentalis': return u'ar jūliju'
        if form == 'lokativs': return u'jūlijā'
        if form == 'vokativs': return u'jūlij'
    elif month == 8:
        if form == 'nominativs': return u'augusts'
        if form == 'genitivs': return u'augusta'
        if form == 'dativs': return u'augustam'
        if form == 'akuzativs': return u'augustu'
        if form == 'instrumentalis': return u'ar augustu'
        if form == 'lokativs': return u'augustā'
        if form == 'vokativs': return u'august'
    elif month == 9:
        if form == 'nominativs': return u'septembris'
        if form == 'genitivs': return u'septembra'
        if form == 'dativs': return u'septembrim'
        if form == 'akuzativs': return u'septembri'
        if form == 'instrumentalis': return u'ar septembri'
        if form == 'lokativs': return u'septembrī'
        if form == 'vokativs': return u'septembri'
    elif month == 10:
        if form == 'nominativs': return u'oktobris'
        if form == 'genitivs': return u'oktobra'
        if form == 'dativs': return u'oktobrim'
        if form == 'akuzativs': return u'oktobri'
        if form == 'instrumentalis': return u'ar oktobri'
        if form == 'lokativs': return u'oktobrī'
        if form == 'vokativs': return u'oktobri'
    elif month == 11:
        if form == 'nominativs': return u'novembris'
        if form == 'genitivs': return u'novembra'
        if form == 'dativs': return u'novembrim'
        if form == 'akuzativs': return u'novembri'
        if form == 'instrumentalis': return u'ar novembri'
        if form == 'lokativs': return u'novembrī'
        if form == 'vokativs': return u'novembri'
    elif month == 12:
        if form == 'nominativs': return u'decembris'
        if form == 'genitivs': return u'decembra'
        if form == 'dativs': return u'decembrim'
        if form == 'akuzativs': return u'decembri'
        if form == 'instrumentalis': return u'ar decembri'
        if form == 'lokativs': return u'decembrī'
        if form == 'vokativs': return u'decembri'

def format_date(_date, form='nominativs'):
    if type(_date) != date:
        try:
            _date = date(int(_date[0:4]), int(_date[5:7]), int(_date[8:10]))
        except ValueError:
            if form == 'nominativs': return u'nezināms datums'
            if form == 'genitivs': return u'nezināma datuma'
            if form == 'dativs': return u'nezināmam datumam'
            if form == 'akuzativs': return u'nezināmu datumu'
            if form == 'instrumentalis': return u'ar nezināmu datumu'
            if form == 'lokativs': return u'nezināmā datumā'
            if form == 'vokativs': return u'nezināmais datum'
        return u'{0}.gada {1}.{2}'.format(_date.year, _date.day,
            _month_form_lookup(_date.month, form=form))

